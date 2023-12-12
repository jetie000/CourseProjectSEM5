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
import { IProduct } from '@/types/product.interface';
import { useDeleteProductMutation } from '@/store/api/products.api';

function ProductInfo({ data }: { data: IProduct }) {
    const { user } = useSelector((state: RootState) => state.user);
    const { setToastChildren } = useActions();
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const [deleteCollection, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete, error: errorDelete, data: dataDelete }] = useDeleteProductMutation();
    const navigate = useNavigate();

    useEffect(() => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('productModal') || 'productModal');
        if (isSuccessDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            if (dataDelete === 'No user found.')
                setToastChildren("Пользователь не найден");
            else
                if (dataDelete === 'No product found.')
                    setToastChildren("Товар не найден");
                else {
                    setToastChildren("Товар успешно удален");
                }
            myToast.show();
            myModal.hide()
        }
        if (isErrorDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Ошибка удаление товара");
            myToast.show();
            myModal.hide();
        }
    }, [isLoadingDelete])

    const deleteProductClick = () => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('productModal') || 'productModal');
        const children = data && typeof (data) !== 'string'
            ?
            <div className='d-flex flex-column gap-3'>
                <span>Вы точно хотите удалить товар?</span>
                <button onClick={() =>
                    deleteCollection(data.id!)} className='btn btn-danger'>
                    Удалить товар
                </button>
            </div >
            : <div>Товар не найден</div>;
        setModalInfo({ title: "Удаление товара", children: children });
        myModal.show();
    }
    return (
        <>
            <div className="d-flex">
                <img className="w-50 rounded-4" src={variables.PHOTOS_URL + data.photoPath} alt="product img" />
                <div className="d-flex flex-column ps-5 justify-content-around flex-fill w-50">
                    <span className="fs-1 align-self-center">Товар</span>
                    <hr />
                    <span className='fs-1 text-truncate'>{data.name}</span>
                    <hr />
                    <div className='d-flex gap-4 fs-3'>
                        <div className='d-flex flex-column'>
                            <span>Цена (р) </span>
                            <span className='fw-light'>Категория </span>
                            <span>Дата создания </span>
                        </div>
                        <div className='d-flex flex-column overflow-x-hidden'>
                            <span>{data.price}</span>
                            <span className='fw-light text-truncate'>{data.category}</span>
                            <span>{new Date(data.creationDate).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
            {
                data.description && data.description?.trim() != '' &&
                <div className="mt-4 fs-5 text-break" dangerouslySetInnerHTML={{ __html: marked.parse(data.description) }}>
                </div>
            }
            <div className="d-flex gap-3 mt-3 product-buttons">
                <button onClick={() => navigate('/product/' + data.id + '/change')} className="btn btn-primary fs-4 w-50">
                    Изменить товар
                </button>
                <button onClick={() => deleteProductClick()} className="btn btn-danger fs-4 w-50">
                    Удалить товар
                </button>
            </div>
            <h2 className='w-100 p-2 mt-3'>
                Основная информация
            </h2>
            <div className="d-flex flex-wrap border rounded-4 p-2 product-info">
                <div className="w-50 fs-4 p-2">
                    {'Осталось: '+data.quantityLeft}
                </div>
                <div className="w-50 fs-4 p-2">
                    {'Скидка (р): '+data.priceDiscount}
                </div>
                <div className="w-50 fs-4 p-2">
                    {'Продано: '+ data.quantitySold}
                </div>
                <div className="w-50 fs-4 p-2 text-truncate">
                    {'Производитель: '+ data.manufacturer}
                </div>
            </div>
            {
                data.productFields && data.productFields.length > 0 &&
                <>
                    <h2 className='w-100 p-2 mt-3'>
                        Характеристики
                    </h2>
                    <div className="d-flex flex-wrap border rounded-4 p-2 product-info">
                        {
                            data.productFields.map(field =>
                                <div key={field.id} className="w-50 fs-4 p-2 text-truncate">
                                    {field.fieldName}:{' '}
                                    {field.stringFieldValue
                                        || field.doubleFieldValue
                                        || (field.dateFieldValue && new Date(field.dateFieldValue).toLocaleString())
                                        || (field.boolFieldValue ? "Да" : "Нет")
                                    }
                                </div>)
                        }
                    </div>
                </>
            }

            <Modal id={"productModal"} title={modalInfo.title}>
                {modalInfo.children}
            </Modal>
        </>
    );
}

export default ProductInfo;