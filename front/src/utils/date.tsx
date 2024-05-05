import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (dateOrString: Date | string): string => {
    if (typeof dateOrString === 'string') {
        const date = new Date(dateOrString);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric'
        } as Intl.DateTimeFormatOptions;
        return date.toLocaleString('fr-FR', options);
    } else {
        return format(dateOrString, "EEEE d MMMM yyyy", { locale: fr });
    }
};

export const formatDateHour = (dateString: string): string => {
    const date = new Date(dateString);
    const options = {
        hour: 'numeric',
        minute: 'numeric'
    } as Intl.DateTimeFormatOptions;
    return date.toLocaleString('fr-FR', options);
}