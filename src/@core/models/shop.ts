
import { Address } from './address';
import { Translation } from './dispute';
import { Product } from './product';
import { Terms } from './terms';

export interface Shop {
    readonly id: number;
    translations: Translation;
    readonly products: Array<Product>;
    readonly createdOn: Date;
    readonly modifiedOn: Date;
    logo: string;
    banner: string;
    readonly favicon: string;
    maintenanceMode: boolean;
    maintenance_message: string;
    www: string;
    instagram: string;
    facebook: string;
    name: string;
    description: string;
    slug: string;
    shop_address: Address;
    ambassador?: string;
    keywords: string;
    currency: string;
    terms: Terms;
    send_email?: boolean
}
