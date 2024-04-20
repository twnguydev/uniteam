export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric'
    } as Intl.DateTimeFormatOptions;
    return date.toLocaleString('fr-FR', options);
};

export const formatDateHour = (dateString: string): string => {
    const date = new Date(dateString);
    const options = {
        hour: 'numeric',
        minute: 'numeric'
    } as Intl.DateTimeFormatOptions;
    return date.toLocaleString('fr-FR', options);
}