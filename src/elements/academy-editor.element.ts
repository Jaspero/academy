import loader, { Monaco } from '@monaco-editor/loader';
import { FORM_BUILDER_DATA } from '../consts/form-builder-data.const';
import { EditorType } from '../enums/editor-type.enum';
import { restrictEditArea } from '../utils/restrict-edit-area';

export class AcademyEditorElement extends HTMLElement {
    constructor() {
        super();

        this.type = EditorType.Monaco;
    }

    type: EditorType;
    monaco: any;
    monacoEditor: any;
    monacoOptions: {
        [key: string]: any
    } = {
        automaticLayout: true,
        minimap: {enabled: false},
        autoIndent: true
    };

    static get observedAttributes() {
        return ['editor'];
    }

    set editor(value: EditorType) {
        if (this.type === value) {
            return;
        }

        this.type = value;
        this.initEditor();
    }

    get value() {
        switch (this.type) {
            case 'custom': {
                break;
            }
            case 'monaco': {
                return this.monacoEditor?.getValue();
            }
            case 'textarea': {
                const textarea = this.querySelector('textarea');
                return textarea?.value || '';
            }
        }
    }

    setValue(value: string | undefined = '') {
        value = value || '';
        switch (this.type) {
            case 'custom': {
                break;
            }
            case 'monaco': {
                if (!this.monacoEditor) {
                    this.monacoOptions = {
                        ...this.monacoOptions,
                        value
                    };
                } else {
                    const {valueToSet, regexForValidation, map: idMap} = restrictEditArea(value);
                    const language = this.monacoOptions.language;
                    this.monacoEditor.getModel().dispose();

                    const model = this.monaco.editor.createModel(valueToSet, language);
                    this.monacoEditor.setModel(model);

                    model.onDidChangeContentFast(({isUndoing}: any) => {
                        if (!isUndoing) {
                            const doUndo = () => {
                                setTimeout(() => {
                                    model.undo();
                                });
                            }
                            const modelValue = model.getValue();
                            if (!regexForValidation.test(modelValue)) {
                                doUndo();
                            } else {
                                const [completeMatch, ...otherMatches]: any = regexForValidation.exec(modelValue);
                                if (completeMatch !== modelValue) {
                                    doUndo();
                                } else {
                                    const valueMap: any = {};
                                    for (let index in idMap) {
                                        // @ts-ignore
                                        valueMap[idMap[index]] = otherMatches[index];
                                    }
                                }
                            }
                        }
                    });

                    this.monacoEditor?.setScrollPosition({scrollTop: 0});
                }
                break;
            }
            case 'textarea': {
                const textarea = this.querySelector('textarea');
                if (textarea) {
                    textarea.value = value;
                }
                break;
            }
        }
    }

    attributeChangedCallback(attribute: string, before: string, after: EditorType) {
        if (before === after) {
            return;
        }

        if (attribute === 'editor') {
            if (this.type !== after) {
                this.type = after;
                this.initEditor();
            }
        }
    }

    reset() {
        this.setValue('');
    }

    connectedCallback() {
        this.initEditor();
    }

    initEditor() {
        this.innerHTML = '';
        switch (this.type) {
            case 'custom': {
                break;
            }
            case 'monaco': {
                const element = document.createElement('div');

                this.appendChild(element);

                loader.init().then((monaco: Monaco) => {

                    this.monaco = monaco;
                    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                        target: monaco.languages.typescript.ScriptTarget.ES2016,
                        allowNonTsExtensions: true,
                        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                        module: monaco.languages.typescript.ModuleKind.CommonJS,
                        noEmit: true
                    });

                    monaco.languages.typescript.typescriptDefaults.addExtraLib(FORM_BUILDER_DATA, 'index.d.ts');
                    this.monaco.languages.json.jsonDefaults.diagnosticsOptions.enableSchemaRequest = true;

                    this.monacoEditor = monaco.editor.create(element, this.monacoOptions);
                    this.setValue(this.monacoOptions?.value || '');
                    this.monacoEditor.focus();
                });
                break;
            }
            case 'textarea': {
                this.innerHTML = '<textarea></textarea>';
            }
        }
    }

    updateOptions(options: { [key: string]: any } = {}) {
        if (this.monacoEditor) {
            this.monacoEditor.updateOptions(options);

            if (options.language) {
                this.monaco.editor.setModelLanguage(this.monacoEditor?.getModel(), options.language);
            }
        } else {
            this.monacoOptions = {
                ...this.monacoOptions,
                ...options
            };
        }
    }
}

customElements.get('academy-editor') || customElements.define('academy-editor', AcademyEditorElement);
