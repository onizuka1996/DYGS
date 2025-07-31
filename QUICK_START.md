# ⚡ Quick Start - Deploy DYGS Job Application บน Vercel (Google Sheets Version)

## 🎯 สิ่งที่คุณจะได้

ระบบสมัครงานบริษัทโลจิสติก DYGS ที่:
- 📱 Responsive Design
- 📋 ฟอร์มสมัครงานที่สวยงาม
- 📎 อัปโหลดไฟล์ Resume/CV
- 📊 เก็บข้อมูลใน Google Sheets
- 🔗 นำทางไปยัง LINE OA หลังจากสมัคร

## 🚀 Deploy ใน 5 ขั้นตอน

### 1. เตรียมข้อมูล
- **Google Cloud Project**: สร้าง project และเปิดใช้งาน Google Sheets API
- **Google Sheet**: สร้าง sheet และรับ Sheet ID
- **Service Account**: สร้าง service account และรับ JSON key
- **LINE OA URL**: URL ของ LINE Official Account

### 2. Push โค้ดไป GitHub
```bash
git add .
git commit -m "Update to use Google Sheets instead of MongoDB"
git push origin main
```

### 3. Deploy บน Vercel
- ไปที่ [vercel.com](https://vercel.com)
- คลิก "New Project"
- เลือก GitHub repository: `onizuka1996/DYGS`
- คลิก "Import"

### 4. ตั้งค่า Environment Variables
ใน Vercel Dashboard > Settings > Environment Variables:

```
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your_project_id","private_key_id":"your_private_key_id","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n","client_email":"your_service_account_email@project.iam.gserviceaccount.com","client_id":"your_client_id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your_service_account_email%40project.iam.gserviceaccount.com"}
LINE_OA_URL=https://line.me/R/ti/p/@your-line-oa-id
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
5. ตรวจสอบ Google Sheet ว่ามีข้อมูลใหม่
6. คลิกปุ่ม "เพิ่ม LINE OA" เพื่อไปยัง LINE OA

## 🔧 การแก้ไขปัญหา

### Build Error
- ตรวจสอบ dependencies ใน package.json
- ตรวจสอบ TypeScript errors

### Google Sheets Error
- ตรวจสอบ GOOGLE_SHEET_ID
- ตรวจสอบ GOOGLE_SERVICE_ACCOUNT_KEY
- แชร์ Google Sheet กับ Service Account email

### LINE OA Error
- ตรวจสอบ LINE_OA_URL
- ตรวจสอบว่า URL ถูกต้อง

## 📞 Support

หากมีปัญหา:
1. ตรวจสอบ Vercel logs
2. ตรวจสอบ Google Cloud Console
3. ตรวจสอบ Google Sheet permissions

---

**🎉 ระบบพร้อมใช้งาน!**

**Happy Deploying! 🚀** 