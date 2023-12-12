import React, { useEffect, useRef, useState } from "react";
import Modal from "@/pages/modal/Modal";
import { IModalInfo } from "@/types/modalInfo.interface";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Toast as bootstrapToast } from 'bootstrap'
import { useNavigate } from "react-router-dom";
import { ICategory } from "@/types/category.interface";
import { useAddCategoryMutation, useChangeCategoryMutation, useDeleteCategoryMutation, useGetAllCategoriesQuery } from "@/store/api/category.api";
import { useActions } from "@/hooks/useActions";
import './Categories.scss'

function Categories() {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.user);
    if (!user) {
        navigate('/login');
    }

    const [currentCategory, setCurrentCategory] = useState<ICategory>();
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const { data, isLoading } = useGetAllCategoriesQuery(null);
    const { setToastChildren } = useActions();

    const inputID = useRef<HTMLInputElement>(null);
    const inputCategory = useRef<HTMLInputElement>(null);
    const inputNewCategory = useRef<HTMLInputElement>(null);

    const [addCategory, { isLoading: isLoadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, data: dataAdd }] = useAddCategoryMutation();
    const [changeCategory, { isLoading: isLoadingChange, isSuccess: isSuccessChange, isError: isErrorChange, data: dataChange }] = useChangeCategoryMutation();
    const [deleteCategory, { isLoading: deleteLoading, isSuccess: deleteSuccess, isError: deleteIsError, data: deleteData }] = useDeleteCategoryMutation();

    useEffect(() => {
        if (inputCategory.current && inputID.current) {
            inputCategory.current.value = currentCategory?.category || '';
            inputID.current.value = currentCategory?.id?.toString() || '';
        }
    }, [currentCategory])

    useEffect(() => {
        const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
        if (deleteSuccess) {
            if (deleteData === "No category found.") {
                setToastChildren("Категория не найдена");
            }
            else
                setToastChildren("Категория успешно удалена");
            myToast.show();
        }
        if (deleteIsError) {
            setToastChildren("Ошибка удаления категории");
            myToast.show();
        }
    }, [deleteLoading]);

    useEffect(() => {
        const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
        if (isSuccessChange) {
            if (dataChange === "No category found.") {
                setToastChildren("Категория не найдена");
            }
            else
                setToastChildren("Категория успешно изменена");
            myToast.show();
        }
        if (isErrorChange) {
            setToastChildren("Ошибка изменения категории");
            myToast.show();
        }

    }, [isLoadingChange]);

    useEffect(() => {
        const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
        if (isSuccessAdd) {
            setToastChildren("Категория успешно добавления");
            myToast.show();
        }
        if (isErrorAdd) {
            setToastChildren("Ошибка добавления категории");
            myToast.show();
        }

    }, [isLoadingAdd]);

    const changeCategoryClick = () => {
        if (inputCategory.current?.value.trim() === "") {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
            setToastChildren("Введите данные")
            myToast.show();
            return;
        }
        if (currentCategory)
            changeCategory({
                id: currentCategory?.id || 0,
                category: inputCategory.current!.value.trim()
            });
    }
    const addCategoryClick = () => {
        if (inputNewCategory.current?.value.trim() === "") {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
            setToastChildren("Введите данные")
            myToast.show();
            return;
        }
        addCategory({
            category: inputNewCategory.current!.value.trim()
        });
    }
    return (
        <div className="d-flex p-3 flex-fill">
            <div className="d-flex flex-column main-wrapper ms-auto me-auto">
                <h2 className='text-center p-2'>
                    Категории
                </h2>
                <h4 className='text-center p-2'>
                    Выбранная категория
                </h4>
                <div className="d-flex categories-inputs gap-3 border rounded-4 p-3 justify-content-center">
                    <div>
                        <label htmlFor="inputId">ID</label>
                        <input type='email' className="form-control" id="inputId" ref={inputID} disabled />
                    </div>
                    <div>
                        <label htmlFor="inputCategory">Категория</label>
                        <input className="form-control" id="inputCategory" ref={inputCategory} placeholder="Введите категорию" />
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <button type="button"
                        className="btn btn-primary mt-3 w-50"
                        onClick={() => changeCategoryClick()}>
                        Изменить категорию
                    </button>
                    <button type="button"
                        className="btn btn-primary mt-3 w-50"
                        onClick={() => deleteCategory(currentCategory?.id || 0)}>
                        Удалить категорию
                    </button>
                </div>
                <h4 className='text-center p-2 mt-4'>
                    Категории
                </h4>
                {
                    isLoading ?
                        <div className="d-flex p-3">
                            <div className="spinner-border m-auto" role="status">
                                <span className="visually-hidden">Загрузка</span>
                            </div>
                        </div> :
                        <ul className="list-group rounded-4 mt-2 overflow-y-auto categories-list">
                            {
                                data && typeof (data) !== 'string' &&
                                data.map(category =>
                                    <li key={category.id} onClick={() => setCurrentCategory(category)} className="list-group-item cursor-pointer">
                                        <div className="d-flex flex-column fs-5">
                                            <span className="text-truncate">{category.category}</span>
                                        </div>
                                    </li>
                                )
                            }
                            <li className="list-group-item d-flex gap-2 ps-2 pe-2">
                                <input className="form-control" id="inputNewCategory" ref={inputNewCategory} placeholder="Введите новую категорию" />
                                <button onClick={() => addCategoryClick()} className="btn btn-primary flex-shrink-0">Добавить категорию</button>
                            </li>
                        </ul>
                }
                <Modal id='myInfoModal' title={modalInfo.title}>
                    {modalInfo.children}
                </Modal>
            </div>
        </div>
    );
}

export default Categories;