# 🚀 คู่มือการ Deploy ระบบสมัครงาน DYGS บน Vercel

## 📋 สรุประบบ

ระบบสมัครงานบริษัทโลจิสติก DYGS ที่มีฟีเจอร์:
- ✅ ฟอร์มสมัครงานที่สวยงาม
- ✅ อัปโหลดไฟล์ Resume/CV
- ✅ เชื่อมต่อ LINE OA สำหรับการแจ้งเตือน
- ✅ เก็บข้อมูลใน MongoDB
- ✅ Responsive Design
- ✅ Form Validation

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript
- **Backend**: Vercel Serverless Functions
- **Database**: MongoDB Atlas
- **File Upload**: Multer (memory storage)
- **LINE Integration**: LINE Bot SDK

## 🚀 ขั้นตอนการ Deploy

### 1. เตรียมข้อมูลที่จำเป็น

#### MongoDB Atlas
1. สร้าง account ที่ [mongodb.com](https://mongodb.com)
2. สร้าง Cluster ใหม่ (เลือก Free tier)
3. สร้าง Database User
4. รับ Connection String
5. เปิด Network Access ให้ `0.0.0.0/0`

#### LINE Bot
1. สร้าง account ที่ [developers.line.biz](https://developers.line.biz)
2. สร้าง Provider และ Channel ใหม่
3. รับ Channel Access Token และ Channel Secret
4. เพิ่ม Bot เข้าใน LINE Group
5. รับ Group ID

### 2. Deploy บน Vercel

#### วิธีที่ 1: ผ่าน Vercel Dashboard

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

#### วิธีที่ 2: ผ่าน Vercel CLI

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

### 3. อัปเดต API URL

หลังจาก deploy สำเร็จ ให้อัปเดต API URL ในไฟล์ `client/src/App.tsx`:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-actual-vercel-url.vercel.app/api' 
  : '/api';
```

แทนที่ `your-actual-vercel-url` ด้วย URL จริงที่ได้จาก Vercel

### 4. ทดสอบระบบ

1. **ทดสอบ API**
   ```bash
   curl https://your-app.vercel.app/api/positions
   ```

2. **ทดสอบฟอร์มสมัครงาน**
   - เปิดเว็บไซต์
   - กรอกข้อมูลและส่งใบสมัคร
   - ตรวจสอบ LINE Group ว่ามีข้อความแจ้งเตือนหรือไม่

## 📁 โครงสร้างไฟล์

```
dygs-job-application/
├── api/                    # Vercel Serverless Functions
│   ├── positions.js       # API สำหรับตำแหน่งงาน
│   ├── applications.js    # API สำหรับใบสมัครงาน
│   └── package.json       # Dependencies สำหรับ API
├── client/                # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                # Local development server
│   ├── index.js
│   └── package.json
├── vercel.json           # Vercel configuration
├── package.json          # Root package.json
└── README.md
```

## 🔧 การแก้ไขปัญหา

### ปัญหา: MongoDB Connection Error
- ตรวจสอบ MONGODB_URI ว่าถูกต้อง
- ตรวจสอบ Network Access ใน MongoDB Atlas
- ตรวจสอบ Database User permissions

### ปัญหา: LINE Bot ไม่ทำงาน
- ตรวจสอบ LINE_CHANNEL_ACCESS_TOKEN และ LINE_CHANNEL_SECRET
- ตรวจสอบว่า Bot อยู่ใน LINE Group หรือไม่
- ตรวจสอบ LINE_GROUP_ID ว่าถูกต้อง

### ปัญหา: Build Error
- ตรวจสอบ dependencies ใน package.json
- ตรวจสอบ TypeScript errors
- ตรวจสอบ Vercel build logs

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

**🎉 ระบบพร้อมใช้งาน!**

หลังจาก deploy สำเร็จ ระบบจะสามารถ:
- รับใบสมัครงานผ่านเว็บไซต์
- เก็บข้อมูลใน MongoDB
- ส่งการแจ้งเตือนไปยัง LINE Group
- รองรับการอัปโหลดไฟล์ Resume/CV

**Happy Deploying! 🚀** 