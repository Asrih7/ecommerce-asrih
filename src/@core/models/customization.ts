


export interface Customization { 
    readonly id?: number;
    translations: string;
    isFacultative?: boolean;
    /**
     * Limit number of characters
     */
    limitChar: number;
    readonly product?: number;
}
