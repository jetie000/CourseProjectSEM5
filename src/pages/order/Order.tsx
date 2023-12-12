import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toast as bootstrapToast } from 'bootstrap';
import { useActions } from "@/hooks/useActions";
import { useGetOneOrderQuery } from "@/store/api/orders.api";
import OrderInfo from "./OrderInfo";
import './Order.scss'

function Order() {
    let { id } = useParams();
    const { isLoading, isError, data } = useGetOneOrderQuery(Number(id))
    const { setToastChildren } = useActions();

    useEffect(() => {
        if (isError || data === 'No order found.') {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Заказ не найден");
            myToast.show();
        }
    }, [isLoading])

    return (
        <div className="d-flex flex-fill p-3">
            <div className="d-flex flex-column main-wrapper ms-auto me-auto">
                <Link to={'/orders'} className="btn btn-outline-primary align-items-center align-self-start d-flex mt-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                    Вернуться к заказам
                </Link>
                {
                    data && typeof (data) != 'string' ?
                        <div className="order-order d-flex flex-column">
                            <OrderInfo data={data} />
                        </div>
                        : (isLoading ?
                            <div className="spinner-border m-auto" role="status">
                                <span className="visually-hidden">Загрузка</span>
                            </div>
                            : <span className="fs-2 m-auto">Заказ не найден</span>)
                }
            </div>
        </div>
    );
}

export default Order;