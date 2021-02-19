export interface StepConfig {
    /**
     * Unique Identifier
     */
    name: string;

    /**
     * Starting text to appear in editor
     */
    start?: string;

    tests?: any;

    /**
     * Description of required task
     */
    description?: string;

    /**
     * Solution which appears when requested with `showSolution`
     */
    solution?: string;

    /**
     * Validate Function to compare result
     */
    validate?: () => boolean;
}

export class Step {

    constructor(options: StepConfig) {
        this.name = options.name;
        this.start = options.start || '';
        this.description = options.description || '';
        this.solution = options.solution || '';
        this.validate = options.validate || (() => true);
    }

    name: string;
    start: string;
    description: string;
    solution: string;
    validate: () => boolean;

    get valid() {
        return this.validate();
    }
}

export interface MountConfig {
    type: 'description' | 'editor' | 'result';
    element: string;
}

export interface AcademyConfig {
    mount?: MountConfig[];
}

export class Academy {

    constructor(options: AcademyConfig = {}) {
        this._steps = [];

        const mount = options.mount || [];
        for (const item of mount) {
            this.mount(item);
        }
    }

    private _elements: {
        description: AcademyDescriptionElement | null,
        editor: Element | null,
        result: Element | null
    } = {
        description: null,
        editor: null,
        result: null
    };
    private _steps: Step[];

    private _currentStep: Step | undefined;

    get currentStep() {
        return this._currentStep;
    }

    mount(config: MountConfig) {
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

        this._steps.push(step);
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

export default Academy;

class AcademyDescriptionElement extends HTMLElement {
    // connectedCallback() {
    //     this.innerHTML = 'Academy Description Element';
    // }

    // static get observedAttributes() {
    //     return ['content', 'data', 'data-', 'data-content'];
    // }
    //
    // attributeChangedCallback(attribute: string, before: string, after: string) {
    //     console.log('attributeChangedCallback', {attribute, before, after});
    //
    //     if (attribute === 'content') {
    //         this.innerHTML = after;
    //     }
    // }
}

customElements.define('academy-description', AcademyDescriptionElement);
