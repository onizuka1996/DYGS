# 📊 คู่มือการใช้งานระบบ Excel สำหรับระบบสมัครงาน DYGS

## 🎯 วัตถุประสงค์

แทนที่การใช้ Google Sheets ด้วยไฟล์ Excel (.xlsx) เพื่อให้:
- ✅ ง่ายต่อการจัดการข้อมูล
- ✅ ไม่ต้องตั้งค่า Google Cloud Project
- ✅ ดาวน์โหลดไฟล์ Excel ได้ทันที
- ✅ ใช้งานได้ทันทีโดยไม่ต้องตั้งค่าที่ซับซ้อน

## 🔧 วิธีการทำงาน

### 1. การเก็บข้อมูล
- ข้อมูลใบสมัครจะถูกบันทึกในไฟล์ `applications.xlsx`
- ไฟล์จะถูกสร้างอัตโนมัติเมื่อมีใบสมัครแรก
- ข้อมูลจะถูกเพิ่มต่อท้ายในไฟล์

### 2. โครงสร้างไฟล์ Excel

#### Sheet: Applications

| Column | Header | Description |
|--------|--------|-------------|
| A | Application ID | รหัสใบสมัคร |
| B | First Name | ชื่อ |
| C | Last Name | นามสกุล |
| D | Email | อีเมล |
| E | Phone | เบอร์โทรศัพท์ |
| F | Position | ตำแหน่งที่สมัคร |
| G | Experience (Years) | ประสบการณ์ (ปี) |
| H | Education | การศึกษา |
| I | Skills | ทักษะและความสามารถ |
| J | Cover Letter | จดหมายสมัครงาน |
| K | Resume File | ไฟล์ Resume |
| L | Submission Date | วันที่สมัคร |
| M | Status | สถานะ |

## 🚀 การ Deploy

### 1. Environment Variables
ตั้งค่าใน Vercel Dashboard > Settings > Environment Variables:

```
LINE_OA_URL=https://line.me/R/ti/p/@your-line-oa-id
NODE_ENV=production
```

### 2. ไม่ต้องตั้งค่าเพิ่มเติม
- ไม่ต้องตั้งค่า Google Cloud Project
- ไม่ต้องสร้าง Service Account
- ไม่ต้องตั้งค่า Google Sheets API

## 📊 การใช้งาน

### สำหรับผู้สมัครงาน
1. กรอกข้อมูลในฟอร์มสมัครงาน
2. อัปโหลดไฟล์ Resume (ไม่บังคับ)
3. กดส่งใบสมัคร
4. คลิกปุ่ม "เพิ่ม LINE OA" เพื่อติดตามสถานะ

### สำหรับ HR/Admin
1. คลิกปุ่ม "ดาวน์โหลดไฟล์ Excel" ที่ด้านล่างหน้าเว็บ
2. ไฟล์ `dygs-applications.xlsx` จะถูกดาวน์โหลด
3. เปิดไฟล์ด้วย Microsoft Excel หรือ Google Sheets
4. ดูข้อมูลใบสมัครทั้งหมด

## 🔍 การทดสอบ

### 1. ทดสอบการส่งใบสมัคร
```bash
curl -X POST https://your-app.vercel.app/api/applications
```

### 2. ทดสอบการดาวน์โหลดไฟล์
```bash
curl https://your-app.vercel.app/api/download
```

### 3. ทดสอบการดูข้อมูลทั้งหมด
```bash
curl https://your-app.vercel.app/api/applications
```

## 🛠️ การแก้ไขปัญหา

### ปัญหา: ไฟล์ Excel ไม่ถูกสร้าง
- ตรวจสอบว่า Vercel มีสิทธิ์เขียนไฟล์
- ตรวจสอบ logs ใน Vercel Dashboard
- ลองส่งใบสมัครใหม่

### ปัญหา: ไม่สามารถดาวน์โหลดไฟล์ได้
- ตรวจสอบว่าไฟล์ `applications.xlsx` มีอยู่
- ตรวจสอบ API endpoint `/api/download`
- ตรวจสอบ CORS settings

### ปัญหา: ข้อมูลไม่ถูกบันทึก
- ตรวจสอบ logs ใน Vercel Dashboard
- ตรวจสอบ dependencies `xlsx`
- ตรวจสอบ file permissions

## 📋 การจัดการข้อมูล

### การดูข้อมูล
- ดาวน์โหลดไฟล์ Excel
- เปิดด้วย Microsoft Excel หรือ Google Sheets
- ข้อมูลจะถูกจัดเรียงตามวันที่สมัคร

### การอัปเดตสถานะ
- แก้ไขคอลัมน์ "Status" ในไฟล์ Excel
- ใช้คำว่า: pending, approved, rejected, contacted
- บันทึกไฟล์

### การ Export ข้อมูล
- ไฟล์ Excel สามารถเปิดได้ในโปรแกรมต่างๆ
- สามารถแปลงเป็น CSV ได้
- สามารถแชร์ผ่าน Google Drive ได้

## 🔒 Security

### Best Practices
- ไฟล์ Excel จะถูกเก็บใน Vercel server
- ใช้ Environment Variables สำหรับ sensitive data
- ตรวจสอบ logs เป็นประจำ
- จำกัดการเข้าถึง API endpoints

### การ Backup
- ดาวน์โหลดไฟล์ Excel เป็นประจำ
- เก็บไฟล์ในที่ปลอดภัย
- สร้าง backup อัตโนมัติ

## 📞 Support

หากมีปัญหา:
1. ตรวจสอบ Vercel logs
2. ตรวจสอบ API endpoints
3. ตรวจสอบ file permissions

## 🎉 ข้อดีของระบบ Excel

### ง่ายต่อการใช้งาน
- ไม่ต้องตั้งค่า Google Cloud Project
- ไม่ต้องสร้าง Service Account
- ไม่ต้องตั้งค่า API keys

### ยืดหยุ่น
- ดาวน์โหลดไฟล์ได้ทันที
- เปิดได้ในโปรแกรมต่างๆ
- แชร์ได้ง่าย

### ประหยัด
- ไม่ต้องใช้ Google Cloud credits
- ไม่ต้องจ่ายค่าบริการเพิ่มเติม
- ใช้ทรัพยากรน้อย

---

**🎉 ระบบพร้อมใช้งาน!**

หลังจาก deploy เสร็จ ระบบจะ:
- บันทึกข้อมูลใบสมัครในไฟล์ Excel
- แสดงปุ่ม LINE OA หลังจากส่งใบสมัคร
- มีปุ่มดาวน์โหลดไฟล์ Excel สำหรับ HR/Admin

**Happy Setup! 🚀** 