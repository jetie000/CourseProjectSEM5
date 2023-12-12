export interface IUser{
    id: number
    email: string
    saltedPassword: string
    fullName: string
    role: number
    access: boolean
    accessToken: string
    joinDate: Date
    loginDate: Date
}

export interface IUserLoginInfo{
    email: string
    saltedPassword: string
}

export interface IUserRegisterInfo{
    email: string
    saltedPassword: string
    fullName: string
}

export interface IUserChangeInfo{
    email: string
    saltedNewPassword: string
    saltedOldPassword: string
    fullName: string
    accessToken: string
    access? : boolean
    role? : number
}

export interface IUserDeleteInfo{
    email: string
    saltedPassword: string
    accessToken: string
}