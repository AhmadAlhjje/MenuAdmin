# استخدام Node.js كصورة أساسية
FROM node:20-alpine AS base

# تثبيت libc6-compat للتوافق
RUN apk add --no-cache libc6-compat

WORKDIR /app

# نسخ ملفات package
COPY package*.json ./

# =====================================
# مرحلة التثبيت والبناء
# =====================================
FROM base AS builder

WORKDIR /app

# نسخ ملفات package
COPY package*.json ./

# تثبيت جميع التبعيات (بما في ذلك devDependencies)
RUN npm ci

# نسخ باقي الملفات
COPY . .

# إنشاء ملف .env.production إذا لم يكن موجوداً
RUN if [ ! -f .env.production ]; then \
        echo "NODE_ENV=production" > .env.production && \
        echo "NEXT_PUBLIC_API_URL=http://localhost:3003" >> .env.production; \
    fi

# بناء المشروع
RUN npm run build

# =====================================
# مرحلة الإنتاج
# =====================================
FROM base AS runner

WORKDIR /app

# تعيين بيئة الإنتاج
ENV NODE_ENV=production

# إنشاء مستخدم غير root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# نسخ الملفات الضرورية من مرحلة البناء
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# التبديل للمستخدم nextjs
USER nextjs

# فتح المنفذ
EXPOSE 3000

# تعيين متغيرات البيئة
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# تشغيل التطبيق
CMD ["node", "server.js"]
