import random
import string
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify if a plain password matches a hashed password.

    Args:
        plain_password (str): The plain password to verify.
        hashed_password (str): The hashed password to compare against.

    Returns:
        bool: True if the plain password matches the hashed password, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Generate a hash of the given password.

    Args:
        password (str): The password to be hashed.

    Returns:
        str: The hashed password.

    """
    return pwd_context.hash(password)

def generate_random_password(length: int = 8) -> str:
    """
    Generate a random password.

    Args:
        length (int): The length of the password. Defaults to 8.

    Returns:
        str: The generated password.
    """

    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))