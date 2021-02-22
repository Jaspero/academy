export interface MountConfig {
    /**
     * Type of component to mount to
     */
    type: 'description' | 'editor' | 'result';

    /**
     * Element to which attach component
     * @default 'academy-{type}'
     */
    element?: string;
}
