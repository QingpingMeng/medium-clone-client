import Avatar from '@material-ui/core/Avatar/Avatar';
import Button from '@material-ui/core/Button/Button';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import Grid from '@material-ui/core/Grid/Grid';
import TextField from '@material-ui/core/TextField/TextField';
import * as marked from 'marked';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ArticlesStore } from '../../stores/articlesStore';
import { EditorStore } from '../../stores/editorStore';
import { ProfileStore } from '../../stores/profileStore';
import { UserStore } from '../../stores/userStore';
import CompoundEditor from '../Shared/CompoundEditor';
import TagChips from '../Shared/TagChips';

interface IRouteParams {
    slug?: string;
}

export interface IEditArticleProps extends RouteComponentProps<IRouteParams> {}

interface IInjectedEditArticleProps extends IEditArticleProps {
    articlesStore: ArticlesStore;
    userStore: UserStore;
    editorStore: EditorStore;
    profileStore: ProfileStore;
}

interface IEditArticleState {
    tagInput: string;
}

@inject('articlesStore', 'userStore', 'editorStore', 'profileStore')
@observer
export default class EditArticle extends React.Component<
    IEditArticleProps,
    IEditArticleState
> {
    get injectedProps() {
        return this.props as IInjectedEditArticleProps;
    }

    constructor(props: IEditArticleProps) {
        super(props);

        this.state = {
            tagInput: ''
        };
    }

    public componentWillMount() {
        this.injectedProps.editorStore.setArticleSlug(
            this.props.match.params.slug
        );
    }

    public componentDidMount() {
        this.injectedProps.editorStore.loadInitialData();
    }

    public componentDidUpdate(prevProps: IEditArticleProps) {
        if (this.props.match.params.slug !== prevProps.match.params.slug) {
            this.injectedProps.editorStore.setArticleSlug(
                this.props.match.params.slug
            );
            this.injectedProps.editorStore.loadInitialData();
        }
    }

    public render() {
        const { currentUser } = this.injectedProps.userStore;
        const { myProfile } = this.injectedProps.profileStore;
        if (!currentUser) {
            return undefined;
        }

        const {
            isLoading: isloadingArticle
        } = this.injectedProps.articlesStore;
        if (isloadingArticle) {
            return <CircularProgress size={20} color="secondary" />;
        }

        const {
            title,
            description,
            tagList,
            markdownBody,
            inProgress
        } = this.injectedProps.editorStore;

        return (
            <form onSubmit={this.handleSubmitForm}>
                <Grid container={true} justify="center">
                    <Grid
                        item={true}
                        xs={8}
                        md={4}
                        style={{ marginTop: '1rem' }}
                    >
                        <CardHeader
                            avatar={
                                <Avatar
                                    sizes="large"
                                    aria-label="Recipe"
                                    src={myProfile.image}
                                />
                            }
                            title={currentUser.username}
                            subheader="Draft"
                        />

                        <TextField
                            id="title"
                            label="Title"
                            required={true}
                            value={title}
                            fullWidth={true}
                            onChange={this.handleTitleChange}
                            margin="normal"
                        />
                        <TextField
                            id="description"
                            label="Description"
                            value={description}
                            fullWidth={true}
                            onChange={this.handleDescriptionChange}
                            margin="normal"
                        />
                        <CompoundEditor
                            onChange={this.handleBodyChange}
                            markdownBody={markdownBody}
                            placeholder="Start your story here..."
                        />
                        <TagChips
                            tags={tagList}
                            onDelete={this.handleDeleteTag}
                        />
                        <TextField
                            id="tag"
                            label="Tag"
                            value={this.state.tagInput}
                            fullWidth={true}
                            onChange={this.handleTagInputChange}
                            onKeyDown={this.handleAddTag}
                            margin="normal"
                        />

                        <Button
                            color="primary"
                            type="submit"
                            variant="raised"
                            disabled={inProgress}
                        >
                            {inProgress && (
                                <CircularProgress size={20} color="secondary" />
                            )}Publish
                        </Button>
                    </Grid>
                </Grid>
            </form>
        );
    }

    private handleTitleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        this.injectedProps.editorStore.setTitle(event.target.value);
    };

    private handleDescriptionChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        this.injectedProps.editorStore.setDescription(event.target.value);
    };

    private handleBodyChange = (content: string) => {
        // tslint:disable-next-line:no-console
        console.log('content:', content);
        if (!content) {
            return;
        }
        this.injectedProps.editorStore.setBody(marked(content));
    };

    private handleAddTag = (event: React.KeyboardEvent<HTMLDivElement>) => {
        switch (event.keyCode) {
            case 13: // Enter
            case 9: // Tab
            case 188: // ,
                if (event.keyCode !== 9) {
                    event.preventDefault();
                }
                const { editorStore } = this.injectedProps;
                editorStore.addTag(this.state.tagInput);
                this.setState({
                    tagInput: ''
                });
                break;
            default:
                break;
        }
    };

    private handleTagInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        this.setState({
            tagInput: event.target.value
        });
    };

    private handleDeleteTag = (tag: string, index: number) => {
        const { editorStore } = this.injectedProps;
        if (editorStore.inProgress) {
            return;
        }

        editorStore.deleteTag(tag);
    };

    private handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (this.state.tagInput) {
            const { editorStore } = this.injectedProps;
            editorStore.addTag(this.state.tagInput);
            this.setState({
                tagInput: ''
            });
        }
        this.injectedProps.editorStore
            .submit()
            .then(() => this.props.history.replace('/'));
    };
}
