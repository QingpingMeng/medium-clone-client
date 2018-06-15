import { Grid } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar/Avatar';
import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Typography from '@material-ui/core/Typography/Typography';
import FavoritetIcon from '@material-ui/icons/Favorite';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { IArticle } from '../../models/Article.model';
import { ArticlesStore } from '../../stores/articlesStore';
import TagChips from '../Shared/TagChips';

export interface IArticlePreviewProps extends RouteComponentProps<{}> {
    article: IArticle;
}

export interface IArticlePreviewInjectedProps extends IArticlePreviewProps {
    articlesStore: ArticlesStore;
}

@inject('articlesStore')
@observer
class ArticlePreview extends React.Component<IArticlePreviewProps, any> {
    get injectedProps() {
        return this.props as IArticlePreviewInjectedProps;
    }

    public render() {
        const { article } = this.props;
        const isFavorite = article.favorited;
        return (
            <Card raised={true} style={{ margin: '1rem 0' }}>
                <CardHeader
                    avatar={
                        article.author && article.author.image ? (
                            <Avatar
                                aria-label="user"
                                src={article.author.image}
                            />
                        ) : (
                            <Avatar aria-label="user">
                                {article.author && article.author.username[0]}
                            </Avatar>
                        )
                    }
                    title={article.author && <span onClick={this.gotoProfile}>{article.author.username}</span>}
                    subheader={article.createdAt && new Date(article.createdAt).toDateString()}
                    action={
                        <IconButton style={{fontSize: "1rem"}} onClick={this.toggleFavorite}>
                            <FavoritetIcon
                                color={isFavorite ? 'secondary' : 'default'}
                            />
                            {article.favoritesCount || 0}
                        </IconButton>
                    }
                />
                <CardContent onClick={this.readMore}>
                    <Typography
                        paragraph={true}
                        className="article-preview-title"
                        variant="headline"
                    >
                        {article.title}
                    </Typography>
                    <Typography
                        paragraph={true}
                        className="article-preview-description"
                        variant="body1"
                    >
                        {article.description}
                    </Typography>
                    <Grid
                        container={true}
                        justify="space-between"
                        alignItems="center"
                    >
                        <Grid item={true} xs={4}>
                            <Typography
                                paragraph={true}
                                style={{ cursor: 'pointer' }}
                                className="article-preview-description"
                                variant="caption"
                                onClick={this.readMore}
                            >
                                Read more...
                            </Typography>
                        </Grid>
                        <Grid item={true} xs={8}>
                            <TagChips
                                onClick={this.readMore}
                                containerStyle={{
                                    display: 'flex',
                                    justifyContent: 'flex-end'
                                }}
                                tags={article.tagList}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }

    private toggleFavorite = (e: any) => {
        const { articlesStore, article } = this.injectedProps;
        if (article.favorited) {
            articlesStore.unmakeFavorite(article.slug);
        } else {
            articlesStore.makeFavorite(article.slug);
        }
    };

    private readMore = (e: any) => {
        this.props.history.push(`/articles/${this.injectedProps.article.slug}`);
    };

    private gotoProfile = _ => {
        const { article } = this.injectedProps;
        this.props.history.push(`/@${article.author && article.author.username}`)
    }
}

export default withRouter(ArticlePreview);
