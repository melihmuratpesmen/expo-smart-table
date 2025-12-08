// Reexport the native module. On web, it will be resolved to ExpoSmartTableModule.web.ts
// and on native platforms to ExpoSmartTableModule.ts
export { default } from './ExpoSmartTableModule';
export { default as ExpoSmartTableView } from './ExpoSmartTableView';
export * from  './ExpoSmartTable.types';
