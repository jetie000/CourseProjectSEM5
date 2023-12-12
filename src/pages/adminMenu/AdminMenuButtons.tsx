import React, { useEffect } from "react";
import { useActions } from "@/hooks/useActions";
import { useChangeUserAdminMutation, useDeleteUserMutation } from "@/store/api/user.api";
import { variables } from "@/variables";
import { Modal as bootstrapModal } from 'bootstrap';
import { Toast as bootstrapToast } from 'bootstrap'
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { IUser } from "@/types/user.interface";
import { IInputUserRef } from "./inputUserRef.interface";

interface IAdminMenuButtons {
    setModalInfo: Function
    currentUser: IUser
    setCurrentUser: Function
    inputUserRef: IInputUserRef
}

function AdminMenuButtons({ setModalInfo, currentUser, setCurrentUser, inputUserRef }: IAdminMenuButtons) {
    const { user } = useSelector((state: RootState) => state.user);
    const [changeUser, { isLoading, isSuccess, isError, error, data: dataChange }] = useChangeUserAdminMutation();
    const [deleteUser, { isLoading: deleteLoading, isSuccess: deleteSuccess, isError: deleteIsError, error: deleteError, data: deleteData }] = useDeleteUserMutation();
    const { logout, setUser, setToastChildren } = useActions();
    const navigate = useNavigate();

    useEffect(() => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
        if (deleteSuccess) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            if (deleteData === "Invalid data.") {
                setModalInfo({ title: "Ошибка", children: "Ошибка данных пользователя" })
            }
            else {
                if (user?.id === currentUser?.id) {
                    logout();
                }
                myModal.hide();
                setToastChildren("Пользователь успешно удален");
                myToast.show();
            }
        }
        if (deleteIsError) {
            setModalInfo({ title: "Ошибка", children: (deleteError as FetchBaseQueryError).data as string })
            myModal.show();
        }

    }, [deleteLoading]);

    useEffect(() => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
        if (isSuccess) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            switch (dataChange) {
                case "User with that email exists.":
                    setModalInfo({ title: "Ошибка", children: "Пользователь с такии адресом эл. почты уже существует" })
                    myModal.show(); break;
                case 'No user found.':
                    setModalInfo({ title: "Ошибка", children: "Пользователь не найден" })
                    myModal.show(); break;
                default:
                    setToastChildren("Пользователь успешно изменен");
                    myToast.show();
                    setCurrentUser(undefined);
                    if (dataChange && typeof (dataChange) !== 'string' && user?.id === dataChange.id) {
                        setUser(dataChange)
                        dataChange.role === 0 && navigate('/');
                        dataChange.access === false && logout();
                    }
                    break;
            }
        }
        if (isError) {
            setModalInfo({ title: "Ошибка", children: (deleteError as FetchBaseQueryError).data as string })
            myModal.show();
        }

    }, [isLoading]);

    const changeUserClick = () => {
        if (inputUserRef.inputEmail.current?.value === "" ||
            inputUserRef.inputName.current?.value === "" ||
            inputUserRef.inputSurname.current?.value === "" ||
            inputUserRef.roleSelect.current?.value === '') {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
            setModalInfo({ title: "Ошибка", children: "Введите данные" });
            myModal.show();
            return;
        }
        if (currentUser)
            changeUser({
                id: currentUser?.id || 0,
                email: inputUserRef.inputEmail.current?.value!,
                saltedPassword: inputUserRef.inputPassword.current?.value!,
                fullName: inputUserRef.inputSurname.current?.value.trim() + ' ' + inputUserRef.inputName.current?.value.trim(),
                role: Number(inputUserRef.roleSelect.current?.value) || 0,
                access: inputUserRef.inputAccess.current?.checked!,
                accessToken: currentUser.accessToken,
                joinDate: new Date(),
                loginDate: new Date()
            });

    }

    const deleteUserClick = () => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
        const children = currentUser
            ?
            <div className='d-flex flex-column gap-3'>
                <span>Вы точно хотите удалить аккаунт?</span>
                <button onClick={() =>
                    deleteUser({
                        email: currentUser?.email,
                        saltedPassword: currentUser?.saltedPassword,
                        accessToken: currentUser?.accessToken
                    })} className='btn btn-danger'>
                    Удалить аккаунт
                </button>
            </div >
            : <div>Пользователь не найден</div>;
        setModalInfo({ title: "Удаление аккаунта", children: children });
        myModal.show();
    }

    return (
        <>
            <button type="button"
                className="btn btn-primary mt-3 w-50"
                onClick={() => changeUserClick()}>
                Изменить данные
            </button>
            <button type="button"
                className="btn btn-danger mt-3 w-50"
                onClick={() => deleteUserClick()}>
                Удалить пользователя
            </button>
        </>
    );
}

export default AdminMenuButtons;