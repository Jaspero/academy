export interface StepConfig {
    /**
     * Unique Identifier
     */
    name: string;

    /**
     * Starting text to appear in editor
     */
    startWith?: string;

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
    validate?: (content: string) => boolean;

    /**
     * Language syntax for current Step
     * Otherwise uses default editor language
     */
    language?: string;

    /**
     * Metadata supplied to step
     */
    metadata?: {
        [key: string]: any;
    };
}
