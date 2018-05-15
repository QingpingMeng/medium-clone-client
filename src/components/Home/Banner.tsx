import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import './Banner.css';

interface IBannerProps {
    appName: string;
    token?: string;
}

const Banner: React.SFC<IBannerProps> = ({ appName, token }) => {
    return (
        <div className="banner">
            <div className="container">
                <Typography
                    variant="display4"
                    color="inherit"
                    gutterBottom={true}
                    align="center"
                >
                    {appName.toLowerCase()}
                </Typography>
                <Typography
                    gutterBottom={true}
                    color="inherit"
                    variant="display1"
                    align="center"
                >
                    A place to share your knowledge.
                </Typography>
            </div>
        </div>
    );
};

export default Banner;
