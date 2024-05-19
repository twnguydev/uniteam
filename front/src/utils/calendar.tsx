import type { Event } from '../types/Event';
import type { User } from '../types/user';
import { findRoomName } from './room';
import { format, toZonedTime } from 'date-fns-tz';

export const generateGoogleCalendarLink = async (event: Event, user: User): Promise<string> => {
    const getRoomName: string | undefined = await findRoomName(event.roomId, user);
    const startTime: string = new Date(event.dateStart).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endTime: string = new Date(event.dateEnd).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const details: string = encodeURIComponent(event.description);
    const location: string = getRoomName ? encodeURIComponent(getRoomName) : encodeURIComponent('Unknown location');
    const title: string = encodeURIComponent(event.name);

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}&sf=true&output=xml`;
};

export const generateOutlookCalendarLink = async (event: Event, user: User): Promise<string> => {
    const getRoomName: string | undefined = await findRoomName(event.roomId, user);

    const zonedStartTime: Date = toZonedTime(new Date(event.dateStart), 'Europe/Paris');
    const zonedEndTime: Date = toZonedTime(new Date(event.dateEnd), 'Europe/Paris');
    const startTime: string = format(zonedStartTime, "yyyyMMdd'T'HHmmss'Z'");
    const endTime: string = format(zonedEndTime, "yyyyMMdd'T'HHmmss'Z'");

    const details: string = event.description.replace(/\n/g, '\\n');
    const location: string = getRoomName ? getRoomName : 'Unknown location';
    const title: string = event.name;

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Organization//Your Product//EN
BEGIN:VEVENT
UID:${event.id}
DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss'Z'")}
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${title}
DESCRIPTION:${details}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url: string = URL.createObjectURL(blob);
    return url;
};

export const generateAppleCalendarLink = async (event: Event, user: User): Promise<string> => {
    const getRoomName: string | undefined = await findRoomName(event.roomId, user);
    const startTime: string = new Date(event.dateStart).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endTime: string = new Date(event.dateEnd).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const details: string = event.description.replace(/\n/g, '\\n');
    const location: string = getRoomName ? getRoomName : 'Unknown location';
    const title: string = event.name;

    const icsContent: string = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${title}
DESCRIPTION:${details}
LOCATION:${location}
END:VEVENT
END:VCALENDAR
    `.trim();

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url: string = URL.createObjectURL(blob);
    return url;
};