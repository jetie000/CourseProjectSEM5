import React from "react";
import { IUser } from "@/types/user.interface";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { variables } from "@/variables";

function AdminMenuUsers({ data, setCurrentUser }: { data: IUser[] | undefined, setCurrentUser: Function }) {

    return (
        <ul className="list-group rounded-4 mt-2 admin-menu-users overflow-y-auto">
            {
                data &&
                data.map(user =>
                    <li key={user.id} onClick={() => setCurrentUser(user)} className="list-group-item cursor-pointer">
                        <div className="d-flex flex-column fs-5">
                            <div className="d-flex flex-fill align-items-start gap-3">
                                <span className="w-50 text-truncate">{user.email}</span>
                                <div className="vr"></div>
                                <span className="w-50 text-truncate">{"Доступ" + ': '}{user.access ? "Да" : "Нет"}</span>
                            </div>
                            <div className="d-flex flex-fill align-items-start gap-3">
                                <span className="w-50 text-truncate">{user.fullName}</span>
                                <div className="vr"></div>
                                <span className="w-50 text-truncate">{'Роль: '}{user.role === 1 ? "Администратор" : "Пользователь"}</span>
                            </div>
                        </div>
                    </li>
                )
            }
        </ul>
    );
}

export default AdminMenuUsers;