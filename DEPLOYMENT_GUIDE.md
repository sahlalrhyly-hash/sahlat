# دليل نشر تطبيق عقار 🏠

## المتطلبات الأساسية

### 1. متطلبات البيئة
- **Node.js** 18+ و **pnpm**
- **Java JDK** 17+
- **Android Studio** (مع Android SDK 33+)
- **Gradle** 8+

### 2. إعداد Firebase
أنشئ ملف `.env` في مجلد المشروع:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📱 بناء تطبيق Android (APK / AAB)

### الخطوة 1: تثبيت Capacitor
```bash
cd app/frontend
pnpm add @capacitor/core @capacitor/cli @capacitor/android
```

### الخطوة 2: بناء المشروع
```bash
pnpm run build
```

### الخطوة 3: إضافة منصة Android
```bash
npx cap add android
npx cap sync
```

### الخطوة 4: فتح المشروع في Android Studio
```bash
npx cap open android
```

### الخطوة 5: بناء APK (للاختبار)
في Android Studio:
1. اذهب إلى **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. سيتم إنشاء ملف APK في:
   `android/app/build/outputs/apk/debug/app-debug.apk`

أو من سطر الأوامر:
```bash
cd android
./gradlew assembleDebug
```

### الخطوة 6: بناء AAB (للنشر على Google Play)
في Android Studio:
1. اذهب إلى **Build** → **Generate Signed Bundle / APK**
2. اختر **Android App Bundle**
3. أنشئ أو استخدم **Keystore** موجود
4. اختر **release** كـ Build Variant
5. سيتم إنشاء ملف AAB في:
   `android/app/build/outputs/bundle/release/app-release.aab`

أو من سطر الأوامر:
```bash
cd android
./gradlew bundleRelease
```

### الخطوة 7: توقيع التطبيق (Release)
```bash
# إنشاء Keystore جديد
keytool -genkey -v -keystore aqar-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias aqar

# توقيع APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore aqar-release-key.jks app-release-unsigned.apk aqar

# تحسين APK
zipalign -v 4 app-release-unsigned.apk aqar-release.apk
```

---

## 🌐 نشر كتطبيق ويب (PWA)

### الخطوة 1: بناء المشروع
```bash
pnpm run build
```

### الخطوة 2: النشر على Firebase Hosting
```bash
# تثبيت Firebase CLI
npm install -g firebase-tools

# تسجيل الدخول
firebase login

# تهيئة المشروع
firebase init hosting
# اختر "dist" كمجلد النشر
# اختر "Yes" لـ Single Page App

# النشر
firebase deploy --only hosting
```

### بدائل أخرى للنشر:
- **Vercel**: `npx vercel --prod`
- **Netlify**: رفع مجلد `dist` مباشرة
- **Cloudflare Pages**: ربط مع GitHub

---

## 🍎 حالة iOS

> ⚠️ **ملاحظة مهمة**: بناء تطبيق iOS يتطلب:
> - جهاز **macOS** مع **Xcode 15+**
> - حساب **Apple Developer** ($99/سنة)
> - شهادات توقيع وملفات Provisioning Profile

### خطوات iOS (على macOS فقط):
```bash
# إضافة منصة iOS
npx cap add ios
npx cap sync

# فتح في Xcode
npx cap open ios
```

ثم من Xcode:
1. اختر **Team** في Signing & Capabilities
2. اختر **Generic iOS Device**
3. اذهب إلى **Product** → **Archive**
4. ارفع إلى **App Store Connect**

---

## 📋 النشر على Google Play Store

### المتطلبات:
1. حساب **Google Play Console** ($25 مرة واحدة)
2. ملف **AAB** موقّع
3. لقطات شاشة (Screenshots) بأحجام مختلفة
4. أيقونة التطبيق (512x512)
5. وصف التطبيق بالعربية والإنجليزية

### الخطوات:
1. سجل دخول إلى [Google Play Console](https://play.google.com/console)
2. أنشئ تطبيق جديد
3. املأ معلومات التطبيق (الاسم، الوصف، التصنيف)
4. ارفع لقطات الشاشة والأيقونة
5. اذهب إلى **Production** → **Create new release**
6. ارفع ملف AAB
7. أضف ملاحظات الإصدار
8. أرسل للمراجعة

---

## 📋 النشر على Apple App Store

### المتطلبات:
1. حساب **Apple Developer** ($99/سنة)
2. جهاز **macOS** مع **Xcode**
3. لقطات شاشة لأحجام iPhone المختلفة
4. أيقونة التطبيق (1024x1024)

### الخطوات:
1. سجل دخول إلى [App Store Connect](https://appstoreconnect.apple.com)
2. أنشئ تطبيق جديد
3. املأ المعلومات المطلوبة
4. ارفع Build من Xcode
5. أرسل للمراجعة

---

## ⚙️ إعدادات Firebase المطلوبة

### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // المستخدمين
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    // العقارات
    match /properties/{propertyId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.ownerId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    // المحادثات
    match /conversations/{convId} {
      allow read, write: if request.auth != null && request.auth.uid in resource.data.participants;
      allow create: if request.auth != null;
    }
    // الرسائل
    match /messages/{msgId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    // الإشعارات
    match /notifications/{notifId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

### Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /properties/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🔑 ملخص سريع

| المنصة | الملف المطلوب | أين يُنشر |
|--------|--------------|-----------|
| Android (اختبار) | APK | مباشرة على الجهاز |
| Android (نشر) | AAB | Google Play Store |
| iOS | IPA | Apple App Store |
| ويب | dist/ | Firebase Hosting / Vercel / Netlify |

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تأكد من إعداد مفاتيح Firebase بشكل صحيح
2. تأكد من تفعيل Authentication و Firestore و Storage في Firebase Console
3. تأكد من إعداد Firestore Rules و Storage Rules