import { EditorType } from '../enums/editor-type.enum';
import { MountConfig } from './mount-config.interface';

export interface AcademyConfig {
    mount?: MountConfig[];
    editor?: {
        type?: EditorType
    }
}
