import { IArticle } from './Article.model';
import { IUser } from './User.model';

export default interface IComment {
    body: string;
    author: IUser;
    article: IArticle;
}
