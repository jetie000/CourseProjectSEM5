import { ICategory } from '@/types/category.interface'
import { baseApi } from './baseApi'


export const categoriesApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getAllCategories: builder.query<ICategory[] | string, null>({
            query: () => ({
                url: '/category/getAll',
                method: 'GET',
            }),
            providesTags: () => [{
                type: 'Categories'
            }]
        }),
        addCategory: builder.mutation<string, ICategory>({
            query: (category) => ({
                body: category,
                url: '/category/add',
                method: 'POST',
            }),
            invalidatesTags: () => [{
                type: 'Categories'
            }]
        }),
        changeCategory: builder.mutation<string, ICategory>({
            query: (category) => ({
                body: category,
                url: '/category/change',
                method: 'PUT',
            }),
            invalidatesTags: () => [{
                type: 'Categories'
            }]
        }),
        deleteCategory: builder.mutation<string, number>({
            query: (categoryId) => ({
                url: '/category/delete?id=' + categoryId,
                method: 'DELETE',
            }),
            invalidatesTags: () => [{
                type: 'Categories'
            }]
        })
    })
})

export const {
    useGetAllCategoriesQuery,
    useAddCategoryMutation,
    useChangeCategoryMutation,
    useDeleteCategoryMutation
} = categoriesApi