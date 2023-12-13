import { IOrder } from '@/types/order.interface'
import { baseApi } from './baseApi'

export const ordersApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getManyOrders: builder.query<IOrder[] | string,
            {
                contain: string,
                limit: number,
                sortParam: string,
                sortOrder: string
            }>({
                query: ({ contain, limit, sortOrder, sortParam }) => ({
                    url: '/order/getMany?limit=' + limit + '&contain=' + (contain === '' ? 'no_search_string' : contain) + '&sortOrder=' + sortOrder + '&sortParam=' + sortParam,
                    method: 'GET',
                }),
                providesTags: () => [{
                    type: 'Order'
                }, {
                    type: 'Orders'
                }]
            }),
        getOneOrder: builder.query<IOrder | string, number>({
            query: (orderId) => ({
                url: '/order/getOne?orderId=' + orderId,
                method: 'GET',
            }),
            providesTags: () => [{
                type: 'Order'
            }]
        }),
        addOrder: builder.mutation<string, IOrder>({
            query: (order) => ({
                body: order,
                url: '/order/add',
                method: 'POST',
            }),
            invalidatesTags: () => [{
                type: 'Orders'
            }, {
                type: 'Products'
            }]
        }),
        changeOrder: builder.mutation<string, IOrder>({
            query: (order) => ({
                body: order,
                url: '/order/change',
                method: 'PUT',
            }),
            invalidatesTags: () => [{
                type: 'Order'
            }, {
                type: 'Orders'
            }, {
                type: 'Products'
            }]
        }),
        deleteOrder: builder.mutation<string, number>({
            query: (orderId) => ({
                url: '/order/delete?id=' + orderId,
                method: 'DELETE',
            }),
            invalidatesTags: () => [{
                type: 'Order'
            }, {
                type: 'Orders'
            }]
        }),
        downloadReport: builder.mutation<Blob, number>({
            query: (days) => ({
                url: '/order/getReport?days=' + days,
                method: 'POST',
            })
        }),
    })
})

export const {
    useGetOneOrderQuery,
    useGetManyOrdersQuery,
    useAddOrderMutation,
    useChangeOrderMutation,
    useDeleteOrderMutation,
    useDownloadReportMutation
} = ordersApi