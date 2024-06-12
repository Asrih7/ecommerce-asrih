
import { Address } from './address';

export interface Profile {
  readonly id?: number;
  readonly name?: number;
  profile_picture?: string;
  readonly email?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  gender: string;
  birth_date?: string;
  readonly isActive?: boolean;
  default_billing_address?: Address;
  default_shipping_address?: Address;
  addresses?: Array<Address>;
  marketing_permission?: boolean;
  _language?: string;
  readonly is_email_confirmed?: boolean;
  readonly is_active?: boolean;
  readonly date_joined?: Date;
  readonly last_login?: Date;
}
