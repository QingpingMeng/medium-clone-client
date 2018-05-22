import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { inject, observer } from 'mobx-react';
import { parse as qsParse } from 'query-string';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ArticlesStore } from '../../stores/articlesStore';
import { UserStore } from '../../stores/userStore';
import ArticleList from '../Articles/ArticleList';

export interface InjectedMainViewProps extends RouteComponentProps<{}> {
    userStore: UserStore;
    articlesStore: ArticlesStore;
}

@inject('userStore', 'articlesStore')
@observer
class MainView extends React.Component<RouteComponentProps<{}>> {
    get injectedProps() {
        return this.props as InjectedMainViewProps;
    }

    public componentWillMount() {
        this.injectedProps.articlesStore.setPredicate(this.getPredicate());
    }

    public componentDidMount() {
        this.injectedProps.articlesStore.loadArticles();
    }

    public render() {
        const { currentUser } = this.injectedProps.userStore;
        const { tab } = qsParse(this.props.location.search);
        const tabIndex = tab === 'tag' ? 2 : tab === 'feed' ? 1 : 0;
        const {
            articles,
            isLoading,
            totalPagesCount,
            page
        } = this.injectedProps.articlesStore;
        return [
            <Grid key="tab" style={{marginTop: '1rem', padding:"0 1rem"}}  item={true} md={6}>
                <Tabs
                    value={tabIndex}
                    indicatorColor="primary"
                    onChange={this.handleTabChange}
                    textColor="primary"
                    fullWidth={true}
                >
                    <Tab label="Global Feed" />
                    {currentUser && <Tab label="Your Feed" />}
                    {tab === 'tag' && <Tab label={tab} />}
                </Tabs>
                <ArticleList
                    articles={articles}
                    loading={isLoading}
                    totalPagesCount={totalPagesCount}
                    currentPage={page}
                    onSetPage={this.handleSetPage}
                />
            </Grid>
        ];
    }

    private handleTabChange = (event: React.ChangeEvent<{}>, value: any) => {
        this.props.history.push({
            search: value === 1 ? '?tab=feed' : '?tab=all'
        });
    };

    private handleSetPage = (page: number) => {
      this.injectedProps.articlesStore.setPage(page);
      this.injectedProps.articlesStore.loadArticles();
    }

    private getPredicate() {
        const { tab } = qsParse(this.props.location.search);
        switch (tab) {
            case 'feed':
                return { myFeed: true };
            case 'tag':
                return { tag: qsParse(this.props.location.search).tag };
            default:
                return {};
        }
    }
}

export default withRouter(MainView);
