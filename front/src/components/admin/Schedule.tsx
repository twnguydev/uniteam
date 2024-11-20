import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { ListUsers } from './list/Users';
import { ListEvents } from './list/Events';
import { ListRooms } from './list/Rooms';
import { ListGroups } from './list/Groups';
import { findAllEvents, countAllEvents } from '../../utils/event';
import { findAllGroups, findGroupId, countAllGroups } from '../../utils/group';
import { findAllStatus, getStatusId } from '../../utils/status';
import { countAllUsers } from '../../utils/user';
import { countAllRooms } from '../../utils/room';
import type { Group } from '../../types/Group';
import type { User } from '../../types/user';
import type { Status } from '../../types/Status';
import { FormRoom } from './form/Room';
import { FormGroup } from './form/Group';
import { FormUser } from './form/User';
import { Banner } from '../Banner';

export const ScheduleAdmin: React.FC = (): JSX.Element => {
    const { user } = useAuth();
    const location = useLocation();

    const [isUserListOpen, setIsUserListOpen] = useState<boolean>(false);
    const [isEventListOpen, setIsEventListOpen] = useState<boolean>(true);
    const [isGroupListOpen, setIsGroupListOpen] = useState<boolean>(false);
    const [isRoomListOpen, setIsRoomListOpen] = useState<boolean>(false);

    const [isRoomFormOpen, setIsRoomFormOpen] = useState<boolean>(false);
    const [isGroupFormOpen, setIsGroupFormOpen] = useState<boolean>(false);
    const [isUserFormOpen, setIsUserFormOpen] = useState<boolean>(false);

    const [events, setEvents] = useState<Event[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const [countUsers, setCountUsers] = useState<number>(0);
    const [countGroups, setCountGroups] = useState<number>(0);
    const [countEvents, setCountEvents] = useState<number>(0);
    const [countRooms, setCountRooms] = useState<number>(0);

    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [loadedGroups, setLoadedGroups] = useState<Group[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [loadedStatus, setLoadedStatus] = useState<Status[]>([]);
    const [selectedLimit, setSelectedLimit] = useState<string>('5');
    const [selectedDate, setSelectedDate] = useState<string>('');

    const [banner, setBanner] = useState<string>('');
    const [bannerType, setBannerType] = useState<string>('');
    const [bannerSection, setBannerSection] = useState<string>('');

    const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGroup(event.target.value);
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value);
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLimit(event.target.value);
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDate(event.target.value);
    };

    useEffect((): void => {
        const fetchCounters = async (): Promise<void> => {
            if (!user) {
                return;
            }

            const countUsers: number = await countAllUsers(user);
            setCountUsers(countUsers);

            const countGroups: number = await countAllGroups(user);
            setCountGroups(countGroups);

            const countRooms: number = await countAllRooms(user);
            setCountRooms(countRooms);

            const countEvents: number = await countAllEvents(user);
            setCountEvents(countEvents);
        };

        fetchCounters();
    }, [user, selectedGroup, selectedStatus, selectedLimit]);

    useEffect((): void => {
        const fetchData = async (): Promise<void> => {
            if (!user) return;

            const fetchedGroups: any = await findAllGroups(user);
            setLoadedGroups(fetchedGroups || []);

            const fetchedStatus: any = await findAllStatus(user);
            setLoadedStatus(fetchedStatus || []);

            const selectedGroupId: number | undefined = await findGroupId(selectedGroup, user);
            const selectedStatusId: number | undefined = await getStatusId(selectedStatus, user);

            const allEvents: any = await findAllEvents(user);

            let filteredEvents = allEvents.filter((event: any): boolean => {
                const groupMatch: boolean = selectedGroupId ? event.groupId === selectedGroupId : true;
                const statusMatch: boolean = selectedStatusId ? event.statusId === selectedStatusId : true;
                return groupMatch && statusMatch;
            });

            setEvents(filteredEvents || []);
            setUsers(filteredEvents || []);
        };

        fetchData();
    }, [user, selectedGroup, selectedStatus, selectedLimit, selectedDate]);

    useEffect((): () => void => {
        const fetchSuccess = (): void => {
            const searchParams = new URLSearchParams(window.location.search);
            const isSuccessMessage: string | null = searchParams.get('success');
            const typeOfSuccess: string | null = searchParams.get('type');
            const message: string | null = searchParams.get('message');

            if (isSuccessMessage === 'true') {
                setBanner(message || '');
                setBannerType('success');
                if (typeOfSuccess === 'room') {
                    setBannerSection('room');
                } else if (typeOfSuccess === 'event') {
                    setBannerSection('event');
                } else if (typeOfSuccess === 'user') {
                    setBannerSection('user');
                } else if (typeOfSuccess === 'group') {
                    setBannerSection('group');
                }
            }
        };

        fetchSuccess();

        const timer = setTimeout((): void => {
            setBanner('');
            setBannerType('');
            setBannerSection('');

            const newUrl: string = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }, 20000);

        return () => {
            clearTimeout(timer);
        };
    }, [location.search]);

    const toggleUserList = (): void => {
        setIsUserListOpen(!isUserListOpen);
        setIsEventListOpen(false);
        setIsGroupListOpen(false);
        setIsRoomListOpen(false);
        setIsRoomFormOpen(false);
        setIsGroupFormOpen(false);
        setIsUserFormOpen(false);
    };

    const toggleEventList = (): void => {
        setIsEventListOpen(!isEventListOpen);
        setIsUserListOpen(false);
        setIsGroupListOpen(false);
        setIsRoomListOpen(false);
        setIsRoomFormOpen(false);
        setIsGroupFormOpen(false);
        setIsUserFormOpen(false);
    };

    const toggleGroupList = (): void => {
        setIsGroupListOpen(!isGroupListOpen);
        setIsRoomListOpen(false);
        setIsUserListOpen(false);
        setIsEventListOpen(false);
        setIsRoomFormOpen(false);
        setIsGroupFormOpen(false);
        setIsUserFormOpen(false);
    };

    const toggleRoomList = (): void => {
        setIsRoomListOpen(!isRoomListOpen);
        setIsUserListOpen(false);
        setIsEventListOpen(false);
        setIsGroupListOpen(false);
        setIsRoomFormOpen(false);
        setIsGroupFormOpen(false);
        setIsUserFormOpen(false);
    };

    const toggleRoomForm = (): void => {
        setIsRoomFormOpen(!isRoomFormOpen);
        setIsRoomListOpen(!isRoomListOpen);
        setIsGroupListOpen(false);
        setIsUserListOpen(false);
        setIsEventListOpen(false);
        setIsGroupFormOpen(false);
        setIsUserFormOpen(false);
    };

    const toggleGroupForm = (): void => {
        setIsGroupFormOpen(!isGroupFormOpen);
        setIsGroupListOpen(!isGroupListOpen);
        setIsRoomListOpen(false);
        setIsUserListOpen(false);
        setIsEventListOpen(false);
        setIsRoomFormOpen(false);
        setIsUserFormOpen(false);
    };

    const toggleUserForm = (): void => {
        setIsUserFormOpen(!isUserFormOpen);
        setIsUserListOpen(!isUserListOpen);
        setIsEventListOpen(false);
        setIsGroupListOpen(false);
        setIsRoomListOpen(false);
        setIsRoomFormOpen(false);
        setIsGroupFormOpen(false);
    };

    return (
        <section className="bg-white dark:bg-gray-900 antialiased min-h-screen">
            <div className="max-w-screen-xl px-4 py-8 mx-auto lg:px-6 sm:py-16 lg:py-24">
                {banner && (
                    <div className="flex items-center justify-center mb-8">
                        <Banner type={bannerType} message={banner} />
                    </div>
                )}
                <div className="flex items-center justify-center mb-8">

                </div>
                <div className="grid grid-cols-1 gap-6 mt-8 mb-20 sm:grid-cols-2 place-content-center">
                    <div className="w-3xl mx-auto my-auto text-center">
                        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
                            Espace administrateur
                        </h2>
                        <div className="mt-4">
                            <div className="inline-flex items-center text-lg font-medium text-primary-600 text-blue-500">
                                Il vous permet de gérer toute l'architecture de votre infrastructure UniTeam.
                            </div>
                        </div>
                    </div>
                    {user ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <div className="flex flex-col items-center py-10 px-10">
                                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</h5>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Groupe {user.groupName}</span>
                                    {user.isAdmin && (
                                        <span className="text-sm mt-8 text-gray-500 dark:text-gray-400">Administrateur</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>Connectez-vous pour accéder à votre compte.</p>
                    )}
                </div>
                <div className="flex items-center justify-center gap-4 mt-8">
                    <ul className="flex text-sm font-medium cursor-pointer text-center text-gray-500 rounded-lg shadow dark:divide-gray-700 dark:text-gray-400">
                        <li className="focus-within:z-10" onClick={toggleEventList}>
                            <div className={`inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 rounded-l-lg focus:ring-4 focus:ring-blue-300 focus:outline-none ${isEventListOpen ? 'text-gray-900 dark:bg-gray-700 dark:text-white' : 'dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-white hover:bg-gray-50'}`}>Gestion des événements</div>
                        </li>
                        <li className="focus-within:z-10" onClick={toggleUserList}>
                            <div className={`inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-blue-300 focus:outline-none ${isUserListOpen || isUserFormOpen ? 'text-gray-900 dark:bg-gray-700 dark:text-white' : 'dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-white hover:bg-gray-50'}`}>Gestion des utilisateurs</div>
                        </li>
                        <li className="focus-within:z-10" onClick={toggleGroupList}>
                            <div className={`inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-blue-300 focus:outline-none ${isGroupListOpen || isGroupFormOpen ? 'text-gray-900 dark:bg-gray-700 dark:text-white' : 'dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-white hover:bg-gray-50'}`}>Gestion des groupes</div>
                        </li>
                        <li className="focus-within:z-10" onClick={toggleRoomList}>
                            <div className={`inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 rounded-r-lg focus:ring-4 focus:ring-blue-300 focus:outline-none ${isRoomListOpen || isRoomFormOpen ? 'text-gray-900 dark:bg-gray-700 dark:text-white' : 'dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-white hover:bg-gray-50'}`}>Gestion des salles</div>
                        </li>
                    </ul>
                </div>
                {isEventListOpen && (
                    <>
                        <div className="flex items-end justify-end w-3xl mt-6">
                            <div className="flex">
                                <form className="mt-6">
                                    <label htmlFor="underline_select" className="sr-only">Date</label>
                                    <select
                                        id="underline_select"
                                        className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight text-gray-200"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                    >
                                        <option value="">Filtrer par date</option>
                                        <option value="last_day">Dernier jour</option>
                                        <option value="last_week">Dernière semaine</option>
                                        <option value="last_month">Dernier mois</option>
                                    </select>
                                </form>
                                <form className="mt-6">
                                    <label htmlFor="underline_select" className="sr-only">Statut</label>
                                    <select
                                        id="underline_select"
                                        className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight text-gray-200"
                                        value={selectedStatus}
                                        onChange={handleStatusChange}
                                    >
                                        <option value="">Filtrer par statut</option>
                                        {loadedStatus.map(status => (
                                            <option key={status.id} value={status.name}>{status.name}</option>
                                        ))}
                                    </select>
                                </form>
                                <form className="mt-6">
                                    <label htmlFor="underline_select" className="sr-only">Groupe</label>
                                    <select
                                        id="underline_select"
                                        className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight text-gray-200"
                                        value={selectedGroup}
                                        onChange={handleGroupChange}
                                    >
                                        <option value="">Filtrer par groupe de travail</option>
                                        {loadedGroups.map(group => (
                                            <option key={group.id} value={group.name}>{group.name}</option>
                                        ))}
                                    </select>
                                </form>
                                <form className="mt-6">
                                    <label htmlFor="underline_select" className="sr-only">Limite</label>
                                    <select
                                        id="underline_select"
                                        className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight text-gray-200"
                                        value={selectedLimit}
                                        onChange={handleLimitChange}
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="75">75</option>
                                        <option value="100">100</option>
                                    </select>
                                </form>
                            </div>
                        </div>
                        <div className="flex items-end justify-end w-3xl mt-6">
                            <p className="text-lg font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">Il y a {countEvents} événements enregistrés.</p>
                        </div>
                    </>
                )}
                {isUserListOpen && (
                    <>
                        <div className="flex items-end justify-between w-3xl mt-6">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4" onClick={toggleUserForm}>
                                Ajouter un utilisateur
                            </button>
                            <div className="flex">
                                <form className="mt-6">
                                    <label htmlFor="underline_select" className="sr-only">Statut</label>
                                    <select
                                        id="underline_select"
                                        className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight text-gray-200"
                                        value={selectedStatus}
                                        onChange={handleStatusChange}
                                    >
                                        <option value="">Filtrer par statut</option>
                                        <option value="true">Administrateur</option>
                                        <option value="false">Membre</option>
                                    </select>
                                </form>
                                <form className="mt-6">
                                    <label htmlFor="underline_select" className="sr-only">Groupe</label>
                                    <select
                                        id="underline_select"
                                        className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight text-gray-200"
                                        value={selectedGroup}
                                        onChange={handleGroupChange}
                                    >
                                        <option value="">Filtrer par groupe de travail</option>
                                        {loadedGroups.map(group => (
                                            <option key={group.id} value={group.name}>{group.name}</option>
                                        ))}
                                    </select>
                                </form>
                                <form className="mt-6">
                                    <label htmlFor="underline_select" className="sr-only">Limite</label>
                                    <select
                                        id="underline_select"
                                        className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight text-gray-200"
                                        value={selectedLimit}
                                        onChange={handleLimitChange}
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="75">75</option>
                                        <option value="100">100</option>
                                    </select>
                                </form>
                            </div>
                        </div>
                        <div className="flex items-end justify-end w-3xl mt-6">
                            <p className="text-lg font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">Il y a {countUsers} utilisateurs enregistrés.</p>
                        </div>
                    </>
                )}
                {isRoomListOpen && (
                    <>
                        <div className="flex items-end justify-between w-3xl mt-6">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4" onClick={toggleRoomForm}>
                                Ajouter une salle
                            </button>
                            <div className="flex">
                                <form className="mt-6">
                                    <label htmlFor="underline_select" className="sr-only">Limite</label>
                                    <select
                                        id="underline_select"
                                        className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight text-gray-200"
                                        value={selectedLimit}
                                        onChange={handleLimitChange}
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="75">75</option>
                                        <option value="100">100</option>
                                    </select>
                                </form>
                            </div>
                        </div>
                        <div className="flex items-end justify-end w-3xl mt-6">
                            <p className="text-lg font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">Il y a {countRooms} salles enregistrées.</p>
                        </div>
                    </>
                )}
                {isGroupListOpen && (
                    <>
                        <div className="flex items-end justify-between w-3xl mt-6">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4" onClick={toggleGroupForm}>
                                Ajouter un groupe de travail
                            </button>
                            <div className="flex">
                                <form className="mt-6">
                                    <label htmlFor="underline_select" className="sr-only">Limite</label>
                                    <select
                                        id="underline_select"
                                        className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight text-gray-200"
                                        value={selectedLimit}
                                        onChange={handleLimitChange}
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="75">75</option>
                                        <option value="100">100</option>
                                    </select>
                                </form>
                            </div>
                        </div>
                        <div className="flex items-end justify-end w-3xl mt-6">
                            <p className="text-lg font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">Il y a {countGroups} groupes de travail enregistrés.</p>
                        </div>
                    </>
                )}
                {isUserListOpen && <ListUsers selectedGroup={selectedGroup} selectedStatus={selectedStatus} selectedLimit={parseInt(selectedLimit)} />}
                {isEventListOpen && <ListEvents selectedGroup={selectedGroup} selectedStatus={selectedStatus} selectedLimit={parseInt(selectedLimit)} selectedDate={selectedDate} />}
                {isGroupListOpen && <ListGroups selectedLimit={parseInt(selectedLimit)} />}
                {isRoomListOpen && <ListRooms selectedLimit={parseInt(selectedLimit)} />}
                {isRoomFormOpen && <FormRoom />}
                {isGroupFormOpen && <FormGroup />}
                {isUserFormOpen && <FormUser />}
            </div>
        </section>
    );
};
