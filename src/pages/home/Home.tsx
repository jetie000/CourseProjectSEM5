import React, { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { variables } from "@/variables";
import './Home.scss'
import { useSearchProductsQuery } from "@/store/api/products.api";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";

function Home() {


    const inputSearch = useRef<HTMLInputElement>(null)
    const [searchStr, setSearchStr] = useState('');
    const [days, setDays] = useState(15);
    const [productsLimit, setProductsLimit] = useState(5);

    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.user);

    if (!user) {
        return <Navigate to={'/login'}/>
    }
    const { isLoading: isLoadingProducts, data: dataProducts } = useSearchProductsQuery({ contain: searchStr, limit: productsLimit })

    const downloadReport = () => {
        axios({
            url: variables.API_URL + '/product/getReport?days=' + (days == 0 ? 1 : days),
            method: 'GET',
            responseType: 'blob',
            headers: {
                "Authorization": "Bearer " + variables.GET_ACCESS_TOKEN()
            }
        }).then(response => {
            const blob_file: Blob = response.data;
            const file_url = URL.createObjectURL(blob_file);
            const link = document.createElement('a');
            let date = new Date().toLocaleString()
            link.download = `productsReport${date + '-' + days + '-days'}.xlsx`;
            link.href = file_url;
            link.click();
        });
    }

    return (
        <div className="d-flex p-3">
            <div className="d-flex flex-column main-wrapper m-auto align-items-center pt-3">
                <div className="input-group home-element w-75 mb-4">
                    <input type="text"
                        className="form-control w-50"
                        placeholder="Введите запрос"
                        ref={inputSearch}
                        onChange={(e) => setSearchStr(e.target.value)} />
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
                {isLoadingProducts ?
                    <div className="d-flex p-3">
                        <div className="spinner-border m-auto" role="status">
                            <span className="visually-hidden">Загрузка</span>
                        </div>
                    </div> :
                    (dataProducts && typeof (dataProducts) !== 'string' && dataProducts?.length > 0 ?
                        <>
                            <div className="flex-fill home-element w-75">
                                {
                                    dataProducts?.map(product =>
                                        <div onClick={() => navigate('/product/' + product.id)} className='m-2 ms-0 me-0 border rounded-4 product-item d-flex cursor-pointer' key={product.id}>
                                            <img className='rounded-start-4 img-fluid' src={variables.PHOTOS_URL + product.photoPath} alt="ProductImg" />
                                            <div className='d-flex flex-column p-4 ps-5 fs-5 justify-content-around flex-fill w-25'>
                                                <span className='fs-1 text-truncate'>{product.name}</span>
                                                <div className='d-flex gap-2'>
                                                    <div className='d-flex flex-column'>
                                                        <span className='fs-4 fw-light'>Категория </span>
                                                        <span>Цена (р)</span>
                                                        <span>Осталось</span>
                                                        <span>Дата создания </span>
                                                    </div>
                                                    <div className='d-flex flex-column overflow-x-hidden'>
                                                        <span className='fs-4 fw-light text-truncate'>{product.category}</span>
                                                        <span>{product.price}</span>
                                                        <span>{product.quantityLeft}</span>
                                                        <span>{new Date(product.creationDate).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>)
                                }
                                <div className='btn btn-outline-primary mt-2 fs-4 border rounded-4 d-flex justify-content-center' onClick={() => setProductsLimit(productsLimit + 5)}>
                                    Показать еще
                                </div>
                            </div>
                            <div className="mt-5 ms-auto">
                                <label className="mb-1" htmlFor="inputQuantityLeft">Количество дней</label>
                                <input type='text'
                                    className="form-control mb-3"
                                    id="inputDays"
                                    value={days}
                                    placeholder="Введите количество дней"
                                    onChange={(e) => setDays(Number(e.target.value.replace(/\D/g, '')))} />
                                <button onClick={() => downloadReport()} className="btn btn-primary">
                                    Скачать отчет по товарам
                                </button>
                            </div>
                        </>
                        : <div>Товары не найдены</div>)
                }
            </div>
        </div >
    );
}

export default Home;