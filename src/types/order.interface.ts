import { IProductOrder } from "./productOrder"

export interface IOrder{
    id?: number
    employeeId: number
    customerName: string
    customerPhone: string
    description?: string
    orderStatus: string
    creationDate: Date
    productOrders?: IProductOrder[]
}