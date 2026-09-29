# شِبس — شيفرة برمجية سريعة

موقع ثابت (HTML / CSS / JS) لشركة شِبس، جاهز للنشر على **GitHub Pages** عبر الدومين:
**https://www.shibs.doctorlog.de**

## هيكل الملفات

| الملف | الوظيفة |
|---|---|
| `index.html` + `home.css` | الصفحة الرئيسية |
| `style.css` / `script.js` | التنسيق والسكربت المشترك لكل الصفحات |
| `projects.html`, `subscribe.html`, `impressum.html`, `datenschutz.html` | الصفحات الفرعية |
| `subscriptions-data.js` | أسماء المشاريع والأسعار (تُعدَّل من هنا فقط) |
| `404.html` | صفحة "غير موجود" (يستخدمها GitHub Pages تلقائياً) |
| `CNAME` | الدومين الخاص — سطر واحد فقط بدون `https://` |
| `robots.txt`, `sitemap.xml` | لمحركات البحث |
| `site.webmanifest`, `favicon.ico`, `img/` | الأيقونات وصورة المشاركة |
| `.nojekyll` | يمنع GitHub من معالجة الملفات بـ Jekyll |

## 1) الرفع إلى GitHub

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/USERNAME/shibs-website.git
git push -u origin main
```

> ملاحظة: الملف `.nojekyll` يبدأ بنقطة وقد يكون مخفياً في مستكشف الملفات، تأكد أنه رُفع.

## 2) تفعيل GitHub Pages

1. في المستودع: **Settings → Pages**
2. **Source:** `Deploy from a branch` ← الفرع `main` ← المجلد `/ (root)` ← **Save**
3. **Custom domain:** اكتب `www.shibs.doctorlog.de` ← **Save** (سيقرأه من ملف `CNAME`)
4. بعد نجاح فحص DNS فعّل **Enforce HTTPS** (قد يستغرق إصدار الشهادة حتى ساعة)

## 3) إعداد DNS عند مزوّد الدومين doctorlog.de

| النوع | الاسم (Host) | القيمة |
|---|---|---|
| `CNAME` | `www.shibs` | `USERNAME.github.io` |

- استبدل `USERNAME` باسم حسابك على GitHub (بدون اسم المستودع).
- **يُنصح بشدة** بتوثيق الدومين في GitHub لمنع استيلاء أحد آخر عليه:
  **GitHub → Settings (الحساب) → Pages → Add a domain** ← أضف `doctorlog.de`، وسيعطيك سجل `TXT` تضيفه في DNS.

## 4) Google Search Console

1. افتح https://search.google.com/search-console ← **Add property**
2. اختر أحد الخيارين:
   - **Domain** ← `doctorlog.de`: يتحقق عبر سجل `TXT` في DNS، ويغطي كل النطاقات الفرعية (ومنها موقع DoctorLog).
   - **URL prefix** ← `https://www.shibs.doctorlog.de/`: يغطي هذا الموقع فقط. للتحقق:
     - إما **HTML tag**: انسخ الوسم، وضعه في `index.html` مكان التعليق `Google Search Console` داخل `<head>`.
     - أو **HTML file**: نزّل ملف `googleXXXX.html` وضعه في جذر المستودع بجانب `index.html`.
     - ارفع التعديل إلى GitHub، انتظر دقيقة، ثم اضغط **Verify**.
3. بعد التحقق: **Sitemaps** ← اكتب `sitemap.xml` ← **Submit**
4. **URL Inspection** ← الصق رابط الصفحة الرئيسية ← **Request indexing**

## التحديثات لاحقاً

- عند تعديل أي صفحة حدّث تاريخ `<lastmod>` الخاص بها في `sitemap.xml`.
- عند إضافة صفحة جديدة: أضفها إلى `sitemap.xml`، وأضف لها `<link rel="canonical">` بنفس نمط الصفحات الأخرى.
