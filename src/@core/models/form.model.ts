import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
export const emailPattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$';

export const LOGIN_FORM = {
    email: new FormControl(null, [Validators.required, Validators.pattern(emailPattern)]),
    password: new FormControl(null, Validators.required)
};

export const USER_FORM = {
    id: new FormControl(),
    code: new FormControl(null, [Validators.required]),
    first_name: new FormControl(null, Validators.required),
    last_name: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
};

export const PROFILE_FORM = {
    first_name: new FormControl(null, Validators.required),
    last_name: new FormControl(null, Validators.required),
    profile_picture: new FormControl(null),
    phone: new FormControl(null),
    gender: new FormControl(null),
    birth_date: new FormControl(null),
    _language: new FormControl(null),
    // addresses: new FormArray([])
};
export const BILLING_ADRESS_FORM = {
    name: new FormControl('', Validators.required),
    name_ext: new FormControl(''),
    company_name: new FormControl(''),
    street: new FormControl('', Validators.required),
    street2: new FormControl(''),
    postal_code: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    region: new FormControl(''),
    country: new FormControl('', Validators.required),
    longitude: new FormControl(null),
    latitude: new FormControl(null),
    phone: new FormControl(null),
};
export const DELEVERY_ADRESS_FORM = {
    name: new FormControl('', Validators.required),
    name_ext: new FormControl(''),
    company_name: new FormControl(''),
    street: new FormControl('', Validators.required),
    street2: new FormControl(''),
    postal_code: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    region: new FormControl(''),
    country: new FormControl('', Validators.required),
    longitude: new FormControl(null),
    latitude: new FormControl(null),
    phone: new FormControl(null),
};

export const ADDRESSES_FORM = {
    addresses: new FormArray([]),
};

// FORM PASSWORD
export const SET_PASSWORD_FORM = {
    current_password: new FormControl(null, Validators.required),
    new_password1: new FormControl(null, Validators.required),
    new_password2: new FormControl(null, Validators.required)
};
export const CONFIRM_PASSWORD_RESET_FORM = {
    uidb64: new FormControl(null, Validators.required),
    token: new FormControl(null, Validators.required),
    new_password1: new FormControl(null, Validators.required),
    new_password2: new FormControl(null, Validators.required)
};
export const RECOVER_PASSWORD_FORM = {
    email: new FormControl(null, [Validators.required, Validators.pattern(emailPattern)])
};
export const SET_EMAIL_FORM = {
    current_email: new FormControl(null, Validators.required),
    new_email1: new FormControl(null, [Validators.required, Validators.pattern(emailPattern)]),
    new_email2: new FormControl(null, [Validators.required, Validators.pattern(emailPattern)])
};
export const PAYMENT_EUROPEAN_FORM = {
    account_owner: new FormControl(null, Validators.required),
    iban: new FormControl(null, [Validators.required]),
    bic: new FormControl(null, Validators.required),
    bank_name: new FormControl(null, Validators.required),
    bank_city: new FormControl(null, Validators.required),
    bank_country: new FormControl(null, Validators.required)
};
export const PAYMENT_INTERNATIONAL_FORM = {
    account_owner: new FormControl(null, Validators.required),
    birth_date: new FormControl(null, [Validators.required]),
    account_number: new FormControl(null, Validators.required),
    tri_number: new FormControl(null, Validators.required),
    iban: new FormControl(null),
    bic: new FormControl(null),
    bank_name: new FormControl(null, Validators.required),
    bank_city: new FormControl(null, Validators.required),
    bank_country: new FormControl(null, Validators.required),
    account_address: new FormControl(null)
};
export const PAYMENT_PAYPAL_FORM = {
    email_paypal: new FormControl(null, [Validators.required, Validators.pattern(emailPattern)])
};
export const PAYMENT_WESTERNUNION_FORM = {
    first_name: new FormControl(null, Validators.required),
    last_name: new FormControl(null, [Validators.required]),
    receiving_city: new FormControl(null, Validators.required),
    state: new FormControl(null, Validators.required),
    region: new FormControl(null),
    country: new FormControl(null, Validators.required)
};
export const TRANSFER_FORM = {
    transfer_amount: new FormControl(null, Validators.required),
    // transfer_amount_currency: new FormControl(null),
    transfer_type: new FormControl(null, Validators.required),
    paypal_account: new FormGroup({}),
    western_union_account: new FormGroup({}),
    european_bank_account: new FormGroup({}),
    international_bank_account: new FormGroup({}),
    password: new FormControl(null, Validators.required)
};
export const REGIONAL_SETTINGS_FORM = {
    language: new FormControl(null, Validators.required),
    currency: new FormControl(null, Validators.required),
    country: new FormControl(null, Validators.required),
};
export const DISPUTE__FORM = {
    order: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    file: new FormControl(null, Validators.required),
    query_type: new FormControl(null, Validators.required),
};
export const MESSAGE_FORM = {
    body: new FormControl('', Validators.required),
    recipient: new FormControl(null, Validators.required),
};
export const MESSAGE_ADMIN_FORM = {
    email: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
    file: new FormControl('')
};
export const FIRST_STEP = {
    profile: PROFILE_FORM,
    address_billing: ADDRESSES_FORM,
    address_delivery: ADDRESSES_FORM
};
export const SHOP_INFO_ACCOUNT = {
    name: new FormControl('', Validators.required),
    // maintenance_message: new FormControl('', Validators.required),
    description: new FormControl(''),
    banner: new FormControl(''),
    logo: new FormControl(''),
    www: new FormControl(''),
    instagram: new FormControl(''),
    facebook: new FormControl(''),
    keywords: new FormControl(''),
    send_email: new FormControl(false)
};
export const SHOP_INFOS = {
    ambassador: new FormControl(''),
    shop_address: new FormGroup({
        id: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
        name_ext: new FormControl(''),
        company_name: new FormControl(''),
        street: new FormControl('', Validators.required),
        street2: new FormControl(''),
        postal_code: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        region: new FormControl(''),
        country: new FormControl('', Validators.required),
        longitude: new FormControl(null),
        latitude: new FormControl(null),
        phone: new FormControl(null),
    }),
    terms: new FormGroup({
        exchangeable: new FormControl('', Validators.required),
        exchangeable_days: new FormControl('', Validators.required),
        exchangeable_personalized: new FormControl(''),
        free_return: new FormControl(''),
        id: new FormControl('', Validators.required),
        own_terms: new FormControl(''),
        refundable: new FormControl('', Validators.required),
        refundable_days: new FormControl('', Validators.required),
        refundable_personalized: new FormControl(''),
        shop: new FormControl('', Validators.required),
        translations: new FormControl('')
    })
};
export const DEAL_FORM = {
    id: new FormControl(),
    deal_percentage: new FormControl('', Validators.required),
    shop: new FormControl(''),
    products: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required)
};
export const SHIPPING_FORM = {
    id: new FormControl(),
    name: new FormControl('', Validators.required),
    shop: new FormControl('', Validators.required),
    zones: new FormArray([])
};
export const DISCOUNT_COUPON = {
    id: new FormControl(),
    coupon_code: new FormControl('', Validators.required),
    discount_amount: new FormControl('', Validators.required),
    discount_amount_currency: new FormControl('', Validators.required),
    discount_percentage: new FormControl('', Validators.required),
    shop: new FormControl('', Validators.required),
    product: new FormControl(),
    active: new FormControl('', Validators.required),
    start_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required)
};
export const CUSTOMIZATION={
    id: new FormControl(),
    instructions: new FormControl(),
    is_facultative: new FormControl(),
    limit_char: new FormControl([], Validators.required),
    product: new FormControl('', Validators.required),
}
export const PRODUCT = { 
        name: new FormControl(),
        description: new FormControl(),
        keywords: new FormControl(),
        images: new FormControl([], Validators.required),
        translations: new FormControl('', Validators.required),
        shop: new FormControl('', Validators.required),
        inspiration_country: new FormControl('', Validators.required),
        shipping_profiles: new FormControl(null, Validators.required),
        category: new FormControl(null),       
        product_attributes: new FormArray([]),
        inventory: new FormArray([]),
        customizable: new FormControl(false,Validators.required),
        is_visible: new FormControl(Validators.required),
        customization:new FormGroup({
            instructions: new FormControl(),
            is_facultative: new FormControl(false),
            limit_char: new FormControl([], Validators.required),
            translations: new FormControl('', Validators.required),
        }),
    
};
