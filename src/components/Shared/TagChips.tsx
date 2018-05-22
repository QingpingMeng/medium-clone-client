import Chip from '@material-ui/core/Chip/Chip';
import * as React from 'react';

interface ITagChipsProps {
    tags: string[];
    containerStyle?:  React.CSSProperties;
    onClick?: (event: any) => void;
}

const TagChips: React.SFC<ITagChipsProps> = props => {
    return (
        <div style={props.containerStyle}>
            {props.tags.map((tag, index) => {
                return (
                    <Chip
                        onClick={props.onClick}
                        key={index}
                        label={tag}
                        style={{ margin: '0.2rem' }}
                    />
                );
            })}
        </div>
    );
};

export default TagChips;
