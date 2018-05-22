import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import Grid from '@material-ui/core/Grid/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

import TagChips from '../Shared/TagChips';
import './Sidebar.css';

interface ITagsProps {
    tags: string[];
}

const Tags: React.SFC<ITagsProps> = props => {
    const { tags } = props;
    if (tags) {
        return (
            <Grid item={true} style={{marginTop: '1rem', padding: "0 1rem"}}  md={2}>
                <Paper>
                    <Typography
                        gutterBottom={true}
                        color="inherit"
                        variant="subheading"
                        component="h1"
                        align="center"
                    >
                        Popular tags
                    </Typography>
                    <div className="tag-container">
                       <TagChips tags={tags}/>
                    </div>
                </Paper>
            </Grid>
        );
    } else {
        return <CircularProgress size={25} />;
    }
};

export default Tags;
