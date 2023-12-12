import { IUser } from "./types/user.interface";

export const variables = {
    API_URL: 'https://localhost:7205/api',
    PHOTOS_URL: "https://localhost:7205/photos/",
    USER_LOCALSTORAGE: "user_info",
    THEME_LOCALSTORAGE: "page_theme",
    MAX_COLLECTION_PHOTO_SIZE: 5000000,
    ASPECT_COLLECTIONS_IMG: 4/3,
    BURGER_BREAKPOINT: 992,
    PRODUCTS_SEARCH_ORDER: 5,
    ORDERS_NUM_INITIAL: 20,
    USERS_NUM_INITIAL: 10,
    GET_ACCESS_TOKEN: () => (JSON.parse(localStorage.getItem("user_info")!) as IUser)?.accessToken || '',
}