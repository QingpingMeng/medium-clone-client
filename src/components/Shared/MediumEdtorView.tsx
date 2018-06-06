import * as MediumEditor from 'medium-editor';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { EditorStore } from '../../stores/editorStore';

export interface IMediumEdtorProps {
    onChange?: (text: string) => void;
    readonly?: boolean;
    placeholder?: string;
    content?: string;
}

export interface IInjectedMediumEdtorProps {
    editorStore: EditorStore;
}

@inject('editorStore')
@observer
export default class MediumEdtorView extends React.Component<
    IMediumEdtorProps,
    any
> {
    private mediumEditorElement: HTMLDivElement | undefined;
    private editor: MediumEditor.MediumEditor;

    get injectedProps() {
        return this.props as IInjectedMediumEdtorProps;
    }

    public componentDidMount() {
        if (this.mediumEditorElement) {
            const options: MediumEditor.CoreOptions = {
                disableEditing: this.props.readonly,
                paste: {
                    cleanPastedHTML: true,
                    forcePlainText: false
                },
                placeholder: {
                    hideOnClick: false,
                    text: this.props.placeholder
                },
                toolbar: !this.props.readonly
            };
            this.editor = new MediumEditor(this.mediumEditorElement, options);
            this.mediumEditorElement.style.outline = 'none';
            this.mediumEditorElement.style.margin = '0 0 20px 0';
            this.mediumEditorElement.style.padding = '0 0 20px 0';
            if (this.props.content) {
                this.editor.setContent(this.props.content);
            } else {
                this.editor.setContent(this.injectedProps.editorStore.body);
            }

            this.editor.subscribe('editableInput', (event, editableInput) => {
                if (this.props.onChange) {
                    this.props.onChange(editableInput.innerHTML);
                }
            });
        }
    }

    public render() {
        return <div className="editableElement" ref={this.initMediumEditor} />;
    }

    private initMediumEditor = (r: HTMLDivElement) => {
        this.mediumEditorElement = r;
    };
}
