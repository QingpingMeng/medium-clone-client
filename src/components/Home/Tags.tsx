import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import Grid from '@material-ui/core/Grid/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

import './Tags.css';

interface ITagsProps {
    tags: string[];
}

const Tags: React.SFC<ITagsProps> = props => {
    const { tags } = props;
    if (tags) {
        return (
            <Grid item={true} md={2}>
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
                        {props.tags.map((tag, index) => {
                            return (
                                <Chip
                                    key={index}
                                    label={tag}
                                    className="tag-chip"
                                />
                            );
                        })}
                    </div>
                </Paper>
            </Grid>
        );
    } else {
        return <CircularProgress size={25} />;
    }
};

export default Tags;
