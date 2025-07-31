# 🚀 การ Deploy บน Vercel

คู่มือการ deploy ระบบสมัครงาน DYGS บน Vercel

## 📋 Prerequisites

1. **Vercel Account** - สมัครที่ [vercel.com](https://vercel.com)
2. **MongoDB Atlas** - สร้าง database ที่ [mongodb.com](https://mongodb.com)
3. **LINE Bot** - สร้าง LINE Bot ที่ [developers.line.biz](https://developers.line.biz)

## 🔧 การตั้งค่า

### 1. สร้าง MongoDB Atlas Database

1. ไปที่ [MongoDB Atlas](https://cloud.mongodb.com)
2. สร้าง Cluster ใหม่ (เลือก Free tier)
3. สร้าง Database User
4. รับ Connection String
5. เปิด Network Access ให้ `0.0.0.0/0` (สำหรับ Vercel)

### 2. สร้าง LINE Bot

1. ไปที่ [LINE Developers Console](https://developers.line.biz)
2. สร้าง Provider และ Channel ใหม่
3. รับ Channel Access Token และ Channel Secret
4. เพิ่ม Bot เข้าใน LINE Group
5. รับ Group ID

### 3. Deploy บน Vercel

#### วิธีที่ 1: Deploy ผ่าน Vercel Dashboard

1. **Push โค้ดไปยัง GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **เชื่อมต่อกับ Vercel**
   - ไปที่ [vercel.com](https://vercel.com)
   - คลิก "New Project"
   - เลือก GitHub repository
   - คลิก "Import"

3. **ตั้งค่า Environment Variables**
   - ไปที่ Project Settings > Environment Variables
   - เพิ่มตัวแปรต่อไปนี้:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dygs_jobs
   LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
   LINE_CHANNEL_SECRET=your_line_channel_secret
   LINE_GROUP_ID=your_line_group_id
   NODE_ENV=production
   ```

4. **Deploy**
   - คลิก "Deploy"
   - รอให้ build เสร็จ

#### วิธีที่ 2: Deploy ผ่าน Vercel CLI

1. **ติดตั้ง Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login และ Deploy**
   ```bash
   vercel login
   vercel
   ```

3. **ตั้งค่า Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add LINE_CHANNEL_ACCESS_TOKEN
   vercel env add LINE_CHANNEL_SECRET
   vercel env add LINE_GROUP_ID
   vercel env add NODE_ENV
   ```

## 🔄 การอัปเดต API URL

หลังจาก deploy สำเร็จ ให้อัปเดต API URL ในไฟล์ `client/src/App.tsx`:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-actual-vercel-url.vercel.app/api' 
  : '/api';
```

แทนที่ `your-actual-vercel-url` ด้วย URL จริงที่ได้จาก Vercel

## 📱 การทดสอบ

1. **ทดสอบ API**
   ```bash
   curl https://your-app.vercel.app/api/positions
   ```

2. **ทดสอบฟอร์มสมัครงาน**
   - เปิดเว็บไซต์
   - กรอกข้อมูลและส่งใบสมัคร
   - ตรวจสอบ LINE Group ว่ามีข้อความแจ้งเตือนหรือไม่

## 🛠️ การแก้ไขปัญหา

### ปัญหา: MongoDB Connection Error
- ตรวจสอบ MONGODB_URI ว่าถูกต้อง
- ตรวจสอบ Network Access ใน MongoDB Atlas
- ตรวจสอบ Database User permissions

### ปัญหา: LINE Bot ไม่ทำงาน
- ตรวจสอบ LINE_CHANNEL_ACCESS_TOKEN และ LINE_CHANNEL_SECRET
- ตรวจสอบว่า Bot อยู่ใน LINE Group หรือไม่
- ตรวจสอบ LINE_GROUP_ID ว่าถูกต้อง

### ปัญหา: File Upload ไม่ทำงาน
- ตรวจสอบ file size limit (5MB)
- ตรวจสอบ file type ที่อนุญาต
- ตรวจสอบ multer configuration

## 📊 การ Monitor

1. **Vercel Analytics** - ดู traffic และ performance
2. **MongoDB Atlas** - ดู database usage
3. **LINE Bot Analytics** - ดู bot usage

## 🔒 Security

- ใช้ Environment Variables สำหรับ sensitive data
- เปิด CORS เฉพาะ domain ที่จำเป็น
- ใช้ HTTPS เท่านั้น
- จำกัด file upload size และ type

## 📞 Support

หากมีปัญหาในการ deploy:
- ตรวจสอบ Vercel logs
- ตรวจสอบ MongoDB connection
- ตรวจสอบ LINE Bot configuration

---

**Happy Deploying! 🚀** 