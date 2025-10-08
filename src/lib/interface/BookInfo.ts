interface customSearchInfo
{
    id: number,
    name: string,
    category_id: number,
    author_name: string,
    on_sale: number,
    min_price: number,
    max_price: number,
    discount: number
}

export function CustomSearchInfo()
{
    return {
        id: 0,
        name: "",
        category_id: 0,
        author_name: "",
        on_sale: -1,
        min_price: 0,
        max_price: 0,
        discount: -1
    }
}