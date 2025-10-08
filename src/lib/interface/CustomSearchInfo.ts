export interface customSearchInfo
{
    id: number,
    name: string,
    category_Id: number,
    author_Name: string,
    on_Sale: number,
    min_Price: number,
    max_Price: number,
    discount: number
}

export function CustomSearchInfo() : customSearchInfo
{
    return {
        id: -1,
        name: "",
        category_Id: -1,
        author_Name: "",
        on_Sale: -1,
        min_Price: 0,
        max_Price: 1000000,
        discount: -1
    }
}