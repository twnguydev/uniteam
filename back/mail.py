import os
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
SMTP_USERNAME = os.getenv('SMTP_USERNAME')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
URL_FRONT = os.getenv('URL_FRONT')

def send_email(subject, to_email, body):
    try:
        from_email = f"UniTeam <{SMTP_USERNAME}>"
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)

        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'plain'))

        server.send_message(msg)
        server.quit()

        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def send_welcome_email(to_email, username, password):
    subject = "Bienvenue sur la plateforme UniTeam !"
    body = f"""
    Bonjour {username},

La plateforme UniTeam vous annonce que l'administrateur a créé un compte pour vous. Voici vos informations de connexion :

    Email : {to_email}
    Mot de passe : {password}

Vous pouvez vous connecter à la plateforme en cliquant sur le lien suivant : {URL_FRONT}

    Merci,
    L'équipe UniTeam
    """
    return send_email(subject, to_email, body)

def send_contact_admin_email(from_email, name, message, subject = None):
    if not subject:
        subject = "[UniTeam] Nouvelle demande de contact"
    else:
        subject = f"[UniTeam] {subject}"
    body = f"""
    Bonjour,

Vous avez reçu un nouveau message de contact de la part de :

    Nom : {name}
    Email : {from_email}
    Message : {message}

Vérifiez toujours que cet utilisateur est bien inscrit sur la plateforme avant de répondre.

    Merci,
    L'équipe UniTeam
    """
    return send_email(subject, SMTP_USERNAME, body)