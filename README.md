# expo-smart-table

Expo Expected Smart Table

# API documentation

- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/smart-table/)
- [Documentation for the main branch](https://docs.expo.dev/versions/unversioned/sdk/smart-table/)

# Installation in managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, please follow the installation instructions in the [API documentation for the latest stable release](#api-documentation). If you follow the link and there is no documentation available then this library is not yet usable within managed projects &mdash; it is likely to be included in an upcoming Expo SDK release.

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```
npm install expo-smart-table
```

### Configure for Android

### Configure for iOS

Run `npx pod-install` after installing the npm package.

# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide](https://github.com/expo/expo#contributing).

### NEXT STEP

- [x] Theme Support (Tema Desteği):

Kullanıcının style prop'larıyla uğraşmadan tek bir ayarla Dark Mode/Light Mode geçişi yapabilmesi.

- [ ] Skeleton Loading (İskelet Yükleme):

Veri sunucudan gelirken dönen sıkıcı bir "spinner" yerine, tablonun gri gölgeli bir iskeletinin görünmesi. Modern UI hissi için şart.

- [ ] Drag & Drop Columns (Sürükle Bırak Sütunlar):

Kullanıcının parmağıyla basılı tutup sütunların yerini değiştirebilmesi. (Bu teknik olarak zordur ama kütüphaneye büyük prestij katar - Reanimated kütüphanesi ile yapılabilir).

- [ ] Data Export (Dışa Aktarma):

Tek bir prop veya metod ile tablodaki veriyi .csv, .xlsx veya .pdf olarak paylaşabilme özelliği. (İş dünyası uygulamaları için harika bir özellik).
