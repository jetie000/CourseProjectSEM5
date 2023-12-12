import React, { useEffect, useState } from 'react';
import Modal from '@/pages/modal/Modal'
import 'bootstrap';
import { IModalInfo } from '@/types/modalInfo.interface';
import { useRegisterUserMutation } from '@/store/api/user.api';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

function Register() {
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const [registerUser, { isLoading, isSuccess, isError, error, data }] = useRegisterUserMutation();

    useEffect(() => {
        if (isSuccess) {
            if (data === 'User exists.')
                setModalInfo({ title: "Ошибка", children: 'Пользователь с таким адресом эл. почты существует' })
            else {
                setModalInfo({ title: 'Успешно', children: 'Вы успешно зарегистрированы' });
                (document.getElementById('inputName') as HTMLInputElement).value = '';
                (document.getElementById('inputSurname') as HTMLInputElement).value = '';
                (document.getElementById('inputEmail') as HTMLInputElement).value = '';
                (document.getElementById('inputPassword') as HTMLInputElement).value = '';
            }
        }
        if (isError) {
            setModalInfo({ title: "Ошибка", children: ((error as FetchBaseQueryError).data as string) })
        }
    }, [isLoading])

    const registerClick = () => {
        let inputName = (document.getElementById('inputName') as HTMLInputElement).value;
        let inputSurname = (document.getElementById('inputSurname') as HTMLInputElement).value;
        let inputEmail = (document.getElementById('inputEmail') as HTMLInputElement).value;
        let inputPassword = (document.getElementById('inputPassword') as HTMLInputElement).value;
        if (inputEmail == "" || inputPassword == "" || inputName == "" || inputSurname == "") {
            setModalInfo({ title: "Ошибка", children: 'Введите данные' })
            return;
        }
        registerUser({
            email: inputEmail.trim(),
            saltedPassword: inputPassword.trim(),
            fullName: inputSurname.trim() + ' ' + inputName.trim()
        });
        setModalInfo({ title: "Загрузка", children: "Загрузка" })
    }

    return (
        <div className="mt-3">
            <form>
                <div className="mb-3">
                    <label htmlFor="inputSurname">Фамилия</label>
                    <input className="form-control" id="inputSurname" placeholder='Введите фамилию' />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputName">Имя</label>
                    <input className="form-control" id="inputName" placeholder='Введите имя' />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputEmail">Email</label>
                    <input type='email' className="form-control" id="inputEmail" placeholder='Введите e-mail' />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputPassword">Пароль</label>
                    <input type="password" className="form-control" id="inputPassword" placeholder='Введите пароль' />
                </div>
                <button type="button"
                    className="btn btn-primary mt-3 w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#registerModal"
                    onClick={() => registerClick()}>
                    Зарегистрироваться
                </button>

                <Modal id='registerModal' title={modalInfo.title}>
                    {modalInfo.children}
                </Modal>
            </form>
        </div>
    )
}

export default Register;