import React, { useState, useEffect } from 'react';
import { format, set } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../auth/AuthContext';
import fetchApi from '../api/fetch';
import { groupBadges } from '../data/badges';
import { findUserId, findUserLastname, findUserFirstname, findUserIdByEmail } from '../utils/user';
import { findAllRooms, findRoomId, findRoomName } from '../utils/room';
import { findAllGroups, findGroupId, findGroupName } from '../utils/group';
import { findLastEventId, findAllEvents } from '../utils/event';
import { createNotification, findLastNotificationId } from '../utils/notification';
import { getStatusId } from '../utils/status';
import { findLastParticipantId } from '../utils/participant';

import type { Event, DisplayInputsProps } from '../types/Event';
import type { Room } from '../types/Room';
import type { Group } from '../types/group';
import type { User } from '../types/user';
import type { Notification } from '../types/notification';
import type { UserParticipant } from '../types/user';

const MONTH_NAMES: string[] = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const DAYS: string[] = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const Calendar: React.FC = () => {
    const { user } = useAuth();
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year] = useState<number>(new Date().getFullYear());
    const [noOfDays, setNoOfDays] = useState<number[]>([]);
    const [blankDays, setBlankDays] = useState<number[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [openEventModal, setOpenEventModal] = useState<boolean>(false);
    const [openEventDetailsModal, setOpenEventDetailsModal] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<string>('');
    const [deleteButton, setDeleteButton] = useState<boolean>(false);

    const [participantEmails, setParticipantEmails] = useState<string[]>([]);
    const [inputCount, setInputCount] = useState<number>(1);
    const [showAddInput, setShowAddInput] = useState<boolean>(true);

    const [eventTitle, setEventTitle] = useState<string>('');
    const [eventDesc, setEventDesc] = useState<string>('');
    const [eventDate, setEventDate] = useState<Date | null>(null);
    const [eventGroup, setEventGroup] = useState<string>('MSc');
    const [eventRoom, setEventRoom] = useState<string>('1');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');

    const [loadedGroups, setLoadedGroups] = useState<Group[]>([]);
    const [loadedRooms, setLoadedRooms] = useState<Room[]>([]);

    const [success, setSuccess] = useState<string>('');

    const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGroup(event.target.value);
    };

    const handleRoomChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRoom(event.target.value);
    };

    useEffect((): void => {
        const getNoOfDays = (): void => {
            const firstDayOfMonth = new Date(year, month, 1);
            const daysInMonth: number = new Date(year, month + 1, 0).getDate();
            const indexOfFirstDay: number = (firstDayOfMonth.getDay() + 6) % 7;
            setBlankDays(Array.from({ length: indexOfFirstDay }, (_: unknown, i: number): number => i));
            setNoOfDays(Array.from({ length: daysInMonth }, (_: unknown, i: number): number => i + 1));
        };
        getNoOfDays();
    }, [month, year]);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            if (!user) {
                return;
            }

            const selectedGroupId: number | undefined = await findGroupId(selectedGroup, user);
            const selectedRoomId: number | undefined = await findRoomId(selectedRoom, user);
            const allEvents: any = await findAllEvents<User>(user);
            let filteredEvents: any = allEvents;

            if (selectedGroup) {
                filteredEvents = allEvents.filter((event: any): boolean => event.groupId === selectedGroupId);
            }

            if (selectedRoom) {
                filteredEvents = filteredEvents.filter((event: any): boolean => event.roomId === selectedRoomId);
            }

            filteredEvents = filteredEvents.filter((event: any): boolean => event.statusId !== 3 && event.statusId !== 2);

            setEvents(filteredEvents || []);

            const fetchedGroups: any = await findAllGroups<User>(user);
            setLoadedGroups(fetchedGroups || []);

            const fetchedRooms: any = await findAllRooms<User>(user);
            setLoadedRooms(fetchedRooms || []);
        };

        fetchData();
    }, [user, selectedGroup, selectedRoom]);

    const handleEventClick = (event: Event): void => {
        setSelectedEvent(event);
        setOpenEventDetailsModal(true);

        if (user?.is_admin || event.hostName === user?.lastName) {
            setDeleteButton(true);
        } else {
            setDeleteButton(false);
        }
    };

    const handleAddInputClick = (): void => {
        setInputCount(inputCount + 1);
        setShowAddInput(false);
    };

    const handleInputChange = (index: number, value: string): void => {
        setParticipantEmails((prevEmails) => {
            const updatedEmails = [...prevEmails];
            updatedEmails[index] = value;
            return updatedEmails;
        });
    };

    const renderParticipantInputs = (): JSX.Element[] => {
        return Array.from({ length: inputCount }, (_, index) => (
            <input
                key={index}
                className="bg-gray-200 appearance-none border-2 border-gray-200 mt-3 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                type="text"
                placeholder="Adresse e-mail du participant"
                onChange={(e) => handleInputChange(index, e.target.value)}
            />
        ));
    };

    const deleteEvent = async (): Promise<void> => {
        const response = await fetchApi('DELETE', `events/${selectedEvent?.id}`, undefined, {
            headers: {
                Authorization: `Bearer ${user?.token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (response.success) {
            alert('Événement supprimé avec succès !');

            if (selectedEvent && user) {
                const hostId: number | undefined = await findUserId(selectedEvent.hostName ?? '', user);
                const lastNotificationId: number | undefined = await findLastNotificationId(user);

                const notification: Notification = {
                    id: (lastNotificationId ?? 0) + 1,
                    userId: hostId ?? 0,
                    message: `L'événement ${selectedEvent.name} a été supprimé.`,
                };

                const create: any = await createNotification(user, notification);

                if (create.success) {
                    console.log('Notification créée avec succès');
                } else {
                    console.error('Erreur lors de la création de la notification :', create.error);
                }
            }

            setEvents(events.filter(event => event.id !== selectedEvent?.id));
            setOpenEventDetailsModal(false);
        } else {
            alert('Échec de la suppression de l\'événement.');
        }
    };

    const handleSubmit = async (): Promise<void> => {
        try {
            if (!eventTitle || !eventDate || !startTime || !endTime || startTime >= endTime) {
                alert("Certains champs sont invalides");
                return;
            }

            const isAdmin: boolean = user?.is_admin ?? false;
            let statusId: number = 0;

            const fetchStatusId = async (): Promise<void> => {
                if (isAdmin) {
                    const validatedStatusId = await getStatusId('Validé', user);
                    statusId = validatedStatusId || 1;
                } else {
                    const inProgressStatusId = await getStatusId('En cours', user);
                    statusId = inProgressStatusId || 4;
                }
            };

            const groupId = await findGroupId(eventGroup, user) || 1;
            const roomId = await findRoomId(eventRoom, user) || 1;

            await fetchStatusId();

            const lastEventId: number = await findLastEventId(user);

            const newEvent: Event = {
                id: lastEventId + 1,
                dateStart: new Date(eventDate.setHours(parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1]))),
                dateEnd: new Date(eventDate.setHours(parseInt(endTime.split(':')[0]), parseInt(endTime.split(':')[1]))),
                statusId: statusId,
                name: eventTitle,
                description: eventDesc,
                groupId: groupId,
                roomId: roomId,
                hostName: user ? `${user.lastName}` : null,
            };

            try {
                const registerEvent = await fetchApi<Event>('POST', 'events/', JSON.stringify(newEvent), {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                const registerParticipants = async (): Promise<void> => {
                    if (participantEmails.length > 0 && user) {
                        for (let i: number = 0; i < participantEmails.length; i++) {
                            const participantId: number | undefined = await findUserIdByEmail(participantEmails[i], user);

                            if (participantId) {
                                const lastParticipantId: number = await findLastParticipantId(user);

                                const newParticipant: UserParticipant = {
                                    id: lastParticipantId + 1,
                                    eventId: newEvent.id,
                                    userId: participantId,
                                };

                                console.log('newParticipant:', newParticipant);

                                await fetchApi<UserParticipant>('POST', 'participants/', JSON.stringify(newParticipant), {
                                    headers: {
                                        Authorization: `Bearer ${user.token}`,
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                });

                                const lastNotificationId: number | undefined = await findLastNotificationId(user);

                                const notification: Notification = {
                                    id: (lastNotificationId ?? 0) + 1,
                                    userId: participantId,
                                    message: `Vous avez été invité à l'événement ${newEvent.name} par ${user.lastName} ${user.firstName}.`,
                                };

                                const create: any = await createNotification(user, notification);

                                if (create.success) {
                                    console.log('Notification créée avec succès');
                                } else {
                                    console.error('Erreur lors de la création de la notification :', create.error);
                                }
                            }
                        }
                    }
                };

                if (registerEvent.success) {
                    await registerParticipants();
                    alert("Événement ajouté avec succès");
                    setEvents([...events, (registerEvent.data as Event)]);
                    resetForm();

                    if (user) {
                        const hostId: number | undefined = await findUserId(user.lastName, user);
                        const lastNotificationId: number | undefined = await findLastNotificationId(user);

                        const message = user.is_admin ? `L'événement ${newEvent.name} a été validé.` : `Votre demande d'événement ${newEvent.name} a été envoyée. Elle est en cours de traitement.`;

                        const notification: Notification = {
                            id: (lastNotificationId ?? 0) + 1,
                            userId: hostId ?? 0,
                            message: message,
                        };

                        const create: any = await createNotification(user, notification);

                        if (create.success) {
                            console.log('Notification créée avec succès');
                        } else {
                            console.error('Erreur lors de la création de la notification :', create.error);
                        }
                    }
                } else if (registerEvent.error) {
                    alert(registerEvent.error);
                }
            } catch (error) {
                console.error("Une erreur s'est produite lors de l'ajout de l'événement :", error);
                alert("Une erreur s'est produite lors de l'ajout de l'événement. Veuillez réessayer plus tard.");
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de l'ajout de l'événement :", error);
            alert("Une erreur s'est produite lors de l'ajout de l'événement. Veuillez réessayer plus tard.");
        }
    };

    const displayEvents: () => { noOfDays: number[], events: React.ReactNode } = () => {
        const eventNodes: React.ReactNode[] = [];

        noOfDays.forEach((date: number, index: number) => {
            const filteredEvents = events.filter((event: any) => new Date(event.dateStart).toDateString() === new Date(year, month, date).toDateString());
            const renderedEvents = filteredEvents.map((event: any, idx: number) => {
                const groupBadgeClassNames = event.groupId !== undefined && groupBadges[event.groupId - 1] ? groupBadges[event.groupId - 1].classNames : '';
                return (
                    <div key={idx} onClick={(): void => handleEventClick(event)} className={`px-2 py-1 cursor-pointer rounded-lg mt-1 overflow-hidden border ${groupBadgeClassNames}`}>
                        <p className="text-sm truncate leading-tight">{event.name}</p>
                    </div>
                );
            });

            eventNodes.push(
                <div key={index} style={{ width: '14.28%', height: '120px' }} className="px-4 pt-2 border-r border-b relative">
                    <div onClick={(): void => { setOpenEventModal(true); setEventDate(new Date(year, month, date)); }} className={`inline-flex w-6 h-6 items-center justify-center cursor-pointer text-center leading-none rounded-full transition ease-in-out duration-100 ${new Date(year, month, date).toDateString() === new Date().toDateString() ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-200'}`}>
                        {date}
                    </div>
                    <div style={{ height: '80px' }} className="overflow-y-auto mt-1">
                        {renderedEvents}
                    </div>
                </div>
            );
        });

        return { noOfDays, events: eventNodes };
    };

    const resetForm = (): void => {
        setEventTitle('');
        setEventDesc('');
        setEventDate(null);
        setEventGroup('MSc');
        setEventRoom('1');
        setStartTime('');
        setEndTime('');
        setParticipantEmails([]);
        setInputCount(1);
        setShowAddInput(true);
        setOpenEventModal(false);
    };

    const formatDate = (date: Date): string => {
        return format(date, "EEEE d MMMM yyyy", { locale: fr });
    };

    return (
        <div className="antialiased sans-serif bg-gray-100 h-screen">
            <div className="container-fluid mx-auto px-4 py-2 md:py-24">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="flex items-center justify-between py-2 px-6">
                        <div className="flex justify-between items-center gap-12">
                            <div>
                                <span className="text-lg font-bold text-gray-800">{MONTH_NAMES[month]}</span>
                                <span className="ml-1 text-lg text-gray-600 font-normal">{year}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <form className="max-w-sm mx-auto">
                                <label htmlFor="underline_select" className="sr-only">Groupe</label>
                                <select
                                    id="underline_select"
                                    className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-2 py-1.5 pr-4 rounded-lg leading-tight text-gray-200"
                                    value={selectedGroup}
                                    onChange={handleGroupChange}
                                >
                                    <option value="">Filtre par groupe</option>
                                    {loadedGroups.map(group => (
                                        <option key={group.id} value={group.name}>{group.name}</option>
                                    ))}
                                </select>
                            </form>
                            <form className="max-w-sm mx-auto">
                                <label htmlFor="underline_select_room" className="sr-only">Salle</label>
                                <select
                                    id="underline_select_room"
                                    className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-2 py-1.5 pr-4 rounded-lg leading-tight text-gray-200"
                                    value={selectedRoom}
                                    onChange={handleRoomChange}
                                >
                                    <option value="">Filtre par salle</option>
                                    {loadedRooms.map(room => (
                                        <option key={room.id} value={room.name}>{room.name}</option>
                                    ))}
                                </select>
                            </form>
                            <div className="border rounded-lg px-1" style={{ paddingTop: '2px' }}>
                                <button onClick={(): void => setMonth(month - 1)} disabled={month === 0} type="button" className="leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                                    </svg>
                                </button>
                                <div className="border-r inline-flex h-6"></div>
                                <button onClick={(): void => setMonth(month + 1)} disabled={month === 11} type="button" className="leading-none rounded-lg transition ease-in-out duration-100 inline-flex items-center cursor-pointer hover:bg-gray-200 p-1">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="-mx-1 -mb-1">
                        <div className="flex flex-wrap" style={{ marginBottom: '-40px' }}>
                            {DAYS.map((day: string, index: number) => (
                                <div key={index} style={{ width: '14.26%' }} className="px-2 py-2">
                                    <div className="text-gray-600 text-sm uppercase tracking-wide font-bold text-center">{day}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap border-t border-l">
                            {blankDays.map((_: number, index: number) => (
                                <div key={index} style={{ width: '14.28%', height: '120px' }} className="text-center border-r border-b px-4 pt-2"></div>
                            ))}
                            {displayEvents().events}
                        </div>
                    </div>
                </div>
                {openEventModal && (
                    <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} className="fixed z-50 top-0 right-0 left-0 bottom-0 h-full w-full">
                        <div className="p-4 max-w-2xl mx-auto relative absolute left-0 right-0 overflow-hidden mt-10">
                            <div className="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer" onClick={() => resetForm()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div className="shadow w-full rounded-lg bg-white overflow-hidden block max-h-[90vh] overflow-y-auto p-8">
                                    <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">Ajouter un événement</h2>
                                    <div className="mb-4">
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Titre de l'événement</label>
                                        <input
                                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                            type="text"
                                            onChange={(e) => setEventTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Description de l'événement</label>
                                        <textarea
                                            name="eventDesc"
                                            rows={4}
                                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 resize-none"
                                            onChange={(e) => setEventDesc(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex justify-between space-x-4 mb-4">
                                        <div className="w-2/3">
                                            <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Date de l'événement</label>
                                            <input
                                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                                type="text"
                                                value={eventDate ? formatDate(eventDate) : ''}
                                                readOnly
                                            />
                                        </div>
                                        <div className="w-1/3">
                                            <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Heure de début</label>
                                            <input
                                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                                type="time"
                                                onChange={(e) => setStartTime(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Heure de fin</label>
                                        <input
                                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                            type="time"
                                            onChange={(e): void => setEndTime(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-between space-x-4 mb-4">
                                        <div className='w-2/3'>
                                            <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Groupe</label>
                                            <select
                                                className="block appearance-none w-full bg-gray-200 border-2 border-gray-200 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-gray-700"
                                                onChange={(e): void => setEventGroup(e.target.value)}
                                            >
                                                {loadedGroups.map((group: Group, index: number) => (
                                                    <option key={index} value={group.name}>{group.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='w-1/3'>
                                            <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Salle</label>
                                            <select
                                                className="block appearance-none w-full bg-gray-200 border-2 border-gray-200 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-gray-700"
                                                onChange={(e) => setEventRoom(e.target.value)}
                                            >
                                                {loadedRooms.map((room: Room, index: number) => (
                                                    <option key={index} value={room.name}>{room.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Participants</label>
                                        {renderParticipantInputs()}
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                className="bg-white hover:bg-gray-100 text-gray-700 mt-3 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm"
                                                onClick={handleAddInputClick}
                                            >
                                                Ajouter un participant
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-8 text-right">
                                        <button
                                            type="button"
                                            className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm mr-2"
                                            onClick={() => setOpenEventModal(false)}
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-blue-700 rounded-lg shadow-sm"
                                            onClick={handleSubmit}
                                        >
                                            {user?.is_admin ? 'Enregistrer' : 'Faire une demande'}
                                        </button>
                                    </div>
                            </div>
                        </div>
                    </div>
                )}
                {openEventDetailsModal && selectedEvent && (
                    <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} className="fixed z-50 top-0 right-0 left-0 bottom-0 h-full w-full">
                        <div className="p-4 max-w-xl mx-auto relative absolute left-0 right-0 overflow-hidden mt-24">
                            <div className="shadow w-full rounded-lg bg-white overflow-hidden block max-h-[80vh] overflow-y-auto p-8">
                                <div className="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer" onClick={() => setOpenEventDetailsModal(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">Détails de l'événement</h2>
                                <div className="flex justify-between space-x-4 mb-4">
                                    <div className='w-2/3'>
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Titre de l'événement</label>
                                        <input
                                            name="eventDesc"
                                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 resize-none"
                                            value={selectedEvent.name}
                                            readOnly
                                        />
                                    </div>
                                    <div className='w-1/3'>
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Lead</label>
                                        <input
                                            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500'
                                            type='text'
                                            value={selectedEvent.hostName ? selectedEvent.hostName : 'Utilisateur inconnu'}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Description de l'événement</label>
                                    <textarea
                                        name="eventDesc"
                                        rows={4}
                                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 resize-none"
                                        value={selectedEvent.description}
                                        readOnly
                                    />
                                </div>
                                <div className="flex justify-between space-x-4 mb-4">
                                    <div className="w-2/3">
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Début de l'événement</label>
                                        <input
                                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                            type="text"
                                            value={selectedEvent ? `${formatDate(new Date(selectedEvent.dateStart))}` : ''}
                                            readOnly
                                        />
                                    </div>
                                    <div className='w-1/3'>
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Heure de début</label>
                                        <input
                                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                            type="text"
                                            value={selectedEvent.dateStart ? format(selectedEvent.dateStart, "HH:mm") : ''}
                                            readOnly
                                        />
                                    </div>
                                    <div className='w-1/3'>
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Heure de fin</label>
                                        <input
                                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                            type="text"
                                            value={selectedEvent.dateEnd ? format(selectedEvent.dateEnd, "HH:mm") : ''}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between space-x-4 mb-4">
                                    <DisplayInputs selectedEvent={selectedEvent} userData={user} />
                                </div>
                                {deleteButton && (
                                    <button onClick={deleteEvent} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-10">
                                        Supprimer l'événement
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DisplayInputs: React.FC<DisplayInputsProps> = ({ selectedEvent, userData }) => {
    const [groupName, setGroupName] = useState<string>('');
    const [roomName, setRoomName] = useState<string>('');

    useEffect(() => {
        const fetchGroupName = async (): Promise<void> => {
            try {
                const groupName = await findGroupName(selectedEvent.groupId, userData) || 'Groupe inconnu';
                setGroupName(groupName);
            } catch (error) {
                console.error('Erreur lors de la récupération du nom du groupe :', error);
            }
        };

        const fetchRoomName = async (): Promise<void> => {
            try {
                const roomName = await findRoomName(selectedEvent.roomId, userData) || 'Salle inconnue';
                setRoomName(roomName);
            } catch (error) {
                console.error('Erreur lors de la récupération du nom de la salle :', error);
            }
        };

        fetchGroupName();
        fetchRoomName();
    }, [selectedEvent, userData]);

    return (
        <>
            <div className='w-2/3'>
                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Groupe</label>
                <input
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500'
                    type='text'
                    value={groupName}
                    readOnly
                />
            </div>
            <div className='w-1/3'>
                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Salle</label>
                <input
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500'
                    type='text'
                    value={roomName}
                    readOnly
                />
            </div>
        </>
    );
};