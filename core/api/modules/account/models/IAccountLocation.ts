export interface IAccountLocation{
   id: string;
   name :string;
   address: string;
   isDefault: boolean;
   accountId: string;
   latitude: number;
   longitude: number;
   updatedAt: Date;
}