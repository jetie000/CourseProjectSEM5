import React, { useEffect, useState } from 'react'
import { dataUrlToFile } from '@/utils/cropUtils';
import { Modal as bootstrapModal } from 'bootstrap';
import { Toast as bootstrapToast } from 'bootstrap';
import { useActions } from '@/hooks/useActions';
import { IModalInfo } from '@/types/modalInfo.interface';
import Modal from '@/pages/modal/Modal';
import { Navigate } from 'react-router-dom';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { IProductFields, IProductFieldsType } from '@/types/productFields.interface';
import MyCropper from '../cropper/MyCropper';
import { useAddProductMutation, usePostProductPhotoMutation } from '@/store/api/products.api';
import { useGetAllCategoriesQuery } from '@/store/api/category.api';
import ProductFields from './ProductFields';
import './AddProduct.scss'


function AddProduct() {
    const { user } = useSelector((state: RootState) => state.user);

    if (!user) {
        return <Navigate to={'/'} />;
    }
    
    const [croppedImage, setCroppedImage] = useState<string | undefined>(undefined);
    const [fieldsType, setFieldsType] = useState<IProductFieldsType[]>([]);
    const [fields, setFields] = useState<IProductFields[]>([]);
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const { setToastChildren } = useActions();


    const [addProduct, { isLoading, isSuccess, isError, error, data }] = useAddProductMutation();
    const [postProductImg, { isLoading: isLoadingImg, isSuccess: isSuccessImg, isError: isErrorImg, error: errorImg, data: dataImg }] = usePostProductPhotoMutation();
    const { data: categoriesData } = useGetAllCategoriesQuery(null);

    useEffect(() => {
        if (isSuccessImg) {
            let inputName = (document.getElementById('inputName') as HTMLInputElement).value;
            let inputDesc = (document.getElementById('inputDesc') as HTMLInputElement).value;
            let inputCategory = (document.getElementById('inputCategory') as HTMLSelectElement).value;
            let inputPrice = Number((document.getElementById('inputPrice') as HTMLInputElement).value);
            let inputQuantityLeft = Number((document.getElementById('inputQuantityLeft') as HTMLInputElement).value);
            let inputPriceDiscount = Number((document.getElementById('inputPriceDiscount') as HTMLInputElement).value);
            let inputManufacturer = (document.getElementById('inputManufacturer') as HTMLInputElement).value;

            addProduct({
                id: undefined,
                name: inputName,
                category: inputCategory,
                description: inputDesc !== '' ? inputDesc : undefined,
                photoPath: dataImg || 'default.png',
                creationDate: new Date(),
                price: inputPrice,
                quantityLeft: inputQuantityLeft,
                quantitySold: 0,
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
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren('Товар успешно добавлен');
            myToast.show();
        }
        if (isError) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('addProductModal') || 'addProductModal');
            setModalInfo({ title: "Ошибка", children: 'Ошибка добавления товара' })
            myModal.show();
        }
    }, [isLoading])

    const addProductClick = async () => {
        console.log(fields);
        let inputName = (document.getElementById('inputName') as HTMLInputElement).value;
        let inputDesc = (document.getElementById('inputDesc') as HTMLInputElement).value;
        let inputCategory = (document.getElementById('inputCategory') as HTMLSelectElement).value;
        let inputPrice = Number((document.getElementById('inputPrice') as HTMLInputElement).value);
        let inputQuantityLeft = Number((document.getElementById('inputQuantityLeft') as HTMLInputElement).value);
        let inputPriceDiscount = Number((document.getElementById('inputPriceDiscount') as HTMLInputElement).value);
        let inputManufacturer = (document.getElementById('inputManufacturer') as HTMLInputElement).value;
        if (inputName.trim() === '' ||
            inputManufacturer.trim() === '' ||
            fields.some(field => field.fieldName.trim() === '') ||
            inputCategory.trim() === '' ||
            inputPrice <= 0 ||
            inputQuantityLeft < 0 ||
            inputPriceDiscount < 0 ||
            inputPriceDiscount >= 100) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('addProductModal') || 'addProductModal');
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
            addProduct({
                id: undefined,
                name: inputName,
                category: inputCategory,
                description: inputDesc !== '' ? inputDesc : undefined,
                photoPath: dataImg || 'default.png',
                creationDate: new Date(),
                price: inputPrice,
                quantityLeft: inputQuantityLeft,
                quantitySold: 0,
                priceDiscount: inputPriceDiscount,
                manufacturer: inputManufacturer,
                productFields: fields
            })
        }
    }

    const addField = () => {
        let value = (document.getElementById('selectType') as HTMLInputElement).value;
        setFieldsType([...fieldsType, { id: undefined, fieldType: value }])
        setFields([...fields, { id: undefined, fieldName: '' }])
    }

    return (
        <div className="d-flex p-3 flex-fill">
            <div className="d-flex flex-column main-wrapper ms-auto me-auto">
                <h2 className="text-center p-3">
                    Создание нового товара
                </h2>
                <div className="d-flex align-self-center flex-column w-50 mb-4 add-product-wrapper">
                    <span className='fs-5'>
                        Фото товара
                    </span>
                    <MyCropper croppedImage={croppedImage} setCroppedImage={setCroppedImage} />
                    {croppedImage && <img className='img-fluid border rounded-2 mb-1' src={croppedImage} alt="blab" />}
                    <label className="mb-1 fs-5" htmlFor="inputName">Название товара</label>
                    <input className="form-control fs-6 mb-3" id="inputName" placeholder="Введите название товара" />
                    <label className="mb-1 fs-5" htmlFor="inputCategory">Категория товара</label>
                    <select className="form-select mb-3" id='inputCategory'>
                        {
                            categoriesData && typeof (categoriesData) != 'string' && categoriesData.map(categoryData =>
                                <option key={categoryData.id} value={categoryData.category}>{categoryData.category}</option>
                            )
                        }
                    </select>
                    <label className="mb-1 fs-5" htmlFor="inputPrice">Цена товара (р)</label>
                    <input type='number' className="form-control fs-6 mb-3" id="inputPrice" defaultValue={0} placeholder="Введите цену товара" />
                    <label className="mb-1 fs-5" htmlFor="inputQuantityLeft">Количество товара</label>
                    <input type='number' className="form-control fs-6 mb-3" id="inputQuantityLeft" defaultValue={0} placeholder="Введите количество товара" />
                    <label className="mb-1 fs-5" htmlFor="inputPriceDiscount">Скидка на товар (%)</label>
                    <input type='number' className="form-control fs-6 mb-3" id="inputPriceDiscount" defaultValue={0} placeholder="Введите скидку на товар" />
                    <label className="mb-1 fs-5" htmlFor="inputManufacturer">Производитель товара</label>
                    <input className="form-control fs-6 mb-3" id="inputManufacturer" placeholder="Введите производителя товара" />

                    <label className="mb-1 fs-5" htmlFor="inputDesc">Описание товара</label>
                    <textarea rows={4} className="form-control fs-6 mb-3" id="inputDesc" placeholder="Введите описание товара" />
                    <span className='fs-5 mb-1'>
                        Добавление полей товара
                    </span>
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
                    <ProductFields fieldsType={fieldsType} fields={fields} setFields={setFields} setFieldsType={setFieldsType} />
                    <button onClick={() => addProductClick()} className='btn btn-primary fs-4 mt-4'>
                        {isLoadingImg || isLoading ?
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Загрузка</span>
                            </div>
                            :
                            <div>Добавить товар</div>
                        }
                    </button>
                </div>
                <Modal id='addProductModal' title={modalInfo.title}>
                    {modalInfo.children}
                </Modal>
            </div>
        </div>
    );
}

export default AddProduct;