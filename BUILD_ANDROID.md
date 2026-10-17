# بناء تطبيق Android (APK و AAB)

## المتطلبات
- Node.js 18+
- Android Studio مع Android SDK
- Java JDK 17+

## الخطوات

### 1. تثبيت Capacitor
```bash
cd app/frontend
pnpm add @capacitor/core @capacitor/cli @capacitor/android
npx cap init "عقار" "com.aqar.app" --web-dir dist
```

### 2. بناء المشروع
```bash
pnpm run build
```

### 3. إضافة منصة Android
```bash
npx cap add android
npx cap sync
```

### 4. فتح في Android Studio
```bash
npx cap open android
```

### 5. بناء APK (Debug)
```bash
cd android
./gradlew assembleDebug
```
الملف: `android/app/build/outputs/apk/debug/app-debug.apk`

### 6. بناء AAB (Release)
```bash
cd android
./gradlew bundleRelease
```
الملف: `android/app/build/outputs/bundle/release/app-release.aab`

### 7. توقيع التطبيق للنشر
```bash
# إنشاء keystore
keytool -genkey -v -keystore aqar-release.keystore -alias aqar -keyalg RSA -keysize 2048 -validity 10000

# توقيع APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore aqar-release.keystore app-release-unsigned.apk aqar

# محاذاة
zipalign -v 4 app-release-unsigned.apk aqar-release.apk
```

## بديل: استخدام EAS Build (Expo)
إذا أردت استخدام EAS Build بدلاً من Capacitor:

```bash
# تحويل المشروع إلى Expo
npx create-expo-app aqar-expo --template blank-typescript
# نقل الكود
# ثم:
npx eas-cli build --platform android --profile production
```

## ملاحظات
- تأكد من تغيير `appId` إلى معرف فريد لتطبيقك
- للنشر على Google Play، تحتاج ملف AAB (وليس APK)
- يجب إنشاء حساب مطور على Google Play Console ($25 رسوم لمرة واحدة)