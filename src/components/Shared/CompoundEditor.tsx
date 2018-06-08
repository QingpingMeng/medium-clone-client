import Tab from '@material-ui/core/Tab/Tab';
import Tabs from '@material-ui/core/Tabs/Tabs';

import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import { observer } from 'mobx-react';
import * as React from 'react';
import './CompoundEditor.css';
import MDEditor from './MDEditor';
import MediumEditorView from './MediumEdtorView';
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
}

@observer
export default class DraftEditor extends React.Component<
    IDraftEditorProps,
    IDraftEditorState
> {
    constructor(props: IDraftEditorProps) {
        super(props);

        this.state = {
            editorMode: 'medium'
        };
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

                {this.state.editorMode === 'medium' && (
                    <MediumEditorView onChange={this.props.onChange} />
                )}

                {this.state.editorMode === 'md' && (
                    <MDEditor
                        initValue={this.props.markdownBody}
                        onChange={this.props.onChange}
                    />
                )}
            </div>
        );
    }

    private handleEditViewModeChange = (event: any, value: any) => {
        this.setState({
            editorMode: value
        });
    };
}
