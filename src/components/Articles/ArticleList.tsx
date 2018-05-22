import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import * as React from 'react';
import { IArticle } from '../../models/Article.model';
import ArticlePreview from './ArticlePreview';

interface IArticleListProps {
    loading: boolean;
    articles: IArticle[];
    totalPagesCount: number;
    currentPage: number;
    onSetPage: (page: number) => void;
}

const ArticleList: React.SFC<IArticleListProps> = ({
    loading,
    articles,
    totalPagesCount,
    currentPage,
    onSetPage
}) => {
    if (loading && articles.length === 0) {
        return <CircularProgress size={50} />;
    }

    if (articles.length === 0) {
        return (
            <div className="article-preview">No articles are here... yet.</div>
        );
    }

    return (
        <div>
            {
                articles.map(article => <ArticlePreview article={article} key={article.slug} />)
            }
        </div>
    )
};

export default ArticleList;
