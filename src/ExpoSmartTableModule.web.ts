import { registerWebModule, NativeModule } from 'expo';

import { ExpoSmartTableModuleEvents } from './ExpoSmartTable.types';

class ExpoSmartTableModule extends NativeModule<ExpoSmartTableModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoSmartTableModule, 'ExpoSmartTableModule');
