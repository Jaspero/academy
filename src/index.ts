import loader, { Monaco } from '@monaco-editor/loader';
import { EditorType } from './enums/editor-type.enum';
import { AcademyConfig } from './interfaces/academy-config.interface';
import { MountConfig } from './interfaces/mount-config.interface';
import { StepConfig } from './interfaces/step-config.interface';

class Step {
    constructor(options: StepConfig) {
        this.name = options.name;
        this.start = options.start || '';
        this.description = options.description || '';
        this.solution = options.solution || '';
        this.validate = options.validate || (() => true);
        this.index = 0;
    }

    name: string;
    start: string;
    description: string;
    solution: string;
    validate: (content: string) => boolean;
    index: number;
}

class Academy {
    constructor(options: AcademyConfig = {}) {
        this._steps = [];

        const mount = options.mount || [];
        for (const item of mount) {
            this.mount(item);
        }
    }

    private _elements: {
        description: AcademyDescriptionElement | null,
        editor: AcademyEditorElement | null,
        result: Element | null
    } = {
        description: null,
        editor: null,
        result: null
    };
    private _steps: Step[];

    static get Step() {
        return Step;
    }

    private _currentStep: Step | undefined;

    get currentStep() {
        return this._currentStep;
    }

    get valid() {
        return this.currentStep?.validate(this._elements.editor?.value || '');
    }

    mount(config: MountConfig) {
        config.element = config.element || `academy-${config.type}`;
        this._elements[config.type] = document.querySelector(config.element);

        if (!this._elements[config.type]) {
            throw new Error(`Could not find element '${config.element}'!`);
        }
    }

    addStep(options: StepConfig) {
        const step = new Step(options);

        if (this.stepExists(options.name)) {
            throw new Error(`Duplicate 'name' identifier!`);
        }

        const index = this._steps.push(step);
        this._steps[index - 1].index = index;
        return step;
    }

    getStep(name: string) {
        return this._steps.find(step => step.name === name);
    }

    startStep(name: string) {
        this._currentStep = this._steps.find(step => step.name === name);

        if (!this._currentStep) {
            throw new Error(`Could not find step '${name}'!`);
        }

        if (this._elements.description) {
            this._elements.description.innerHTML = this._currentStep?.description || '';
        }

        if (this._elements.editor) {
            this._elements.editor.reset();
        }
    }

    nextStep(name?: string) {
        if (!name) {
            let index = this._steps.findIndex(step => step.name === this._currentStep?.name) + 1;
            if (index >= this._steps.length) {
                index = this._steps.length - 1;
            }
            name = this._steps[index].name;
        }

        this.startStep(name);
    }

    private stepExists(name: string) {
        return this._steps.some(item => item.name === name);
    }
}

class AcademyDescriptionElement extends HTMLElement {
}

class AcademyEditorElement extends HTMLElement {
    constructor() {
        super();

        this.type = EditorType.Monaco;
    }

    type: EditorType;
    monaco: any;

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
                return this.monaco.getValue();
            }
            case 'textarea': {
                const textarea = this.querySelector('textarea');
                return textarea?.value || '';
            }
        }
    }

    attributeChangedCallback(attribute: string, before: string, after: EditorType) {
        console.log('attributeChangedCallback', {attribute, before, after});
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
        switch (this.type) {
            case 'custom': {
                break;
            }
            case 'monaco': {
                this.monaco?.getModel()?.setValue('');
                break;
            }
            case 'textarea': {
                const textarea = this.querySelector('textarea');
                if (textarea) {
                    textarea.value = '';
                }
                break;
            }
        }
    }

    connectedCallback() {
        console.log('connectedCallback');
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
                element.style.height = '300px';

                this.appendChild(element);

                loader.init().then((monaco: Monaco) => {
                    this.monaco = monaco.editor.create(element, {
                        automaticLayout: true,
                        language: 'javascript'
                        // language: props.language,
                        // minimap: { enabled: false },
                        // autoIndent: true
                    });

                    this.monaco.focus();
                });
                break;
            }
            case 'textarea': {
                this.innerHTML = '<textarea></textarea>';
            }
        }
    }
}

customElements.define('academy-description', AcademyDescriptionElement);
customElements.define('academy-editor', AcademyEditorElement);

export default Academy;
