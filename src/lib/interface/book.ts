export interface Book{
    ID: number;
    NAME: string;
    NUMBER_OF_PAGE: number;
    ON_SALE: number;
    PRICE: number;
    DISCOUNT: number;
    DESCRIPTION: string;
    COVER_URL: string;
    CATEGORY_ID: number|null;
    PUBLISHER_DATE: number|null;
}

export function Book()
{
    return {
        ID: 0,
        NAME: "",
        NUMBER_OF_PAGE: 0,
        ON_SALE: 0,
        PRICE: 0,
        DISCOUNT: 0,
        DESCRIPTION: "",
        COVER_URL: "",
        CATEGORY_ID: null,
        PUBLISHER_DATE: null
    }
}