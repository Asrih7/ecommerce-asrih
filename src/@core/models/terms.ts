import { TranslationTerms } from './dispute';

export interface Terms {
    id?: number;
    translations: TranslationTerms;
    refundable?: boolean;
    refundable_days?: number;
    refundable_personalized?: string;
    free_return?: boolean;
    exchangeable?: boolean;
    exchangeable_days?: number;
    exchangeable_personalized?: boolean;
    shop: number;
}
