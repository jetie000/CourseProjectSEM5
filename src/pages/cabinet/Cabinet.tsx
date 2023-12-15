import React, { useEffect, useState } from 'react'
import { IModalInfo } from '@/types/modalInfo.interface';
import Modal from '@/pages/modal/Modal';
import { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { Modal as bootstrapModal } from 'bootstrap';
import { Toast as bootstrapToast } from 'bootstrap'
import { useChangeUserMutation, useDeleteUserMutation } from '@/store/api/user.api';
import { useActions } from '@/hooks/useActions';
import { IUser } from '@/types/user.interface';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import './Cabinet.scss'
import { baseApi } from '@/store/api/baseApi';
import { Navigate, useNavigate } from 'react-router-dom';

function Cabinet() {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.user);

    if (!user) {
        return <Navigate to={'/login'}/>
    }

    const dispatch = useDispatch();
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const [changeUser, { isLoading, isSuccess, isError, error, data }] = useChangeUserMutation();
    const [deleteUser, { isLoading: deleteLoading, isSuccess: deleteSuccess, isError: deleteIsError, error: deleteError, data: deleteData }] = useDeleteUserMutation();
    const { logout, setUser, setToastChildren } = useActions();

    useEffect(() => {
        if (isSuccess) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            if (data === "User with that email exists.") {
                setModalInfo({ title: "Ошибка", children: 'Пользователь с таким адресом эл. почты существует' })
                myModal.show();
            }
            else if (data === "Wrong Password.") {
                setModalInfo({ title: "Ошибка", children: 'Вы ввели неправильный пароль' })
                myModal.show();
            }
            else {
                setToastChildren('Данные успешно изменены');
                myToast.show();
                setUser(data as IUser);
            }
            (document.getElementById('inputNewPassword') as HTMLInputElement).value = '';
            (document.getElementById('inputOldPassword') as HTMLInputElement).value = '';
        }
        if (isError) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
            setModalInfo({ title: "Ошибка", children: (error as FetchBaseQueryError).data as string })
            myModal.show();
        }
    }, [isLoading]);

    useEffect(() => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
        if (deleteSuccess) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            if (deleteData === "Invalid data.") {
                setModalInfo({ title: "Ошибка", children: 'Ошибка в данных пользователя' })
            }
            else {
                myModal.hide();
                logout();
                setToastChildren('Пользователь успешно удален');
                myToast.show();
            }
        }
        if (deleteIsError) {
            setModalInfo({ title: "Ошибка", children: (deleteError as FetchBaseQueryError).data as string })
            myModal.show();
        }

    }, [deleteLoading]);

    const changeInfoClick = async () => {
        let inputName = (document.getElementById('inputName') as HTMLInputElement).value;
        let inputSurname = (document.getElementById('inputSurname') as HTMLInputElement).value;
        let inputEmail = (document.getElementById('inputEmail') as HTMLInputElement).value;
        let inputOldPassword = (document.getElementById('inputOldPassword') as HTMLInputElement).value;
        let inputNewPassword = (document.getElementById('inputNewPassword') as HTMLInputElement).value;
        if (inputEmail == "" || inputOldPassword == "" || inputName == "" || inputSurname == "") {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
            setModalInfo({ title: "Ошибка", children: 'Введите данные' });
            myModal.show();
            return;
        }
        if (user)
            changeUser({
                email: inputEmail.trim(),
                saltedOldPassword: inputOldPassword.trim(),
                fullName: inputSurname.trim() + ' ' + inputName.trim(),
                saltedNewPassword: inputNewPassword.trim(),
                accessToken: user.accessToken
            });
    }

    const deleteAccClick = () => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
        const children = user
            ?
            <div className='d-flex flex-column gap-3'>
                <span>Вы точно хотите удалить аккаунт? Вместе с этим вы удалите все свои коллекции.</span>
                <button onClick={() =>
                    deleteUser({
                        email: user?.email,
                        saltedPassword: user?.saltedPassword,
                        accessToken: user?.accessToken
                    })} className='btn btn-danger'>
                    Удалить аккаунт
                </button>
            </div >
            : <div>Пользователь не найден</div>;
        setModalInfo({ title: 'Удаление аккаунта', children: children });
        myModal.show();
    }

    const logOutClick = () => {
        dispatch(baseApi.util.resetApiState())
        logout(); 
        navigate('/');
    }

    return (
        <div className=' d-flex flex-fill flex-column main-wrapper m-auto p-4'>
            <div className='ms-auto me-auto d-flex flex-column cabinet-my-info ps-3 pe-3 flex-fill'>
                <h2 className='text-center p-3'>
                    Мои данные
                </h2>
                <div className="mb-3">
                    <label htmlFor="inputSurname">Фамилия</label>
                    <input className="form-control" id="inputSurname" placeholder='Введите новую фамилию' defaultValue={user?.fullName.split(' ', 2)[0]} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputName">Имя</label>
                    <input className="form-control" id="inputName" placeholder='Введите новое имя' defaultValue={user?.fullName.split(' ', 2)[1]} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputEmail">Email</label>
                    <input type='email' className="form-control" id="inputEmail" placeholder='Введите новый email' defaultValue={user?.email} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputOldPassword">Старый пароль (Обязательно)</label>
                    <input type="password" className="form-control" id="inputOldPassword" placeholder='Введите старый пароль' />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputNewPassword">Новый пароль (По желанию)</label>
                    <input type="password" className="form-control" id="inputNewPassword" placeholder='Введите новый пароль' />
                </div>
                <button type="button"
                    className="btn btn-primary mt-3 w-100"
                    onClick={() => changeInfoClick()}>
                    Изменить данные
                </button>

                <Modal id='myInfoModal' title={modalInfo.title}>
                    {modalInfo.children}
                </Modal>
            </div>
            <div className="d-flex justify-content-between mt-4 cabinet-buttons">
                <button className='btn btn-danger d-flex justify-content-center align-items-center gap-2 mt-4' onClick={() => logOutClick()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                        <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
                    </svg>
                    Выйти
                </button>
                <button onClick={() => deleteAccClick()} className='btn btn-danger d-flex justify-content-center align-items-center gap-2 mt-4'>
                    Удалить аккаунт
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Cabinet;