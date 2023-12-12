import { baseApi } from './baseApi'
import { IProduct } from '@/types/product.interface'


export const productsApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getMany: builder.query<IProduct[] | string, {offset: number, limit: number}>({
            query: ({offset, limit}) => ({
                url: '/product/getMany?offset=' + offset+'&limit='+limit,
                method: 'GET',
            }),
            providesTags: () => [{
                type: 'Product'
            },{
                type: 'Products'
            }]
        }),
        getOne: builder.query<IProduct | string, number>({
            query: (productId) => ({
                url: '/product/getOne?productId=' + productId,
                method: 'GET',
            }),
            providesTags: () => [{
                type: 'Product'
            }]
        }),
        getByIds: builder.query<IProduct[], string>({
            query: (ids) => ({
                url: '/product/getByIds?ids=' + ids,
                method: 'GET',
            }),
            providesTags: () => [{
                type: 'Product'
            },{
                type: 'Products'
            }]
        }),
        searchProducts: builder.query<IProduct[], {contain: string, limit: number}>({
            query: ({contain, limit}) => ({
                url: '/product/search?contain=' + (contain === '' ? 'no_search_string' : contain)+ '&limit=' + limit,
                method: 'GET',
            }),
            providesTags: () => [{
                type: 'Product'
            },{
                type: 'Products'
            }]
        }),
        addProduct: builder.mutation<string, IProduct>({
            query: (product) => ({
                body: product,
                url: '/product/add',
                method: 'POST',
            }),
            invalidatesTags: () => [{
                type: 'Products'
            }]
        }),
        changeProduct: builder.mutation<string, IProduct>({
            query: (product) => ({
                body: product,
                url: '/product/change',
                method: 'PUT',
            }),
            invalidatesTags: () => [{
                type: 'Product'
            },{
                type: 'Products'
            }]
        }),
        changeQuantityProduct: builder.mutation<string, {productId: number, quantity: number, isSold: number}>({
            query: ({productId, quantity, isSold}) => ({
                url: '/product/changeQuantity?productId='+productId+'&quantity='+quantity+'&isSold='+isSold,
                method: 'PUT',
            }),
            invalidatesTags: () => [{
                type: 'Product'
            },{
                type: 'Products'
            }]
        }),
        deleteProduct: builder.mutation<string, number>({
            query: (productId) => ({
                url: '/product/delete?id=' + productId,
                method: 'DELETE',
            }),
            invalidatesTags: () => [{
                type: 'Product'
            },{
                type: 'Products'
            }]
        }),
        postProductPhoto: builder.mutation<string, FormData>({
            query: (imgFileData) => ({
                body: imgFileData,
                url: '/product/saveProductPhoto',
                method: 'POST',
            }),
        }),
    })
})

export const {
    useGetOneQuery,
    useGetManyQuery,
    useSearchProductsQuery,
    useGetByIdsQuery,
    useAddProductMutation,
    useChangeProductMutation,
    useDeleteProductMutation,
    usePostProductPhotoMutation,
    useChangeQuantityProductMutation
} = productsApi