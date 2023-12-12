import React, { useEffect, useRef, useState } from 'react'
import { Modal as bootstrapModal } from 'bootstrap';
import { Toast as bootstrapToast } from 'bootstrap';
import { useActions } from '@/hooks/useActions';
import { IModalInfo } from '@/types/modalInfo.interface';
import Modal from '@/pages/modal/Modal';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { useChangeOrderMutation, useGetOneOrderQuery } from '@/store/api/orders.api';
import { IProductOrder } from '@/types/productOrder';
import { useChangeQuantityProductMutation, useGetByIdsQuery, useSearchProductsQuery } from '@/store/api/products.api';
import { variables } from '@/variables';
import { IProduct } from '@/types/product.interface';
import ChangeOrderProducts from './ChangeOrderProducts';
import { IOrder } from '@/types/order.interface';

function ChangeOrder() {
    let { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.user);

    if (!user) {
        navigate('/login');
    }

    const inputSearch = useRef<HTMLInputElement>(null);
    const [searchStr, setSearchStr] = useState('');
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const { setToastChildren } = useActions();
    const [productsOrders, setProductsOrders] = useState<IProductOrder[]>([]);
    const [isShow, setIsShow] = useState(false);
    const { isLoading: isLoadingOrder, isSuccess: isSuccessOrder, isError: isErrorOrder, data: dataOrder } = useGetOneOrderQuery(Number(id))
    const { isLoading: isLoadingSearch, data: dataSearch } = useSearchProductsQuery({ contain: searchStr, limit: variables.PRODUCTS_SEARCH_ORDER })

    if (!user) {
        return <Navigate to={'/'} />;
    }

    const { isLoading: isLoadingProducts, data: dataProducts } = useGetByIdsQuery(productsOrders.length > 0 ? productsOrders.map(p => p.productId).join('_') : '0');
    const [changeOrder, { isLoading, isSuccess, isError, error, data }] = useChangeOrderMutation();

    useEffect(() => {
        if (isSuccess) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren('Заказ успешно изменен');
            myToast.show();
        }
        if (isError) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('addOrderModal') || 'addOrderModal');
            setModalInfo({ title: "Ошибка", children: 'Ошибка изменения заказа' })
            myModal.show();
        }
    }, [isLoading])

    useEffect(() => {
        if (isSuccessOrder && typeof (dataOrder) !== 'string') {
            setProductsOrders([...dataOrder.productOrders?.slice() || []]);
        }
    }, [isLoadingOrder])

    const addOrderClick = async () => {
        let inputName = (document.getElementById('inputName') as HTMLInputElement).value;
        let inputDesc = (document.getElementById('inputDesc') as HTMLInputElement).value;
        let inputPhone = (document.getElementById('inputPhone') as HTMLSelectElement).value;
        let inputStatus = (document.getElementById('inputStatus') as HTMLSelectElement).value;
        if (inputName.trim() === '' ||
            inputPhone.trim() === '' ||
            productsOrders.some(p => p.quantity === 0) ||
            productsOrders.length === 0) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('addOrderModal') || 'addOrderModal');
            setModalInfo({ title: "Ошибка", children: 'Введите данные' })
            myModal.show();
            return;
        }
        changeOrder({
            id: (dataOrder as IOrder).id!,
            employeeId: user.id,
            customerName: inputName.trim(),
            customerPhone: inputPhone.trim(),
            description: inputDesc.trim() !== '' ? inputDesc.trim() : undefined,
            creationDate: new Date(),
            orderStatus: inputStatus,
            productOrders: productsOrders
        })
    }

    const addProductClick = (product: IProduct) => {
        if (!productsOrders.some(p => p.productId === product.id) && product.quantityLeft > 0)
            setProductsOrders([...productsOrders,
            {
                productId: product.id!,
                quantity: 1
            }]);
        setIsShow(false);
    }

    return (
        <div className="d-flex flex-column main-wrapper p-3 flex-fill ms-auto me-auto">

            <Link to={id ? '/order/' + id : '/'} className="btn btn-outline-primary align-items-center align-self-start d-flex mt-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                </svg>
                Вернуться к заказу
            </Link>
            {
                dataOrder && typeof (dataOrder) !== 'string' ?
                    <div className="d-flex flex-column main-wrapper ms-auto me-auto">
                        <h2 className="text-center p-3">
                            Изменение заказа
                        </h2>
                        <div className="d-flex align-self-center flex-column w-50 mb-4 add-order-wrapper">
                            <label className="mb-1 fs-5" htmlFor="inputName">Фамилия и имя покупателя</label>
                            <input className="form-control fs-6 mb-3" id="inputName" placeholder="Введите фамилию и имя покупателя" defaultValue={(dataOrder as IOrder).customerName} />
                            <label className="mb-1 fs-5" htmlFor="inputPhone">Телефон покупателя</label>
                            <input className="form-control fs-6 mb-3" id="inputPhone" placeholder="Введите телефон покупателя" defaultValue={(dataOrder as IOrder).customerPhone} />
                            <label className="mb-1 fs-5" htmlFor="inputDesc">Описание заказа</label>
                            <textarea rows={4} className="form-control fs-6 mb-3" id="inputDesc" placeholder="Введите описание товара" defaultValue={(dataOrder as IOrder).description} />
                            <label className="mb-1 fs-5" htmlFor="inputStatus">Статус заказа</label>
                            <select className="form-select fs-6 mb-3" id="inputStatus" defaultValue={(dataOrder as IOrder).orderStatus}>
                                <option value="В процессе">В процессе</option>
                                <option value="Выполнен">Выполнен</option>
                            </select>

                            <span className='fs-5 mb-1'>
                                Добавление товаров
                            </span>
                            <div className="input-group mb-1">
                                <input type="text"
                                    className="form-control w-50"
                                    placeholder="Введите запрос"
                                    ref={inputSearch}
                                    onChange={(e) => setSearchStr(e.target.value)}
                                    onFocus={() => setIsShow(true)} />
                                <button className="btn btn-secondary d-flex align-items-center"
                                    type="button"
                                    onClick={() => {
                                        inputSearch.current!.value = ''
                                        setSearchStr('')
                                    }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                    </svg>
                                </button>
                            </div>

                            {isShow &&
                                <div className="position-relative">
                                    <ul onClick={() => setIsShow(false)} id='searchList' className="list-group add-order-search-list position-absolute">
                                        {dataSearch && searchStr !== '' && dataSearch.length > 0 && dataSearch.map(product =>
                                            <li
                                                onClick={() => addProductClick(product)}
                                                className='list-group-item p-2 cursor-pointer text-truncate'
                                                key={product.id}>
                                                <img className='img-fluid' src={variables.PHOTOS_URL + product.photoPath} alt="ProductImg" />
                                                <div className='d-flex flex-column p-2 ps-3 justify-content-around flex-fill w-25'>
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
                                                </div>
                                            </li>)
                                        }
                                    </ul>
                                </div>
                            }
                            {
                                dataProducts && dataProducts.length > 0 &&
                                <ChangeOrderProducts
                                    dataProducts={dataProducts}
                                    setProductsOrders={setProductsOrders}
                                    productsOrders={productsOrders}
                                    dataOrder={dataOrder} />
                            }
                            <button onClick={() => addOrderClick()} className='btn btn-primary fs-4 mt-4'>
                                {isLoading ?
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Загрузка</span>
                                    </div>
                                    :
                                    <div>Изменить заказ</div>
                                }
                            </button>
                        </div>
                        <Modal id='addOrderModal' title={modalInfo.title}>
                            {modalInfo.children}
                        </Modal>
                    </div>
                    : <h2 className='m-auto'>Заказ не найден</h2>
            }

        </div>
    );
}

export default ChangeOrder;