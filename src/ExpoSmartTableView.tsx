import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoSmartTableViewProps } from './ExpoSmartTable.types';

const NativeView: React.ComponentType<ExpoSmartTableViewProps> =
  requireNativeView('ExpoSmartTable');

export default function ExpoSmartTableView(props: ExpoSmartTableViewProps) {
  return <NativeView {...props} />;
}
