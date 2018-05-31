import { CircularProgress, Grid, Typography } from '@material-ui/core';
import * as marked from 'marked';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ArticlesStore } from '../../stores/articlesStore';
import { CommonStore } from '../../stores/commonStore';
import { UserStore } from '../../stores/userStore';
import TagChips from '../Shared/TagChips';
import ArticleDetailMeta from './ArticleDetailMeta';
import NoArticleFound from './NoArticleFound';

interface IRouteParams {
    id: string;
}

export interface IInjectedArticleDetailProps
    extends RouteComponentProps<IRouteParams> {
    commonStore: CommonStore;
    userStore: UserStore;
    articlesStore: ArticlesStore;
}

@inject('commonStore', 'userStore', 'articlesStore')
@observer
export default class ArticleDetail extends React.Component<
    IInjectedArticleDetailProps,
    any
> {
    get injectedProps() {
        return this.props as IInjectedArticleDetailProps;
    }

    public componentDidMount() {
        const slug = this.injectedProps.match.params.id;
        this.injectedProps.articlesStore.getArticleAsync(slug);
    }

    public render() {
        const slug = this.injectedProps.match.params.id;
        const { currentUser } = this.injectedProps.userStore;
        const article = this.injectedProps.articlesStore.getArticle(slug);
        const loadingDetail = this.injectedProps.articlesStore.isLoadingDetail;
        if (loadingDetail) {
            return <CircularProgress size={50} />;
        }

        if (!article) {
            return <NoArticleFound {...this.props} />;
        }

        const markup = { __html: marked(article.body, { sanitize: true }) };
        const canModify = !!(
            currentUser && currentUser.username === article.author.username
        );

        return (
            <Grid container={true} justify="center" spacing={24}>
                <Grid container={true} justify="center">
                    <Grid
                        item={true}
                        xs={8}
                        md={4}
                        style={{ marginTop: '1rem' }}
                    >
                        <ArticleDetailMeta
                            article={article}
                            canModify={canModify}
                            handleDeleteArticle={this.handleDeleteArticle}
                        />
                    </Grid>
                </Grid>
                <Grid container={true} justify="center">
                    <Grid item={true} xs={8} md={4}>
                        <Typography
                            align="center"
                            color="textSecondary"
                            component="b"
                            variant="title"
                        >
                            {article.title}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container={true} justify="center">
                    <Grid item={true} xs={8} md={4}>
                        <Typography variant="body2">
                            <div dangerouslySetInnerHTML={markup} />
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container={true} justify="center">
                    <Grid item={true} xs={8} md={4}>
                       <TagChips tags={article.tagList}/>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    private handleDeleteArticle = (slug: string) => {
        this.injectedProps.articlesStore
            .deleteArticle(slug)
            .then(() => this.props.history.replace('/'));
    };
}
