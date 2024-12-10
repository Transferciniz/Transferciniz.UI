import {AccountType} from "@/core/api/modules/auth/models/AccountType";

export interface IRegisterRequest {
    name: string;
    surname :string;
    username :string
    email: string;
    password: string;
    accountType: any;
    taxNumber: string;
    invoiceAddress: string;
    parentAccountId: string;
}

export interface IRegisterResponse {
    token: string;
}