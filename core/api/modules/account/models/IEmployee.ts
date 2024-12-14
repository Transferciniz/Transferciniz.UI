import type { AccountType } from "../../auth/models/AccountType";

export interface IEmployee{
    id: string;
    accountType: AccountType;
    name: string;
    surname: string;
    username :string;
    profilePicture: string;
    latitude: number;
    longitude: number;
    isSelected: boolean
}