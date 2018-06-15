export interface IUser {
    username: string;
    email: string;
    token: string;
    bio: string;
    image: string;
    password?: string;
}

export interface IProfile {
    username: string;
    bio: string;
    image: string;
    following: boolean;
}

export const emptyUser = () => {
    return {
        bio: '',
        email: '',
        image: '',
        token: '',
        username: ''
    }
}