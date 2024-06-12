
import { Address } from './address';
import { Product } from './product';


export interface ReadOnlyShop {
    readonly id?: number;
    translations: string;
    readonly products?: Array<Product>;
    contactAddress?: Address;
    readonly customerOpinions?: string;
    readonly logo?: string;
    readonly favicon?: string;
    readonly createdOn?: Date;
    readonly modifiedOn?: Date;


    maintenanceMode?: boolean;
    www?: string;
    instagram?: string;
    facebook?: string;
    name: string;
    slug?: string;
}
