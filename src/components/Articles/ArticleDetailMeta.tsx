import Avatar from '@material-ui/core/Avatar/Avatar';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import IconButton from '@material-ui/core/IconButton/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { IArticle } from '../../models/Article.model';
import ConfirmDialog from '../Shared/ConfirmDialog';

interface IArticleDetailMetaProps extends RouteComponentProps<{}> {
    article: IArticle;
    canModify: boolean;
    handleDeleteArticle: (slug: string) => void;
}

interface IArticleDetailMetaState {
    isConfirmDialogOpen: boolean;
}

class ArticleDetailMeta extends React.Component<
    IArticleDetailMetaProps,
    IArticleDetailMetaState
> {
    constructor(props: IArticleDetailMetaProps) {
        super(props);
        this.state = {
            isConfirmDialogOpen: false
        };
    }

    public render() {
        const { article } = this.props;
        return (
            <div>
                <ConfirmDialog
                    title="Delete article"
                    body="This article will be permanently"
                    onCancel={this.hideConfirmDialog}
                    open={this.state.isConfirmDialogOpen}
                    onConfirm={this.onConfirmDelete}
                />
                <CardHeader
                    avatar={
                        <Avatar
                            sizes="large"
                            aria-label="Recipe"
                            src={article.author ? article.author.image : ''}
                        />
                    }
                    title={article.author && article.author.username}
                    subheader={article.createdAt && new Date(article.createdAt).toDateString()}
                    action={
                        this.props.canModify ? (
                            <div>
                                <IconButton
                                    title="Edit"
                                    aria-label="Edit article"
                                    onClick={this.handleEditArticle}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    onClick={this.showConfirmDialog}
                                    title="Delete"
                                    aria-label="Delete article"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        ) : (
                            undefined
                        )
                    }
                />
            </div>
        );
    }

    private showConfirmDialog = () => {
        this.setState({
            isConfirmDialogOpen: true
        });
    };

    private hideConfirmDialog = () => {
        this.setState({
            isConfirmDialogOpen: false
        });
    };

    private handleEditArticle = (e: any) => {
            this.props.history.push(`/editor/${this.props.article.slug}`)
    }

    private onConfirmDelete = () => {
        this.props.handleDeleteArticle(this.props.article.slug);
    };
}

export default withRouter(ArticleDetailMeta);
