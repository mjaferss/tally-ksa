# تالي السعودية - Tally KSA

موقع إلكتروني احترافي باللغة العربية لشركة "تالي السعودية" يعرض منتجات وخدمات الشركة.

## هيكل المشروع

```
tally-ksa/
├── index.html          # الصفحة الرئيسية للموقع
├── styles.css         # ملف التنسيقات
├── scripts.js         # ملف الجافاسكريبت
├── images/            # مجلد الصور
├── videos/            # مجلد الفيديوهات
└── libs/              # مجلد المكتبات الخارجية
    ├── bootstrap/     # مكتبة Bootstrap
    └── animate/       # مكتبة Animate.css
```

## استخدام المكتبات المحلية

حالياً يستخدم الموقع مكتبات Bootstrap و Animate.css من خلال CDN. لاستخدام نسخ محلية من هذه المكتبات، اتبع الخطوات التالية:

### تثبيت Bootstrap محلياً

1. قم بتنزيل أحدث إصدار من Bootstrap من [الموقع الرسمي](https://getbootstrap.com/docs/5.3/getting-started/download/)
2. استخرج الملفات وانسخ `bootstrap.min.css` و `bootstrap.bundle.min.js` إلى مجلد `libs/bootstrap/`
3. قم بإلغاء تعليق الروابط المحلية في ملف `index.html` وتعليق روابط CDN:

```html
<!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet"> -->
<link href="libs/bootstrap/bootstrap.min.css" rel="stylesheet">

<!-- في نهاية الصفحة -->
<!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script> -->
<script src="libs/bootstrap/bootstrap.bundle.min.js"></script>
```

### تثبيت Animate.css محلياً

1. قم بتنزيل أحدث إصدار من Animate.css من [GitHub](https://github.com/animate-css/animate.css/)
2. انسخ ملف `animate.min.css` إلى مجلد `libs/animate/`
3. قم بتحديث الرابط في ملف `index.html`:

```html
<!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/> -->
<link rel="stylesheet" href="libs/animate/animate.min.css"/>
```

## التعديل والتخصيص

يمكنك تعديل ملف `styles.css` لتخصيص مظهر الموقع حسب احتياجاتك دون التأثير على وظائف المكتبات الخارجية.