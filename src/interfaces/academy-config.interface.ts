import { EditorType } from './editor-type.interface';
import { MountConfig } from './mount-config.interface';

export interface AcademyConfig {
    mount?: MountConfig[];
    editor?: {
        type?: EditorType
    }
}
