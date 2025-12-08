import * as React from 'react';

import { ExpoSmartTableViewProps } from './ExpoSmartTable.types';

export default function ExpoSmartTableView(props: ExpoSmartTableViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
