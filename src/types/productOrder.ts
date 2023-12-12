import { IOrder } from "./order.interface"

export interface IProductOrder{
    id?: number
    productId: number
    quantity: number
    order?: IOrder
}