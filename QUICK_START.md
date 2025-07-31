# ⚡ Quick Start - Deploy DYGS Job Application บน Vercel (Excel Version)

## 🎯 สิ่งที่คุณจะได้

ระบบสมัครงานบริษัทโลจิสติก DYGS ที่:
- 📱 Responsive Design
- 📋 ฟอร์มสมัครงานที่สวยงาม
- 📎 อัปโหลดไฟล์ Resume/CV
- 📊 เก็บข้อมูลในไฟล์ Excel (.xlsx)
- 🔗 นำทางไปยัง LINE OA หลังจากสมัคร
- 📥 ดาวน์โหลดไฟล์ Excel สำหรับ HR/Admin

## 🚀 Deploy ใน 4 ขั้นตอน

### 1. เตรียมข้อมูล
- **LINE OA URL**: URL ของ LINE Official Account (ไม่บังคับ)

### 2. Push โค้ดไป GitHub
```bash
git add .
git commit -m "Update to use Excel instead of Google Sheets"
git push origin main
```

### 3. Deploy บน Vercel
- ไปที่ [vercel.com](https://vercel.com)
- คลิก "New Project"
- เลือก GitHub repository: `onizuka1996/DYGS`
- คลิก "Import"

### 4. ตั้งค่า Environment Variables (ไม่บังคับ)
ใน Vercel Dashboard > Settings > Environment Variables:

```
LINE_OA_URL=https://line.me/R/ti/p/@your-line-oa-id
NODE_ENV=production
```

## ✅ ทดสอบระบบ

1. เปิดเว็บไซต์ที่ได้จาก Vercel
2. กรอกข้อมูลในฟอร์มสมัครงาน
3. อัปโหลดไฟล์ Resume (ไม่บังคับ)
4. กดส่งใบสมัคร
5. ตรวจสอบว่าส่งสำเร็จ
6. คลิกปุ่ม "เพิ่ม LINE OA" เพื่อไปยัง LINE OA
7. คลิกปุ่ม "ดาวน์โหลดไฟล์ Excel" เพื่อดูข้อมูล

## 🔧 การแก้ไขปัญหา

### Build Error
- ตรวจสอบ dependencies ใน package.json
- ตรวจสอบ TypeScript errors

### Excel File Error
- ตรวจสอบ logs ใน Vercel Dashboard
- ตรวจสอบ file permissions
- ลองส่งใบสมัครใหม่

### LINE OA Error
- ตรวจสอบ LINE_OA_URL (ไม่บังคับ)
- ตรวจสอบว่า URL ถูกต้อง

## 📊 การใช้งาน

### สำหรับผู้สมัครงาน
- กรอกข้อมูลและส่งใบสมัคร
- คลิกปุ่ม LINE OA เพื่อติดตามสถานะ

### สำหรับ HR/Admin
- คลิกปุ่ม "ดาวน์โหลดไฟล์ Excel"
- เปิดไฟล์ด้วย Microsoft Excel หรือ Google Sheets
- ดูข้อมูลใบสมัครทั้งหมด

## 📞 Support

หากมีปัญหา:
1. ตรวจสอบ Vercel logs
2. ตรวจสอบ API endpoints
3. ตรวจสอบ file permissions

---

**🎉 ระบบพร้อมใช้งาน!**

**Happy Deploying! 🚀** 