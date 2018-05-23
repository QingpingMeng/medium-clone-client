import Chip from '@material-ui/core/Chip/Chip';
import * as React from 'react';

interface ITagChipsProps {
    tags: string[];
    containerStyle?:  React.CSSProperties;
    onClick?: (tag: string) => void;
}

const TagChips: React.SFC<ITagChipsProps> = props => {
    const onClick = (tag: string) => {
        return (e: any) => props.onClick && props.onClick(tag);
    }
    return (
        <div style={props.containerStyle}>
            {props.tags.map((tag, index) => {
                return (
                    <Chip
                        style={{cursor: props.onClick?'pointer':undefined, margin: '0.2rem'}}
                        onClick={onClick(tag)}
                        key={index}
                        label={tag}
                    />
                );
            })}
        </div>
    );
};

export default TagChips;
