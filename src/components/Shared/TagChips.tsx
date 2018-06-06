import Chip from '@material-ui/core/Chip/Chip';
import * as React from 'react';

interface ITagChipsProps {
    tags: string[];
    containerStyle?:  React.CSSProperties;
    onClick?: (tag: string) => void;
    onDelete?: (tag: string, index: number) => void;
}

const TagChips: React.SFC<ITagChipsProps> = props => {
    const onClick = (tag: string) => {
        return (e: any) => props.onClick && props.onClick(tag);
    }

    const onDelete = (tag: string, index: number) => {
        return (e: any) => props.onDelete && props.onDelete(tag, index);
    }

    return (
        <div style={props.containerStyle}>
            {props.tags.map((tag, index) => {
                return (
                    <Chip
                        style={{cursor: props.onClick?'pointer':undefined, margin: '0.2rem'}}
                        onClick={onClick(tag)}
                        key={index}
                        onDelete={props.onDelete? onDelete(tag, index) : undefined}
                        label={tag}
                    />
                );
            })}
        </div>
    );
};

export default TagChips;
