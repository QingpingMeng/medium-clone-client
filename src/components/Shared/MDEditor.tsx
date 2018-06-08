import * as marked from 'marked';
import * as React from 'react';
import ReactMde, { ReactMdeTypes } from 'react-mde';

interface IMDEditorProps {
    initValue?: string | undefined;
    onChange?: (value: string) => void;
}

interface IMDEditorState {
    editorState: ReactMdeTypes.MdeState;
}

export default class MDEditor extends React.Component<
    IMDEditorProps,
    IMDEditorState
> {
    constructor(props: IMDEditorProps) {
        super(props);

        this.state = {
            editorState: {
                markdown: this.props.initValue
            }
        };
    }

    public render() {
        return (
            <div className="md-editor">
                <ReactMde
                    commands={[]}
                    onChange={this.onMarkdownChanged}
                    editorState={this.state.editorState}
                    layout="noPreview"
                />
            </div>
        );
    }

    private onMarkdownChanged = (value: ReactMdeTypes.MdeState) => {
        this.setState({
            editorState: value
        });
        if (this.props.onChange && value.markdown) {
            this.props.onChange(marked(value.markdown));
        }
    };
}
