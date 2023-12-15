import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Toast as bootstrapToast } from 'bootstrap';
import { useActions } from "@/hooks/useActions";
import { useGetOneQuery } from "@/store/api/products.api";
import ProductInfo from "./ProductInfo";
import './Product.scss'
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function Product() {
    const { user } = useSelector((state: RootState) => state.user);

    if (!user) {
        return <Navigate to={'/login'}/>
    }
    
    let { id } = useParams();
    const { isLoading, isError, data } = useGetOneQuery(Number(id))
    const { setToastChildren } = useActions();

    useEffect(() => {
        if (isError || data === 'No product found.') {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Товар не найден");
            myToast.show();
        }
    }, [isLoading])

    return (
        <div className="d-flex p-3 flex-fill">
            <div className="d-flex flex-column main-wrapper ms-auto me-auto">
                <Link to={'/'} className="btn btn-outline-primary align-items-center align-self-start d-flex mt-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                    Вернуться на главную
                </Link>
                {
                    data && typeof (data) != 'string' ?
                        <div className="product-product d-flex flex-column">
                            <ProductInfo data={data} />
                        </div>
                        : (isLoading ?
                            <div className="spinner-border m-auto" role="status">
                                <span className="visually-hidden">Загрузка</span>
                            </div>
                            : <span className="fs-2 m-auto">Товар не найден</span>)
                }
            </div>
        </div>
    );
}

export default Product;