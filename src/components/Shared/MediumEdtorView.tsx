import { EditorState } from 'draft-js';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Editor } from '../../../node_modules/medium-draft';
import { EditorStore } from '../../stores/editorStore';

import 'medium-draft/lib/basic.css';
import 'medium-draft/lib/index.css';


export interface IInjectedMediumEdtorProps {
    editorStore: EditorStore;
}

@inject('editorStore')
@observer
export default class MediumEdtorView extends React.Component<
    {},
    {}
> {
    get injectedProps() {
        return this.props as IInjectedMediumEdtorProps;
    }

    public render() {
        const { editorState } = this.injectedProps.editorStore;
        return (
            <Editor
                editorState={editorState}
                onChange={this.onEditorChange}
            />
        );
    }

    private onEditorChange = (editorState: EditorState) => {
        this.injectedProps.editorStore.setEditorState(editorState);
    }
}
