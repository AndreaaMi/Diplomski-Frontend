export interface User{
    id: number,
    username: string,
    name: string,
    lastname: string,
    password: string,
    roles: string,
    dateOfBirth: string, 
    email: string, 
    employed: boolean,
    phoneNumber: string,
    profilePicture?: string
}
