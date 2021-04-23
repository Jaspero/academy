import './elements/academy-description.element';
import { AcademyDescriptionElement } from './elements/academy-description.element';
import './elements/academy-editor.element';
import { AcademyEditorElement } from './elements/academy-editor.element';
import './elements/academy-result.element';
import { AcademyResultElement } from './elements/academy-result.element';
import { AcademyConfig } from './interfaces/academy-config.interface';
import { MountConfig } from './interfaces/mount-config.interface';
import { StepConfig } from './interfaces/step-config.interface';

class Step {
    constructor(options: StepConfig) {
        this.name = options.name;
        this.startWith = options.startWith || '';
        this.description = options.description || '';
        this.solution = options.solution || '';
        this.validate = options.validate || null;
        this.language = options.language;
        this.metadata = options.metadata || {};
        this.index = 0;
    }

    name: string;
    startWith: string;
    description: string;
    solution: string;
    validate: ((content: string) => boolean) | null;
    language: string | undefined;
    metadata: {
        [key: string]: any;
    };
    index: number;
}

class Academy {
    constructor(options: AcademyConfig = {}) {
        this._options = options;
        this._steps = [];

        const mount = options.mount || [];
        for (const item of mount) {
            this.mount(item);
        }

        const editor = options.editor || {};
        if (editor.monaco) {
            this._elements.editor?.updateOptions(editor.monaco);
        }

        this.notify = options.notification || ((message, error) => alert(message));
    }

    notify: (message: string, error?: boolean) => void;
    private _elements: {
        description: AcademyDescriptionElement | null,
        editor: AcademyEditorElement | null,
        result: AcademyResultElement | null
    } = {
        description: null,
        editor: null,
        result: null
    };
    private _steps: Step[];
    private _options: AcademyConfig;

    static get Step() {
        return Step;
    }

    private _currentStep: Step | undefined;

    get steps() {
        return this._steps;
    }

    get currentStep() {
        return this._currentStep;
    }

    get valid() {
        return this.currentStep?.validate === null ? true : this.currentStep?.validate(this._elements.editor?.value || '');
    }

    get editor() {
        return this._elements.editor;
    }

    clearSteps() {
        console.log(this);
        this._steps = [];
        this._currentStep = undefined;
        this._elements.editor?.reset();
        if (this._elements.description) {
            this._elements.description.innerHTML = '';
        }
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

        const index = this._steps.push(step) - 1;
        this._steps[index].index = index;
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
            this._elements.editor.setValue(this.currentStep?.startWith);
        }

        if (this.currentStep?.language) {
            this._elements.editor?.updateOptions({
                language: this.currentStep.language
            });
        } else {
            this._elements.editor?.updateOptions({
                language: this._options.editor?.monaco?.language
            });
        }
    }

    /**
     * Start step
     * @param step {string | number} - identifier of step (name or index)
     */
    nextStep(step?: string | number) {
        let name = '';

        if (!step) {
            const index = Math.min(this._steps.findIndex(step => step.name === this._currentStep?.name) + 1, this._steps.length - 1);
            name = this._steps[index].name;
        } else {
            switch (step.constructor) {
                case String: {
                    name = step as string;
                    break;
                }
                case Number: {
                    name = this._steps[step as number].name;
                    break;
                }
            }
        }

        this.startStep(name);
    }

    /**
     * Start Previous step
     */
    previousStep() {
        const index = Math.max(this._steps.findIndex(step => step.name === this.currentStep?.name) - 1, 0);
        const name = this._steps[index].name;

        this.startStep(name);
    }

    private stepExists(name: string) {
        return this._steps.some(item => item.name === name);
    }
}

export default Academy;
