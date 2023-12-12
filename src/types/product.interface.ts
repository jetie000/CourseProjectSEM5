import { IProductFields } from "./productFields.interface"

export interface IProduct{
    id?: number
    name: string
    category: string
    description?: string
    price: number
    quantityLeft: number
    quantitySold: number
    priceDiscount: number
    creationDate: Date
    manufacturer: string
    photoPath: string
    productFields?: IProductFields[]
}