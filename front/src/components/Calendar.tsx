import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../auth/AuthContext';

import { findRoomId, findRoomName } from '../utils/room';
import { findGroupId, findGroupName } from '../utils/group';
import { findUserLastname } from '../utils/user';
import { findLastEventId } from '../utils/event';

import type { Event } from '../types/Event';
import type { Room } from '../types/Room';
import type { Group } from '../types/group';

const MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const groups: Group[] = [
    { id: 1, name: "MSc" },
    { id: 2, name: "Web@cademie" },
    { id: 3, name: "PGE" },
    { id: 4, name: "Peda" },
];

const rooms: Room[] = [
    { id: 1, name: "1-1" },
    { id: 2, name: "1-2" },
    { id: 3, name: "1-3" },
];

export const Calendar: React.FC = () => {
    const { user } = useAuth();
    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year] = useState<number>(new Date().getFullYear());
    const [noOfDays, setNoOfDays] = useState<number[]>([]);
    const [blankDays, setBlankDays] = useState<number[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [openEventModal, setOpenEventModal] = useState<boolean>(false);
    const [openEventDetailsModal, setOpenEventDetailsModal] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const [eventTitle, setEventTitle] = useState<string>('');
    const [eventDesc, setEventDesc] = useState<string>('');
    const [eventDate, setEventDate] = useState<Date | null>(null);
    const [eventGroup, setEventGroup] = useState<string>('MSc');
    const [eventRoom, setEventRoom] = useState<string>('1');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');

    useEffect(() => {
        const getNoOfDays = () => {
            const firstDayOfMonth = new Date(year, month, 1);
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const indexOfFirstDay = (firstDayOfMonth.getDay() + 6) % 7;
            setBlankDays(Array.from({ length: indexOfFirstDay }, (_, i) => i));
            setNoOfDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
        };
        getNoOfDays();
    }, [month, year]);

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setOpenEventDetailsModal(true);
    };

    const addEvent = () => {
        if (user?.admin) {
            if (eventTitle && eventDate && startTime && endTime && startTime < endTime) {
                const newEvent: Event = {
                    id: findLastEventId() + 1,
                    date_start: new Date(eventDate.setHours(parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1]))),
                    date_end: new Date(eventDate.setHours(parseInt(endTime.split(':')[0]), parseInt(endTime.split(':')[1]))),
                    statusId: 1,
                    name: eventTitle,
                    description: eventDesc,
                    groupId: findGroupId(eventGroup) || 1,
                    roomId: findRoomId(eventRoom) || 1,
                    creatorId: user?.id || 0,
                };
                setEvents([...events, newEvent]);
                resetForm();
                setOpenEventModal(false);
            } else {
                alert("Certains champs sont invalides");
            }
        } else {
            if (eventTitle && eventDate && startTime && endTime && startTime < endTime) {
                resetForm();
                setOpenEventModal(false);
            } else {
                alert("Certains champs sont invalides");
            }
        }
    };

    const resetForm = () => {
        setEventTitle('');
        setEventDesc('');
        setEventDate(null);
        setEventGroup('MSc');
        setEventRoom('1');
        setStartTime('');
        setEndTime('');
    };

    const formatDate = (date: Date): string => {
        return format(date, "EEEE d MMMM yyyy", { locale: fr });
    };

    return (
        <div className="antialiased sans-serif bg-gray-100 h-screen">
            <div className="container-fluid mx-auto px-4 py-2 md:py-24">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="flex items-center justify-between py-2 px-6">
                        <div>
                            <span className="text-lg font-bold text-gray-800">{MONTH_NAMES[month]}</span>
                            <span className="ml-1 text-lg text-gray-600 font-normal">{year}</span>
                        </div>
                        <div className="border rounded-lg px-1" style={{ paddingTop: '2px' }}>
                            <button onClick={() => setMonth(month - 1)} disabled={month === 0} type="button" className="leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                                </svg>
                            </button>
                            <div className="border-r inline-flex h-6"></div>
                            <button onClick={() => setMonth(month + 1)} disabled={month === 11} type="button" className="leading-none rounded-lg transition ease-in-out duration-100 inline-flex items-center cursor-pointer hover:bg-gray-200 p-1">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="-mx-1 -mb-1">
                        <div className="flex flex-wrap" style={{ marginBottom: '-40px' }}>
                            {DAYS.map((day, index) => (
                                <div key={index} style={{ width: '14.26%' }} className="px-2 py-2">
                                    <div className="text-gray-600 text-sm uppercase tracking-wide font-bold text-center">{day}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap border-t border-l">
                            {blankDays.map((_, index) => (
                                <div key={index} style={{ width: '14.28%', height: '120px' }} className="text-center border-r border-b px-4 pt-2"></div>
                            ))}
                            {noOfDays.map((date, index) => (
                                <div key={index} style={{ width: '14.28%', height: '120px' }} className="px-4 pt-2 border-r border-b relative">
                                    <div onClick={() => { setOpenEventModal(true); setEventDate(new Date(year, month, date)); }} className={`inline-flex w-6 h-6 items-center justify-center cursor-pointer text-center leading-none rounded-full transition ease-in-out duration-100 ${new Date(year, month, date).toDateString() === new Date().toDateString() ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-200'}`}>
                                        {date}
                                    </div>
                                    <div style={{ height: '80px' }} className="overflow-y-auto mt-1">
                                        {events.filter(e => new Date(e.date_start).toDateString() === new Date(year, month, date).toDateString()).map((event, idx) => (
                                            <div key={idx} onClick={() => handleEventClick(event)} className={`px-2 py-1 rounded-lg mt-1 overflow-hidden border ${ { 1: 'border-blue-200 text-blue-800 bg-blue-100', 2: 'border-red-200 text-red-800 bg-red-100', 3: 'border-yellow-200 text-yellow-800 bg-yellow-100', 4: 'border-green-200 text-green-800 bg-green-100' }[event.groupId]}`}>
                                                <p className="text-sm truncate leading-tight">{event.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {openEventModal && (
                    <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} className="fixed z-50 top-0 right-0 left-0 bottom-0 h-full w-full">
                        <div className="p-4 max-w-xl mx-auto relative absolute left-0 right-0 overflow-hidden mt-24">
                            <div className="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer" onClick={() => setOpenEventModal(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div className="shadow w-full rounded-lg bg-white overflow-hidden block max-h-[80vh] overflow-y-auto p-8">
                                <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">Ajouter un événement</h2>
                                <div className="mb-4">
                                    <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Titre de l'événement</label>
                                    <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" type="text" onChange={(e) => setEventTitle(e.target.value)} />
                                </div>
                                <div className="mb-4">
                                    <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Description de l'événement</label>
                                    <textarea name="eventDesc" rows={4} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 resize-none" onChange={(e) => setEventDesc(e.target.value)} />
                                </div>

                                <div className="flex justify-between space-x-4 mb-4">
                                    <div className="w-2/3">
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Date de l'événement</label>
                                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" type="text" value={eventDate ? formatDate(eventDate) : ''} readOnly />
                                    </div>
                                    <div className="w-1/3">
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Heure de début</label>
                                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" type="time" onChange={(e) => setStartTime(e.target.value)} />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Heure de fin</label>
                                    <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" type="time" onChange={(e) => setEndTime(e.target.value)} />
                                </div>
                                <div className="flex justify-between space-x-4 mb-4">
                                    <div className='w-2/3'>
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Groupe</label>
                                        <select className="block appearance-none w-full bg-gray-200 border-2 border-gray-200 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-gray-700" onChange={(e) => setEventGroup(e.target.value)}>
                                            {groups.map((group, index) => (
                                                <option key={index} value={group.name}>{group.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='w-1/3'>
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Salle</label>
                                        <select className="block appearance-none w-full bg-gray-200 border-2 border-gray-200 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-gray-700" onChange={(e) => setEventRoom(e.target.value)}>
                                            {rooms.map((room, index) => (
                                                <option key={index} value={room.name}>{room.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-8 text-right">
                                    <button type="button" className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm mr-2" onClick={() => setOpenEventModal(false)}>Annuler</button>
                                    {user?.admin ? (
                                        <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-blue-700 rounded-lg shadow-sm" onClick={addEvent}>Enregistrer</button>
                                    ) : (
                                        <button type="button" className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-blue-700 rounded-lg shadow-sm' onClick={addEvent}>Faire une demande</button>
                                    )}
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
                                        <input name="eventDesc" className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 resize-none " value={selectedEvent.name} readOnly/>
                                    </div>
                                    <div className='w-1/3'>
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Lead</label>
                                        <input
                                            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500'
                                            type='text'
                                            value={selectedEvent.creatorId ? findUserLastname(selectedEvent.creatorId) : 'Utilisateur inconnu'}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Description de l'événement</label>
                                    <textarea name="eventDesc" rows={4} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 resize-none " value={selectedEvent.description} readOnly/>
                                </div>
                                <div className="flex justify-between space-x-4 mb-4">
                                    <div className="w-2/3">
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Début de l'événement</label>
                                        <input
                                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                            type="text"
                                            value={selectedEvent ? `${formatDate(new Date(selectedEvent.date_start))}` : ''}
                                            readOnly
                                        />
                                    </div>
                                    <div className='w-1/3'>
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Heure de début</label>
                                            <input
                                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                                type="text"
                                                value={selectedEvent.date_start ? format(selectedEvent.date_start, "HH:mm") : ''}
                                                readOnly
                                            />
                                    </div>
                                    <div className='w-1/3'>
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Heure de fin</label>
                                            <input
                                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                                type="text"
                                                value={selectedEvent.date_end ? format(selectedEvent.date_end, "HH:mm") : ''}
                                                readOnly
                                            />
                                    </div>
                                </div>
                                <div className="flex justify-between space-x-4 mb-4">
                                    <div className='w-2/3'>
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Groupe</label>
                                        <input
                                            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500'
                                            type='text'
                                            value={selectedEvent.groupId ? findGroupName(selectedEvent.groupId) || 'Groupe inconnu' : ''}
                                            readOnly
                                        />
                                    </div>
                                    <div className='w-1/3'>
                                        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Salle</label>
                                        <input
                                            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500'
                                            type='text'
                                            value={selectedEvent ? findRoomName(selectedEvent.roomId) || 'Salle inconnue' : ''}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};