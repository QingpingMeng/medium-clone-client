import IComment from "./Comment.model";
import IUser from "./User.model";

export interface IArticle {
    slug: string;
    title: string;
    description: string;
    body: string;
    favCount: number;
    comments: IComment[];
    tagList: string[];
    author: IUser;
}