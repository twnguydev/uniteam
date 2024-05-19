export interface ListUsersAdminProps {
    selectedGroup?: string;
    selectedStatus?: string;
    selectedLimit: number;
}

export interface ListEventsAdminProps {
    selectedGroup?: string;
    selectedStatus?: string;
    selectedLimit: number;
    selectedDate?: string;
}

export interface ListGroupsAdminProps {
    selectedStatus?: string;
    selectedLimit: number;
}

export interface ListRoomsAdminProps {
    selectedStatus?: string;
    selectedLimit: number;
}