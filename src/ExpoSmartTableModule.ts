import { NativeModule, requireNativeModule } from 'expo';

import { ExpoSmartTableModuleEvents } from './ExpoSmartTable.types';

declare class ExpoSmartTableModule extends NativeModule<ExpoSmartTableModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoSmartTableModule>('ExpoSmartTable');
