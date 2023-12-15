import React, { useEffect, useRef, useState } from "react";
import { useGetAllQuery } from "@/store/api/user.api";
import { IUser } from "@/types/user.interface";
import Modal from "@/pages/modal/Modal";
import { IModalInfo } from "@/types/modalInfo.interface";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import AdminMenuUsers from "./AdminMenuUsers";
import { variables } from "@/variables";
import AdminMenuButtons from "./AdminMenuButtons";
import { Navigate, useNavigate } from "react-router-dom";
import './AdminMenu.scss'
import axios from "axios";

function AdminMenu() {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.user);

    if (!user) {
        return <Navigate to={'/login'}/>
    }
    const [currentUser, setCurrentUser] = useState<IUser>();
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const inputSearch = useRef<HTMLInputElement>(null)
    const [searchStr, setSearchStr] = useState('');
    const [limit, setLimit] = useState(variables.USERS_NUM_INITIAL);
    const [days, setDays] = useState(15);
    const { data, isLoading } = useGetAllQuery({ limit: limit, contain: searchStr });

    const inputID = useRef<HTMLInputElement>(null);
    const inputName = useRef<HTMLInputElement>(null);
    const inputSurname = useRef<HTMLInputElement>(null);
    const inputEmail = useRef<HTMLInputElement>(null);
    const roleSelect = useRef<HTMLSelectElement>(null);
    const inputAccess = useRef<HTMLInputElement>(null);
    const inputPassword = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputName.current
            && inputSurname.current
            && inputEmail.current
            && roleSelect.current
            && inputAccess.current
            && inputPassword.current
            && inputID.current) {
            inputID.current.value = currentUser?.id.toString() || '';
            inputName.current.value = currentUser?.fullName.split(' ', 2)[1] || '';
            inputSurname.current.value = currentUser?.fullName.split(' ', 2)[0] || '';
            inputEmail.current.value = currentUser?.email || '';
            roleSelect.current.value = currentUser?.role.toString() || '';
            inputAccess.current.checked = currentUser?.access || false;
            inputPassword.current.value = '';
        }
    }, [currentUser])

    const downloadReport = () => {
        axios({
            url: variables.API_URL + '/user/getReport?days=' + (days == 0 ? 1 : days),
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
            link.download = `employeeReport_${date + '-' + days + '-days'}.xlsx`;
            link.href = file_url;
            link.click();
        });
    }

    return (
        <div className="d-flex p-3 flex-fill">
            <div className="d-flex flex-column main-wrapper ms-auto me-auto">
                <h2 className='text-center p-2'>
                    Меню Администратора
                </h2>
                <h4 className='text-center p-2'>
                    Выбранный пользователь
                </h4>
                <div className="d-flex admin-menu-inputs gap-3 border rounded-4 p-3">
                    <div className="d-flex flex-column w-50">
                        <div className="mb-2">
                            <label htmlFor="inputSurname">Фамилия</label>
                            <input className="form-control" id="inputSurname" ref={inputSurname} placeholder="Введите фамилию" />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="inputName">Имя</label>
                            <input className="form-control" id="inputName" ref={inputName} placeholder="Введите имя" />
                        </div>
                        <div className="d-flex gap-4 align-items-center">
                            <div className="flex-fill">
                                <label className="form-check-label" htmlFor="roleSelect">Роль</label>
                                <select className="form-select" id='roleSelect' ref={roleSelect}>
                                    <option value={0}>Пользователь</option>
                                    <option value={1}>Администратор</option>
                                </select>
                            </div>
                            <div className="form-check p-3 ps-4 pe-4">
                                <input className="form-check-input" type="checkbox" ref={inputAccess} id="inputAccess" />
                                <label className="form-check-label" htmlFor="inputAccess">Доступ</label>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column w-50">
                        <div className="mb-2">
                            <label htmlFor="inputId">ID</label>
                            <input type='email' className="form-control" id="inputId" ref={inputID} disabled />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="inputEmail">E-mail</label>
                            <input type='email' className="form-control" id="inputEmail" ref={inputEmail} placeholder="Введите e-mail" />
                        </div>
                        <div>
                            <label htmlFor="inputNewPassword">Новый пароль (по желанию)</label>
                            <input type="password" className="form-control" id="inputNewPassword" ref={inputPassword} placeholder="Введите новый пароль" />
                        </div>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <AdminMenuButtons
                        setModalInfo={setModalInfo}
                        currentUser={currentUser!}
                        setCurrentUser={setCurrentUser}
                        inputUserRef={{
                            inputEmail: inputEmail,
                            inputName: inputName,
                            inputPassword: inputPassword,
                            inputSurname: inputSurname,
                            inputAccess: inputAccess,
                            roleSelect: roleSelect
                        }} />
                </div>
                <h4 className='text-center p-2 mt-4'>
                    Список пользователей
                </h4>
                <div className="input-group mb-2">
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
                {
                    isLoading ?
                        <div className="d-flex p-3">
                            <div className="spinner-border m-auto" role="status">
                                <span className="visually-hidden">Загрузка</span>
                            </div>
                        </div> :
                        <>
                            <AdminMenuUsers data={data} setCurrentUser={setCurrentUser} />

                            <div className='btn btn-outline-primary mt-2 border rounded-4 d-flex justify-content-center' onClick={() => setLimit(limit + 5)}>
                                Показать еще
                            </div>
                        </>
                }
                <div className="mt-5 align-self-end">
                    <label className="mb-1" htmlFor="inputQuantityLeft">Количество дней</label>
                    <input type='text'
                        className="form-control mb-3"
                        id="inputDays"
                        value={days}
                        placeholder="Введите количество дней"
                        onChange={(e) => setDays(Number(e.target.value.replace(/\D/g, '')))} />
                    <button onClick={() => downloadReport()} className="btn btn-primary">
                        Скачать отчет по работникам
                    </button>
                </div>
                <Modal id='myInfoModal' title={modalInfo.title}>
                    {modalInfo.children}
                </Modal>
            </div>
        </div>
    );
}

export default AdminMenu;