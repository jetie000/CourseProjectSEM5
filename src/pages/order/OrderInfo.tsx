import React, { useEffect, useState } from 'react'
import { Modal as bootstrapModal } from 'bootstrap';
import { Toast as bootstrapToast } from 'bootstrap';
import { IModalInfo } from '@/types/modalInfo.interface';
import Modal from '@/pages/modal/Modal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { variables } from '@/variables';
import { useActions } from '@/hooks/useActions';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import { IOrder } from '@/types/order.interface';
import { useDeleteOrderMutation } from '@/store/api/orders.api';
import { useChangeQuantityProductMutation, useGetByIdsQuery } from '@/store/api/products.api';

function OrderInfo({ data }: { data: IOrder }) {
    const { user } = useSelector((state: RootState) => state.user);
    const { setToastChildren } = useActions();
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const [deleteCollection, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete, error: errorDelete, data: dataDelete }] = useDeleteOrderMutation();
    const navigate = useNavigate();

    const [changeProductQuantity, { isLoading: isLoadingChange, isSuccess: isSuccessChange, isError: isErrorChange, error: errorChange, data: dataChange }] = useChangeQuantityProductMutation();
    const { isLoading: isLoadingProducts, data: dataProducts } = useGetByIdsQuery((data.productOrders || []).length > 0 ? (data.productOrders || []).map(p => p.productId).join('_') : '0');

    useEffect(() => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('orderModal') || 'orderModal');
        if (isSuccessDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            if (dataDelete === 'No order found.')
                setToastChildren("Заказ не найден");
            else {
                setToastChildren("Заказ успешно удален");
                data.productOrders && data.productOrders.forEach(p => {
                    changeProductQuantity({ productId: p.productId, quantity: p.quantity, isSold: 0 });
                })
            }
            myToast.show();
            myModal.hide()
        }
        if (isErrorDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Ошибка удаление заказа");
            myToast.show();
            myModal.hide();
        }
    }, [isLoadingDelete])
    
    useEffect(() => {
        if(isErrorChange){
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren('Ошибка изменения количества товара');
            myToast.show();
        }
    }, [isLoadingChange])

    const deleteOrderClick = () => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('orderModal') || 'orderModal');
        const children = data && typeof (data) !== 'string'
            ?
            <div className='d-flex flex-column gap-3'>
                <span>Вы точно хотите удалить заказ?</span>
                <button onClick={() =>
                    deleteCollection(data.id!)} className='btn btn-danger'>
                    Удалить заказ
                </button>
            </div >
            : <div>Заказ не найден</div>;
        setModalInfo({ title: "Удаление заказа", children: children });
        myModal.show();
    }
    return (
        <>
            <div className="d-flex flex-column fs-4">
                <div className="fs-1 align-self-center">Заказ</div>
                <hr />
                <div className=' text-truncate' >Имя покупателя: {data.customerName}</div>
                <div className=' text-truncate' >Телефон покупателя: {data.customerPhone}</div>
                <hr />
                <div>ID сотрудника: {data.employeeId}</div>
                <div>Дата создания: {new Date(data.creationDate).toLocaleString()}</div>
                <div>Статус заказа: {data.orderStatus}</div>
                <div>К оплате: {data.productOrders?.reduce((a, p) => a + p.finalPrice, 0)}р</div>

            </div>
            {
                data.description && data.description?.trim() != '' &&
                <div className="mt-4 text-break" dangerouslySetInnerHTML={{ __html: marked.parse(data.description) }}>
                </div>
            }
            <div className="d-flex gap-3 mt-3 order-buttons">
                <button onClick={() => navigate('/order/' + data.id + '/change')} className="btn btn-primary fs-4 w-50">
                    Изменить заказ
                </button>
                <button onClick={() => deleteOrderClick()} className="btn btn-danger fs-4 w-50">
                    Удалить заказ
                </button>
            </div>
            <h2 className='w-100 p-2 mt-3'>
                Товары
            </h2>
            <div>
                {
                    dataProducts && dataProducts.map(product =>
                        <div className='border rounded-4 order-products-list d-flex mb-2 cursor-pointer' key={product.id} onClick={() => navigate('/product/' + product.id)}>
                            <img className='rounded-4 img-fluid' src={variables.PHOTOS_URL + product.photoPath} alt="ProductImg" />
                            <div className='d-flex flex-column p-2 ps-3 justify-content-around w-25 flex-fill fs-4'>
                                <span className='text-truncate'>{product.name}</span>
                                <div className='d-flex gap-2'>
                                    <div className='d-flex flex-column'>
                                        <span className='fw-light'>Категория </span>
                                        <span>Цена (р)</span>
                                        <span>В заказе </span>
                                    </div>
                                    <div className='d-flex flex-column overflow-x-hidden'>
                                        <span className='fw-light text-truncate'>{product.category}</span>
                                    <span>{product.price + ' ( - ' + product.priceDiscount + 'р )'}</span>
                                        <span>{data.productOrders?.find(p => p.productId === product.id)?.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        </div>)
                }
            </div>

            <Modal id={"orderModal"} title={modalInfo.title}>
                {modalInfo.children}
            </Modal>
        </>
    );
}

export default OrderInfo;