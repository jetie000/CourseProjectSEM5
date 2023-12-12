import React, { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from "react-router-dom";
import { useActions } from '@/hooks/useActions';
import { IModalInfo } from '@/types/modalInfo.interface';
import { Modal as bootstrapModal } from 'bootstrap';
import { Toast as bootstrapToast } from 'bootstrap';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { dataUrlToFile } from '@/utils/cropUtils';
import Modal from '@/pages/modal/Modal';
import { variables } from '@/variables';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { useChangeProductMutation, useGetOneQuery, usePostProductPhotoMutation } from '@/store/api/products.api';
import MyCropper from '../cropper/MyCropper';
import { useGetAllCategoriesQuery } from '@/store/api/category.api';
import { IProduct } from '@/types/product.interface';
import './ChangeProduct.scss'
import { IProductFields, IProductFieldsType } from '@/types/productFields.interface';
import ProductFields from '../addProduct/ProductFields';

function ChangeProduct() {
    let { id } = useParams();
    const { user } = useSelector((state: RootState) => state.user);
    if (!user) {
        return <Navigate to={'/login'} />;
    }
    const { isLoading: isLoadingGet, isSuccess: isSuccessGet, isError: isErrorGet, error: errorGet, data: dataGet } = useGetOneQuery(Number(id))
    const [croppedImage, setCroppedImage] = useState<string | undefined>(undefined);
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const { setToastChildren } = useActions();
    const [fieldsType, setFieldsType] = useState<IProductFieldsType[]>([]);
    const [fields, setFields] = useState<IProductFields[]>([]);

    const { data: categoriesData } = useGetAllCategoriesQuery(null);
    const [changeProduct, { isLoading, isSuccess, isError, error, data }] = useChangeProductMutation();
    const [postProductImg, { isLoading: isLoadingImg, isSuccess: isSuccessImg, isError: isErrorImg, error: errorImg, data: dataImg }] = usePostProductPhotoMutation();

    useEffect(() => {
        if (typeof (dataGet) !== 'string' && isSuccessGet) {
            setFields([...dataGet.productFields || []]);
            setFieldsType(dataGet?.productFields?.map((field, index) => {
                let fieldType: IProductFieldsType = {
                    id: index,
                    fieldType: ''
                };
                if (field.stringFieldValue !== null)
                    fieldType.fieldType = 'string'
                else
                    if (field.doubleFieldValue !== null)
                        fieldType.fieldType = 'number'
                    else
                        if (field.dateFieldValue !== null)
                            fieldType.fieldType = 'Date'
                        else
                            fieldType.fieldType = 'boolean'
                return fieldType;
            }) || [])
        }
        if (isErrorGet) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren('Ошибка загрузки товара');
            myToast.show();
        }
    }, [isLoadingGet])

    useEffect(() => {
        if (isSuccessImg) {
            let inputName = (document.getElementById('inputName') as HTMLInputElement).value;
            let inputDesc = (document.getElementById('inputDesc') as HTMLInputElement).value;
            let inputCategory = (document.getElementById('inputCategory') as HTMLSelectElement).value;
            let inputPrice = Number((document.getElementById('inputPrice') as HTMLInputElement).value);
            let inputQuantityLeft = Number((document.getElementById('inputQuantityLeft') as HTMLInputElement).value);
            let inputQuantitySold = Number((document.getElementById('inputQuantitySold') as HTMLInputElement).value);
            let inputPriceDiscount = Number((document.getElementById('inputPriceDiscount') as HTMLInputElement).value);
            let inputManufacturer = (document.getElementById('inputManufacturer') as HTMLInputElement).value;

            changeProduct({
                id: (dataGet as IProduct).id,
                name: inputName,
                category: inputCategory,
                description: inputDesc !== '' ? inputDesc : undefined,
                photoPath: dataImg || 'default.png',
                creationDate: new Date(),
                price: inputPrice,
                quantityLeft: inputQuantityLeft,
                quantitySold: inputQuantitySold,
                priceDiscount: inputPriceDiscount,
                manufacturer: inputManufacturer,
                productFields: fields
            })
        }
        if (isErrorImg) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren('Ошибка загрузки фото товара');
            myToast.show();
        }
    }, [isLoadingImg]);

    useEffect(() => {
        if (isSuccess) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('changeProductModal') || 'changeProductModal');
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            if (data === "No product found.") {
                setModalInfo({ title: "Ошибка", children: "Товар не найден" })
                myModal.show();
            }
            else {
                setToastChildren("Товар успешно изменен");
                myToast.show();
            }
        }
        if (isError) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('changeProductModal') || 'changeProductModal');
            setModalInfo({ title: "Ошибка", children: (error as FetchBaseQueryError).data as string })
            myModal.show();
        }
    }, [isLoading])

    const addField = () => {
        let value = (document.getElementById('selectType') as HTMLInputElement).value;
        setFieldsType([...fieldsType, { id: undefined, fieldType: value }])
        setFields([...fields, { id: undefined, fieldName: '' }])
    }

    const changeProductClick = async () => {
        let inputName = (document.getElementById('inputName') as HTMLInputElement).value;
        let inputDesc = (document.getElementById('inputDesc') as HTMLInputElement).value;
        let inputCategory = (document.getElementById('inputCategory') as HTMLSelectElement).value;
        let inputPrice = Number((document.getElementById('inputPrice') as HTMLInputElement).value);
        let inputQuantityLeft = Number((document.getElementById('inputQuantityLeft') as HTMLInputElement).value);
        let inputQuantitySold = Number((document.getElementById('inputQuantitySold') as HTMLInputElement).value);
        let inputPriceDiscount = Number((document.getElementById('inputPriceDiscount') as HTMLInputElement).value);
        let inputManufacturer = (document.getElementById('inputManufacturer') as HTMLInputElement).value;
        if (inputName.trim() === '' ||
            inputManufacturer.trim() === '' ||
            inputCategory.trim() === '' ||
            inputPrice <= 0 ||
            inputQuantityLeft < 0 ||
            inputQuantitySold < 0 ||
            inputPriceDiscount < 0 ||
            inputPriceDiscount >= 100) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('changeProductModal') || 'changeProductModal');
            setModalInfo({ title: "Ошибка", children: 'Введите данные' })
            myModal.show();
            return;
        }
        if (croppedImage) {
            const formData = new FormData();
            let imgFile = await dataUrlToFile(croppedImage, inputName + '.jpg')
            formData.append('file', imgFile, imgFile.name);
            postProductImg(formData);
        }
        else {
            changeProduct({
                id: (dataGet as IProduct).id,
                name: inputName,
                category: inputCategory,
                description: inputDesc !== '' ? inputDesc : undefined,
                photoPath: (dataGet as IProduct).photoPath,
                creationDate: new Date(),
                price: inputPrice,
                quantityLeft: inputQuantityLeft,
                quantitySold: inputQuantitySold,
                priceDiscount: inputPriceDiscount,
                manufacturer: inputManufacturer,
                productFields: fields
            })
        }
    }

    return (
        <div className="d-flex p-3 flex-fill">
            <div className="d-flex flex-column main-wrapper ms-auto me-auto">
                <Link to={id ? '/product/' + id : '/'} className="btn btn-outline-primary align-items-center align-self-start d-flex mt-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                    Вернуться к товару
                </Link>
                {
                    dataGet && typeof (dataGet) !== 'string' && <>
                        <h2 className="text-center p-3">
                            Изменение товара
                        </h2>
                        <div className="d-flex align-self-center flex-column w-50 mb-4 change-product-wrapper">
                            <span className='fs-5'>
                                Фото товара
                            </span>
                            <MyCropper croppedImage={croppedImage} setCroppedImage={setCroppedImage} />
                            {croppedImage ? <img className='img-fluid border rounded-2 mb-1' src={croppedImage} alt="blab" />
                                : <img className='img-fluid border rounded-2 mb-1' src={variables.PHOTOS_URL + dataGet.photoPath} alt="blab" />}
                            <label className="mb-1 fs-5" htmlFor="inputName">Название товара</label>
                            <input className="form-control fs-6 mb-3" id="inputName" placeholder="Введите название товара" defaultValue={dataGet.name} />
                            <label className="mb-1 fs-5" htmlFor="inputCategory">Категория товара</label>
                            <select className="form-select mb-3" id='inputCategory' defaultValue={dataGet.category}>
                                {
                                    categoriesData && typeof (categoriesData) != 'string' && categoriesData.map(categoryData =>
                                        <option key={categoryData.id} value={categoryData.category}>{categoryData.category}</option>
                                    )
                                }
                            </select>
                            <label className="mb-1 fs-5" htmlFor="inputPrice">Цена товара (р)</label>
                            <input type='number' className="form-control fs-6 mb-3" id="inputPrice" defaultValue={dataGet.price} placeholder="Введите цену товара" />
                            <label className="mb-1 fs-5" htmlFor="inputQuantityLeft">Количество товара</label>
                            <input type='number' className="form-control fs-6 mb-3" id="inputQuantityLeft" defaultValue={dataGet.quantityLeft} placeholder="Введите количество товара" />
                            <label className="mb-1 fs-5" htmlFor="inputQuantitySold">Продано товара</label>
                            <input type='number' className="form-control fs-6 mb-3" id="inputQuantitySold" defaultValue={dataGet.quantitySold} placeholder="Введите количество проданного товара" />
                            <label className="mb-1 fs-5" htmlFor="inputPriceDiscount">Скидка на товар (%)</label>
                            <input type='number' className="form-control fs-6 mb-3" id="inputPriceDiscount" defaultValue={dataGet.priceDiscount} placeholder="Введите скидку на товар" />
                            <label className="mb-1 fs-5" htmlFor="inputManufacturer">Производитель товара</label>
                            <input className="form-control fs-6 mb-3" id="inputManufacturer" defaultValue={dataGet.manufacturer} placeholder="Введите производителя товара" />

                            <label className="mb-1 fs-5" htmlFor="inputDesc">Описание товара</label>
                            <textarea rows={4} className="form-control fs-6 mb-3" id="inputDesc" placeholder="Введите описание товара" defaultValue={dataGet.description} />

                            <div className="d-flex gap-2 mb-2">
                                <button
                                    className='btn btn-secondary flex-shrink-0'
                                    onClick={() => addField()}>
                                    Добавить поле
                                </button>
                                <select id='selectType' defaultValue='string' className="form-select">
                                    <option value='string'>Строка</option>
                                    <option value="number">Число</option>
                                    <option value="Date">Дата</option>
                                    <option value="boolean">Да/Нет</option>
                                </select>
                            </div>
                            <ProductFields setFields={setFields} fields={fields} fieldsType={fieldsType} setFieldsType={setFieldsType} />
                            <button onClick={() => changeProductClick()} className='btn btn-primary fs-4 mt-4'>
                                {isLoadingImg || isLoading ?
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Загрузка</span>
                                    </div>
                                    :
                                    <div>Изменить товар</div>
                                }
                            </button>
                        </div>
                    </>
                }
                <Modal id='changeProductModal' title={modalInfo.title}>
                    {modalInfo.children}
                </Modal>
            </div>
        </div>
    );
}

export default ChangeProduct;