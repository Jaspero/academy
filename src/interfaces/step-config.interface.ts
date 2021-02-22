export interface StepConfig {
    /**
     * Unique Identifier
     */
    name: string;

    /**
     * Starting text to appear in editor
     */
    start?: string;

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
}
