import React, { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useDownloadReportMutation, useGetManyOrdersQuery } from "@/store/api/orders.api";
import './Orders.scss'
import { variables } from "@/variables";
import axios from "axios";

function Orders() {

    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.user);

    if (!user) {
        return <Navigate to={'/login'}/>
    }

    const inputSearch = useRef<HTMLInputElement>(null)
    const [sortParam, setSortParam] = useState('id');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchStr, setSearchStr] = useState('');
    const [days, setDays] = useState(15);
    const [productsLimit, setProductsLimit] = useState(variables.ORDERS_NUM_INITIAL);
    const { isLoading, data } = useGetManyOrdersQuery(
        {
            contain: searchStr,
            limit: productsLimit,
            sortOrder: sortOrder,
            sortParam: sortParam
        }
    )

    const downloadReport = () => {
        axios({
            url: variables.API_URL + '/order/getReport?days=' + (days == 0 ? 1 : days),
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
            link.download = `ordersReport${date + '-' + days + '-days'}.xlsx`;
            link.href = file_url;
            link.click();
        });
    }

    const sortOrdersClick = (param: string) => {
        if (sortParam === param) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortParam(param);
            setSortOrder('asc');
        }
    }

    const caretDownFill = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
    </svg>

    const caretUpFill = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
        <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
    </svg>

    return (
        <div className="d-flex p-3">
            <div className="d-flex flex-column main-wrapper m-auto align-items-center pt-3">
                <h1 className="mb-3">Заказы</h1>
                <div className="input-group home-element w-75 mb-3">
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
                {isLoading ?
                    <div className="d-flex p-3">
                        <div className="spinner-border m-auto" role="status">
                            <span className="visually-hidden">Загрузка</span>
                        </div>
                    </div> :
                    (data && typeof (data) !== 'string' && data?.length > 0 ?
                        <>
                            <table cellSpacing={0} className='table table-striped table-hover orders-table w-75'>
                                <thead>
                                    <tr>
                                        <th>
                                            #
                                        </th>
                                        <th onClick={() => sortOrdersClick('customerName')} className="cursor-pointer">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>Имя покуп.</div>
                                                {sortParam === 'customerName' ?
                                                    (sortOrder === 'asc'
                                                        ? caretUpFill
                                                        : caretDownFill
                                                    )
                                                    : <div className="orders-th-empty" />
                                                }
                                            </div>
                                        </th>
                                        <th onClick={() => sortOrdersClick('customerPhone')} className="cursor-pointer">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>Телефон покуп.</div>
                                                {sortParam === 'customerPhone' ?
                                                    (sortOrder === 'asc'
                                                        ? caretUpFill
                                                        : caretDownFill
                                                    )
                                                    : <div className="orders-th-empty" />
                                                }
                                            </div>
                                        </th>
                                        <th onClick={() => sortOrdersClick('employeeId')} className="cursor-pointer">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>ID Сотр.</div>
                                                {sortParam === 'employeeId' ?
                                                    (sortOrder === 'asc'
                                                        ? caretUpFill
                                                        : caretDownFill
                                                    )
                                                    : <div className="orders-th-empty" />
                                                }
                                            </div>
                                        </th>
                                        <th onClick={() => sortOrdersClick('orderStatus')} className="cursor-pointer">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>Статус</div>
                                                {sortParam === 'orderStatus' ?
                                                    (sortOrder === 'asc'
                                                        ? caretUpFill
                                                        : caretDownFill
                                                    )
                                                    : <div className="orders-th-empty" />
                                                }
                                            </div>
                                        </th>
                                        <th onClick={() => sortOrdersClick('creationDate')} className="cursor-pointer">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>Создан</div>
                                                {sortParam === 'creationDate' ?
                                                    (sortOrder === 'asc'
                                                        ? caretUpFill
                                                        : caretDownFill
                                                    )
                                                    : <div className="orders-th-empty" />
                                                }
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data && data.map((order, index) =>
                                        <tr key={order.id} onClick={() => navigate('/order/' + order.id)} className="cursor-pointer">
                                            <th>{index + 1}</th>
                                            <th>
                                                <div className="text-truncate">
                                                    {order.customerName}
                                                </div>
                                            </th>
                                            <th className="text-truncate">
                                                <div className="text-truncate">
                                                    {order.customerPhone}
                                                </div>
                                            </th>
                                            <th>
                                                {order.employeeId}
                                            </th>
                                            <th>
                                                {order.orderStatus}
                                            </th>
                                            <th>
                                                {new Date(order.creationDate).toLocaleString()}
                                            </th>
                                        </tr>)
                                    }
                                </tbody>
                            </table>
                            <button onClick={() => setProductsLimit(productsLimit + variables.PRODUCTS_SEARCH_ORDER)} className="btn btn-primary rounded-2">Показать еще</button>
                        </>
                        : <div>Заказы не найдены</div>)
                }

                <div className="mt-5 align-self-end">
                    <label className="mb-1" htmlFor="inputQuantityLeft">Количество дней</label>
                    <input type='text'
                        className="form-control mb-3"
                        id="inputDays"
                        value={days}
                        placeholder="Введите количество дней"
                        onChange={(e) => setDays(Number(e.target.value.replace(/\D/g, '')))}/>
                    <button onClick={() => downloadReport()} className="btn btn-primary">
                        Скачать отчет по заказам
                    </button>
                </div>
            </div>
        </div >
    );
}

export default Orders;