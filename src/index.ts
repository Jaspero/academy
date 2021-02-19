export interface StepOptions {
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
}

export class Step {

    constructor(options: StepOptions) {
        console.log('Initialized step');

        this.name = options.name;
        this.start = options.start || '';
        this.description = options.description || '';
        this.solution = options.solution || '';
    }

    name: string;
    start: string;
    description: string;
    solution: string;
}

export class Academy {

    constructor() {
        this._steps = [];
        this._currentStep = null;
    }

    private _steps: Step[];

    private _currentStep: string | null;

    get currentStep() {
        return this._currentStep;
    }

    addStep(options: StepOptions) {
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
        this._currentStep = name;
    }

    private stepExists(name: string) {
        return this._steps.some(item => item.name === name);
    }
}

export default Academy;
