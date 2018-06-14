export interface IUser {
    username: string;
    email: string;
    token: string;
    bio: string;
    image: string;
}

export interface IProfile {
    username: string;
    bio: string;
    image: string;
    following: boolean;
}