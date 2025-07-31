# ⚡ Quick Start - Deploy DYGS Job Application บน Vercel

## 🎯 สิ่งที่คุณจะได้

ระบบสมัครงานบริษัทโลจิสติก DYGS ที่:
- 📱 Responsive Design
- 📋 ฟอร์มสมัครงานที่สวยงาม
- 📎 อัปโหลดไฟล์ Resume/CV
- 🔗 เชื่อมต่อ LINE OA
- 💾 เก็บข้อมูลใน MongoDB

## 🚀 Deploy ใน 5 ขั้นตอน

### 1. เตรียมข้อมูล
- **MongoDB Atlas**: สร้าง database และรับ connection string
- **LINE Bot**: สร้าง bot และรับ token, secret, group ID

### 2. Push โค้ดไป GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 3. Deploy บน Vercel
- ไปที่ [vercel.com](https://vercel.com)
- คลิก "New Project"
- เลือก GitHub repository
- คลิก "Import"

### 4. ตั้งค่า Environment Variables
ใน Vercel Dashboard > Settings > Environment Variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dygs_jobs
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
LINE_CHANNEL_SECRET=your_line_channel_secret
LINE_GROUP_ID=your_line_group_id
NODE_ENV=production
```

### 5. อัปเดต API URL
แก้ไขไฟล์ `client/src/App.tsx`:
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-actual-vercel-url.vercel.app/api' 
  : '/api';
```

## ✅ ทดสอบระบบ

1. เปิดเว็บไซต์ที่ได้จาก Vercel
2. กรอกข้อมูลในฟอร์มสมัครงาน
3. อัปโหลดไฟล์ Resume (ไม่บังคับ)
4. กดส่งใบสมัคร
5. ตรวจสอบ LINE Group ว่ามีข้อความแจ้งเตือน

## 🔧 การแก้ไขปัญหา

### Build Error
- ตรวจสอบ dependencies ใน package.json
- ตรวจสอบ TypeScript errors

### MongoDB Error
- ตรวจสอบ MONGODB_URI
- เปิด Network Access ใน MongoDB Atlas

### LINE Bot Error
- ตรวจสอบ token, secret, group ID
- ตรวจสอบว่า bot อยู่ใน group

## 📞 Support

หากมีปัญหา:
1. ตรวจสอบ Vercel logs
2. ตรวจสอบ MongoDB connection
3. ตรวจสอบ LINE Bot configuration

---

**🎉 ระบบพร้อมใช้งาน!**

**Happy Deploying! 🚀** 