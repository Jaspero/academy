import { EditorType } from '../enums/editor-type.enum';
import { MountConfig } from './mount-config.interface';

export interface AcademyConfig {
    mount?: MountConfig[];
    editor?: {
        type?: EditorType,
        monaco?: {
            theme?: 'vs' | 'vs-dark' | 'hc-black',
            language?: string;
            tabSize?: number;
            [key: string]: any;
        }
    },
    notification?: (message: string, error?: boolean) => void;
}
