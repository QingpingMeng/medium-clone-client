import Button from '@material-ui/core/Button/Button';
import Typography from '@material-ui/core/Typography/Typography';
import ErrorIcon from '@material-ui/icons/Error';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import CenterPage from '../Shared/CenterPaper';

const NoArticleFound: React.SFC<RouteComponentProps<{}>> = props => {
    const goBack = () => {
        props.history.goBack();
    };

    return (
        <div>
            <CenterPage>
                <Typography
                    paragraph={true}
                    align="center"
                    color="error"
                    variant="display1"
                >
                    <ErrorIcon style={{ fontSize: 30 }} /> No article found.
                </Typography>

                <Button color="secondary" onClick={goBack}>
                    Go back
                </Button>
            </CenterPage>
        </div>
    );
};

export default NoArticleFound;
