# دليل نشر المشروع باستخدام Docker

## المتطلبات الأساسية

1. تثبيت Docker و Docker Compose على السيرفر
2. التأكد من أن المنفذ 3000 متاح

## خطوات النشر

### 1. إعداد ملف البيئة للإنتاج

قم بتعديل ملف `.env.production` وضع عنوان API الصحيح:

```bash
NEXT_PUBLIC_API_URL=http://your-api-server:3003
NODE_ENV=production
```

### 2. بناء وتشغيل المشروع

#### الطريقة الأولى: باستخدام Docker Compose (موصى به)

```bash
# بناء وتشغيل المشروع
docker-compose up -d --build

# عرض سجلات التطبيق
docker-compose logs -f

# إيقاف التطبيق
docker-compose down

# إيقاف وحذف كل شيء (بما في ذلك الصور)
docker-compose down --rmi all
```

#### الطريقة الثانية: باستخدام Docker مباشرة

```bash
# بناء الصورة
docker build -t menuadmin:latest .

# تشغيل الحاوية
docker run -d \
  --name menuadmin-app \
  -p 3000:3000 \
  --env-file .env.production \
  menuadmin:latest

# عرض السجلات
docker logs -f menuadmin-app

# إيقاف الحاوية
docker stop menuadmin-app

# حذف الحاوية
docker rm menuadmin-app
```

### 3. التحقق من التشغيل

افتح المتصفح وانتقل إلى:
```
http://your-server-ip:3000
```

أو باستخدام curl:
```bash
curl http://localhost:3000
```

## الأوامر المفيدة

### عرض الحاويات الجارية
```bash
docker ps
```

### عرض جميع الحاويات
```bash
docker ps -a
```

### الدخول إلى الحاوية
```bash
docker exec -it menuadmin-app sh
```

### عرض استخدام الموارد
```bash
docker stats menuadmin-app
```

### إعادة تشغيل الحاوية
```bash
docker-compose restart
# أو
docker restart menuadmin-app
```

### تحديث التطبيق

```bash
# إيقاف الحاوية الحالية
docker-compose down

# سحب آخر التغييرات
git pull

# إعادة البناء والتشغيل
docker-compose up -d --build
```

## استخدام Nginx كـ Reverse Proxy (اختياري)

للحصول على أداء أفضل ودعم SSL، يمكنك استخدام Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## استكشاف الأخطاء

### التطبيق لا يعمل

```bash
# عرض السجلات
docker-compose logs -f

# التحقق من حالة الحاوية
docker-compose ps
```

### مشاكل في الاتصال بـ API

- تأكد من صحة `NEXT_PUBLIC_API_URL` في `.env.production`
- تحقق من أن API server يعمل وقابل للوصول

### نفاد المساحة

```bash
# حذف الحاويات والصور غير المستخدمة
docker system prune -a

# حذف Volumes غير المستخدمة
docker volume prune
```

## الأمان

1. **لا تضع** ملفات `.env` في Git
2. استخدم أسرار قوية للبيئة الإنتاجية
3. قم بتحديث الصور بانتظام:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

## الإنتاج في بيئة سحابية

### AWS / DigitalOcean / Azure

يمكنك رفع الصورة إلى Docker Hub أو Container Registry:

```bash
# تسجيل الدخول
docker login

# وضع tag للصورة
docker tag menuadmin:latest your-username/menuadmin:latest

# رفع الصورة
docker push your-username/menuadmin:latest

# على السيرفر، سحب وتشغيل الصورة
docker pull your-username/menuadmin:latest
docker-compose up -d
```

## ملاحظات إضافية

- الصورة تستخدم `node:20-alpine` لتكون خفيفة
- التطبيق يعمل على المنفذ 3000 افتراضياً
- يتم إنشاء مستخدم `nextjs` غير root لتحسين الأمان
- الحاوية تُعيد التشغيل تلقائياً عند فشلها
