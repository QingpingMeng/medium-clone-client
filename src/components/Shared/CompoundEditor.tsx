import Tab from '@material-ui/core/Tab/Tab';
import Tabs from '@material-ui/core/Tabs/Tabs';

import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import * as React from 'react';
import ReactMde, { ReactMdeTypes } from 'react-mde';
import MediumEditorView from './MediumEdtorView';

import * as marked from 'marked';
import { observer } from 'mobx-react';
import './CompoundEditor.css';
export interface IDraftEditorProps {
    signleLine?: boolean;
    placeholder?: string;
    containerStyle?: React.CSSProperties;
    onChange?: (text: string) => void;
    readonly?: boolean;
    content?: string;
    markdownBody?: string;
}

interface IDraftEditorState {
    editorMode: 'medium' | 'md';
    mdeState: ReactMdeTypes.MdeState;
}

@observer
export default class DraftEditor extends React.Component<
    IDraftEditorProps,
    IDraftEditorState
> {
    constructor(props: IDraftEditorProps) {
        super(props);

        this.state = {
            editorMode: 'medium',
            mdeState: {
                markdown: this.props.markdownBody
            }
        };
    }

    public componentWillReceiveProps(newProps: IDraftEditorProps) {
        this.setState({
            mdeState: Object.assign({}, this.state.mdeState, {
                markdown: newProps.markdownBody
            })
        });
    }

    public render() {
        return (
            <div>
                <Tabs
                    style={{ marginBottom: '2rem' }}
                    value={this.state.editorMode}
                    onChange={this.handleEditViewModeChange}
                >
                    <Tab value="medium" label="Normal view" />
                    <Tab value="md" label="Markdown view" />
                </Tabs>

                {this.state.editorMode === 'medium' && <MediumEditorView onChange={this.props.onChange}/>}

                {this.state.editorMode === 'md' && (
                    <div className="md-editor">
                        <ReactMde
                            commands={[]}
                            onChange={this.onMarkdownChanged}
                            editorState={this.state.mdeState}
                            layout="noPreview"
                        />
                    </div>
                )}
            </div>
        );
    }

    private handleEditViewModeChange = (event: any, value: any) => {
        this.setState({
            editorMode: value
        });
    };

    private onMarkdownChanged = (value: ReactMdeTypes.MdeState) => {
        this.setState({ mdeState: value });
        if (this.props.onChange && value.markdown) {
            this.props.onChange(marked(value.markdown));
        }
    };
}
