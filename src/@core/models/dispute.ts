

export interface Dispute {
    readonly id?: number;
    translations: Translation;
    readonly created_on: string;
    readonly modified_on: string;
    query_type: string;
    file: string | null;
    order: number;

}
export interface Translation {
    en: Description;
    fr: Description;
}
export interface Description {
    name?: string;
    description?: string;
    keywords?: string;
    instructions?: string
}
export interface TranslationTerms {
    en: OwnTerms;
    fr: OwnTerms;
}
export interface OwnTerms {
    own_terms: string;
}
