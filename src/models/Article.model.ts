import IComment from './Comment.model';
import {IUser} from './User.model';

export interface IArticle {
    slug: string;
    title: string;
    description: string;
    body: string;
    favoritesCount: number;
    comments: IComment[];
    tagList: string[];
    author?: IUser;
    createdAt?: string;
    favorited: boolean;
}

export const emptyArticle = () => {
    const article: IArticle = {
        author: undefined,
        body: '',
        comments: [],
        description: '',
        favorited: false,
        favoritesCount: 0,
        slug: '',
        tagList: [],
        title: ''
    };
    return article;
};
