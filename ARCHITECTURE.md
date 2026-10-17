---
last_updated: 2026-07-31T23:19:35Z
---

# Architecture Design

## System Overview
تطبيق عقار أندرويد لعرض وبيع/تأجير العقارات. يتضمن نظام مصادقة محلي، عرض العقارات مع البحث والتصفية، إضافة عقارات، خريطة تفاعلية، وتواصل مع المعلنين. يستخدم بيانات محلية (mock) مع إمكانية الربط بخلفية حقيقية لاحقاً.

## Tech Stack
- React 18 + Vite 5
- React Router DOM 6
- Tailwind CSS 3 (RTL)
- TypeScript
- Zustand (State Management + LocalStorage persistence)
- Lucide React (Icons)
- خط Cairo العربي

## Module Design
| Module | Responsibility | Key Files |
|--------|---------------|-----------|
| Auth | تسجيل الدخول والتسجيل | app/(auth)/, constants/auth-context.tsx |
| Properties | عرض وإدارة العقارات | app/(tabs)/, constants/data.ts |
| Search | البحث والتصفية | components/SearchFilter.tsx |
| Map | خريطة العقارات | app/(tabs)/map.tsx |
| Profile | الملف الشخصي | app/(tabs)/profile.tsx |

## Tech Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| State Management | React Context | بسيط وكافي لحجم التطبيق |
| Navigation | Expo Router Tabs | تجربة مستخدم أصلية مع تنقل سفلي |
| Styling | NativeWind | سرعة التطوير مع Tailwind |
| Data | Mock Data محلي | القالب لا يدعم backend مباشرة |
| Maps | react-native-maps | المكتبة الأكثر استخداماً للخرائط |

## File Tree Plan
```
app/
  _layout.tsx          - Root layout مع AuthProvider
  (auth)/
    login.tsx          - صفحة تسجيل الدخول
    register.tsx       - صفحة التسجيل
  (tabs)/
    _layout.tsx        - Tab navigation layout
    index.tsx          - الصفحة الرئيسية (قائمة العقارات)
    map.tsx            - خريطة العقارات
    add.tsx            - إضافة عقار جديد
    profile.tsx        - الملف الشخصي
  property/[id].tsx    - تفاصيل العقار
components/
  PropertyCard.tsx     - بطاقة العقار
  SearchFilter.tsx     - مكون البحث والتصفية
constants/
  data.ts             - البيانات المحلية
  auth-context.tsx    - سياق المصادقة
  properties-context.tsx - سياق العقارات
```

## Implementation Guide
1. إنشاء contexts للمصادقة والعقارات
2. إنشاء البيانات المحلية
3. بناء صفحات المصادقة
4. بناء التنقل بالتبويبات
5. بناء الصفحة الرئيسية مع البحث
6. بناء صفحة التفاصيل
7. بناء صفحة إضافة عقار
8. بناء صفحة الخريطة
9. بناء الملف الشخصي

