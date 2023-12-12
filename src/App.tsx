import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSetTheme } from "./hooks/useSetTheme";
import Toast from "./pages/toast/Toast";
import "./index.scss";
import AuthWrapper from "./pages/authorization/AuthWrapper";
import Register from "./pages/authorization/Register";
import Login from "./pages/authorization/Login";
import { store } from "./store/store";
import Header from "./pages/header/Header";
import Cabinet from "./pages/cabinet/Cabinet";
import Custom404 from "./pages/notFound/NotFound";
import AddProduct from "./pages/addProduct/AddProduct";
import Home from "./pages/home/Home";
import Product from "./pages/product/Product";
import ChangeProduct from "./pages/changeProduct/ChangeProduct";
import AddOrder from "./pages/addOrder/AddOrder";
import Orders from "./pages/orders/Orders";
import Order from "./pages/order/Order";
import ChangeOrder from "./pages/changeOrder/ChangeOrder";
import AdminMenu from "./pages/adminMenu/AdminMenu";
import Categories from "./pages/categories/Categories";

const App = () => {
    const setTheme = useSetTheme();

    useEffect(() => {
        setTheme();
    }, [])

    return (
        <Provider store={store}>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path='/login'
                        element={
                            <AuthWrapper>
                                <Login />
                            </AuthWrapper>
                        } />
                    <Route path='/register'
                        element={
                            <AuthWrapper>
                                <Register />
                            </AuthWrapper>
                        } />
                    <Route path="/cabinet" element={<Cabinet />} />
                    <Route path="/product/add" element={<AddProduct />} />
                    <Route path="/product/:id" element={<Product />} />
                    <Route path="/product/:id/change" element={<ChangeProduct />} />
                    <Route path="/order/add" element={<AddOrder />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/order/:id" element={<Order />} />
                    <Route path="/order/:id/change" element={<ChangeOrder />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/admin" element={<AdminMenu />} />
                    <Route path='*' element={<Custom404 />} />
                </Routes>
                <Toast />
            </BrowserRouter>
        </Provider>
    )
}
const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);
root.render(<App />)