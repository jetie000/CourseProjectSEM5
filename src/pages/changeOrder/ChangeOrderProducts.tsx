import React from 'react'
import { baseApi } from "@/store/api/baseApi";
import { IProduct } from "@/types/product.interface";
import { variables } from "@/variables";
import { useDispatch } from "react-redux";
import { IProductOrder } from '@/types/productOrder';
import { IOrder } from '@/types/order.interface';

function ChangeOrderProducts({ dataProducts, setProductsOrders, productsOrders, dataOrder }:
    { dataProducts: IProduct[], setProductsOrders: Function, productsOrders: IProductOrder[], dataOrder: IOrder }) {
    const dispatch = useDispatch();

    const handleChangeProdNum = (e: React.ChangeEvent<HTMLInputElement>, idToFind: number, left: number) => {
        let result = Number(e.target.value.replace(/\D/g, ''));
        if (result > left)
            result = left;
        setProductsOrders(productsOrders.map(p => {
            let productToChange = { ...p };
            if (p.productId === idToFind)
                productToChange.quantity = Number(result);
            return productToChange;
        }));
    }

    const deleteProductClick = (id: number) => {
        setProductsOrders(productsOrders.filter(p => p.productId !== id));
        dispatch(baseApi.util.invalidateTags(['Orders']))
    }

    return (
        <div>
            {
                dataProducts.map(product =>
                    <div className='border rounded-4 add-order-products-list d-flex mb-2' key={product.id}>
                        <img className='rounded-4 img-fluid' src={variables.PHOTOS_URL + product.photoPath} alt="ProductImg" />
                        <div className='d-flex flex-column p-2 ps-3 justify-content-around w-25 flex-fill'>
                            <span className='fs-4 text-truncate'>{product.name}</span>
                            <div className='d-flex gap-2'>
                                <div className='d-flex flex-column'>
                                    <span className='fw-light'>Категория </span>
                                    <span>Цена (р)</span>
                                    <span>Осталось</span>
                                </div>
                                <div className='d-flex flex-column overflow-x-hidden'>
                                    <span className='fw-light text-truncate'>{product.category}</span>
                                    <span>{product.price}</span>
                                    <span>{product.quantityLeft}</span>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="d-flex flex-column me-2">
                                    <label htmlFor={"inputNum" + product.id!}>Количество</label>
                                    <input type='text'
                                        onChange={(e) => handleChangeProdNum(e, product.id!, product.quantityLeft + ((dataOrder.productOrders || []).find(p => p.productId === product.id)?.quantity || 0) )}
                                        className="form-control fs-6"
                                        id={"inputNum" + product.id!}
                                        placeholder="Введите количество"
                                        value={productsOrders.find(p => p.productId === product.id!)?.quantity} />
                                </div>
                                <button onClick={() => deleteProductClick(product.id!)} className='btn btn-danger align-self-end justify-self-end p-1'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                    </svg>
                                </button>
                            </div>

                        </div>
                    </div>)
            }
        </div>
    );
}

export default ChangeOrderProducts;