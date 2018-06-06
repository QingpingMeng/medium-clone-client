import IComment from './Comment.model';
import IUser from './User.model';

export interface IArticle {
    slug: string;
    title: string;
    description: string;
    body: string;
    favCount: number;
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
        favCount: 0,
        favorited: false,
        slug: '',
        tagList: [],
        title: ''
    };
    return article;
};
