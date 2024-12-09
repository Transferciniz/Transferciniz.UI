import {AccountType} from "@/core/api/modules/auth/models/AccountType";

export interface ISession {
    email: string;
    name: string;
    surname: string;
    username: string;
    id: string;
    sessionId: string;
    profilePicture: string;
    accountType: AccountType;
    longitude: number;
    latitude: number;
    isAccountCompleted: string;
}