import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getLogger } from 'log4js';
import { IArticle } from './models/Article.model';
import IComment from './models/Comment.model';
import IUser from './models/User.model';
import commonStore from './stores/commonStore';

const logger = getLogger();

const API_ROOT =
    window.location.search.indexOf('debug') > -1
        ? 'http://localhost:3000/api'
        : 'https://abkos6c4j2.execute-api.us-east-1.amazonaws.com/dev/api';

const responseBody = (res: AxiosResponse) => res.data;
const encode = encodeURIComponent;

const handleUnauthorized = (error: AxiosError) => {
    if (error && error.response && error.response.status === 401) {
        // logout
    }
    return error;
};

axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // Append token
        if (commonStore.token) {
            config.headers.authorization = `Token ${commonStore.token}`;
        }
        return config;
    },
    (error: any) => {
        logger.error('Request error', error);
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            if (error.response.status === 401) {
                // logout
            }
            return Promise.reject(error.response);
        } else if (error.request) {
            logger.error(
                'The request was made but no response was received',
                error.request
            );
        } else {
            logger.error(
                'Something happened in setting up the request that triggered an Error'
            );
        }

        return Promise.reject(error);
    }
);

const requests = {
    del: (url: string) =>
        axios
            .delete(`${API_ROOT}${url}`)
            .then(responseBody)
            .catch(handleUnauthorized),
    get: (url: string) =>
        axios
            .get(`${API_ROOT}${url}`)
            .then(responseBody)
            .catch(handleUnauthorized),
    post: (url: string, data?: any) =>
        axios
            .post(`${API_ROOT}${url}`, data)
            .then(responseBody)
            .catch(handleUnauthorized),
    put: (url: string, data?: any) =>
        axios
            .put(`${API_ROOT}${url}`, data)
            .then(responseBody)
            .catch(handleUnauthorized)
};

interface IUserResponse {
    user: IUser;
}

const Auth = {
    current: () => requests.get('/user') as Promise<IUserResponse>,
    login: (email: string, password: string) =>
        requests.post('/users/login', { user: { email, password } }) as Promise<IUserResponse>,
    register: (username: string, email: string, password: string) =>
        requests.post('/users', { user: { username, email, password } }) as Promise<IUserResponse>,
    save: (user: IUser) => requests.put('/user', { user }) as Promise<IUserResponse>
};

const Tags = {
    getAll: () => requests.get('/tags') as Promise<{tags: string[]}>
};

const limit = (count: number, p: number) =>
    `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = (article: IArticle) =>
    Object.assign({}, article, { slug: undefined });

interface ISingleArticleResponse{
    article: IArticle;
}

interface IMultipleArticlesResponse{
    articles: IArticle[];
}
const Articles = {
    all: (page: number, lim = 10) =>
        requests.get(`/articles?${limit(lim, page)}`) as Promise<IMultipleArticlesResponse>,
    byAuthor: (author: string, page: number, lim = 10) =>
        requests.get(`/articles?author=${encode(author)}&${limit(lim, page)}`) as Promise<IMultipleArticlesResponse>, 
    byTag: (tag: string, page: number, lim = 10) =>
        requests.get(`/articles?tag=${encode(tag)}&${limit(lim, page)}`) as Promise<IMultipleArticlesResponse>,
    create: (article: IArticle) => requests.post('/articles', { article }) as Promise<ISingleArticleResponse>,
    del: (slug: string) => requests.del(`/articles/${slug}`),
    favorite: (slug: string) => requests.post(`/articles/${slug}/favorite`) as Promise<ISingleArticleResponse>,
    favoritedBy: (author: string, page: number, lim = 10) =>
        requests.get(
            `/articles?favorited=${encode(author)}&${limit(lim, page)}`
        ) as Promise<IMultipleArticlesResponse>,
    feed: () => requests.get('/articles/feed?limit=10&offset=0') as Promise<IMultipleArticlesResponse>,
    get: (slug: string) => requests.get(`/articles/${slug}`) as Promise<ISingleArticleResponse>,
    unfavorite: (slug: string) => requests.del(`/articles/${slug}/favorite`) as Promise<ISingleArticleResponse>,
    update: (article: IArticle) =>
        requests.put(`/articles/${article.slug}`, {
            article: omitSlug(article)
        }) as Promise<ISingleArticleResponse>
};

interface ISingleCommentResponse {
    comment: IComment;
}

interface IMultipleCommentsResponse {
    comments: IComment[];
}

const Comments = {
    create: (slug: string, comment: string) =>
        requests.post(`/articles/${slug}/comments`, { comment }) as Promise<ISingleCommentResponse>,
    delete: (slug: string, commentId: string) =>
        requests.del(`/articles/${slug}/comments/${commentId}`) as Promise<ISingleCommentResponse>,
    forArticle: (slug: string) => requests.get(`/articles/${slug}/comments`) as Promise<IMultipleCommentsResponse>
};

interface IProfile{
    username: string;
    bio: string;
    image: string;
    following: boolean;
}

interface IProfileResponse{
    profile: IProfile;
}
const Profile = {
    follow: (username: string) => requests.post(`/profiles/${username}/follow`) as Promise<IProfileResponse>,
    get: (username: string) => requests.get(`/profiles/${username}`) as Promise<IProfileResponse>,
    unfollow: (username: string) => requests.del(`/profiles/${username}/follow`) as Promise<IProfileResponse>
};

export default {
    Articles,
    Auth,
    Comments,
    Profile,
    Tags
};
