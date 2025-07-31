# 📊 คู่มือการตั้งค่า Google Sheets สำหรับระบบสมัครงาน DYGS

## 🎯 วัตถุประสงค์

แทนที่การใช้ MongoDB ด้วย Google Sheets เพื่อให้:
- ✅ ง่ายต่อการจัดการข้อมูล
- ✅ ไม่ต้องตั้งค่า database
- ✅ ดูข้อมูลได้ทันทีใน Google Sheets
- ✅ แชร์ข้อมูลกับทีมได้ง่าย

## 🔧 ขั้นตอนการตั้งค่า

### 1. สร้าง Google Cloud Project

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้าง Project ใหม่หรือเลือก Project ที่มีอยู่
3. เปิดใช้งาน Google Sheets API:
   - ไปที่ "APIs & Services" > "Library"
   - ค้นหา "Google Sheets API"
   - คลิก "Enable"

### 2. สร้าง Service Account

1. ไปที่ "APIs & Services" > "Credentials"
2. คลิก "Create Credentials" > "Service Account"
3. กรอกข้อมูล:
   - **Name**: `dygs-job-applications`
   - **Description**: `Service account for DYGS job application system`
4. คลิก "Create and Continue"
5. ข้ามขั้นตอน "Grant this service account access to project"
6. คลิก "Done"

### 3. สร้าง Service Account Key

1. คลิกที่ Service Account ที่เพิ่งสร้าง
2. ไปที่แท็บ "Keys"
3. คลิก "Add Key" > "Create new key"
4. เลือก "JSON"
5. คลิก "Create"
6. ไฟล์ JSON จะถูกดาวน์โหลด

### 4. สร้าง Google Sheet

1. ไปที่ [Google Sheets](https://sheets.google.com/)
2. สร้าง Sheet ใหม่
3. ตั้งชื่อ Sheet เป็น "Applications"
4. แชร์ Sheet กับ Service Account email (จากไฟล์ JSON)
5. ให้สิทธิ์ "Editor"
6. คัดลอก Sheet ID จาก URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```

### 5. ตั้งค่า Environment Variables

ใน Vercel Dashboard > Settings > Environment Variables:

```
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your_project_id","private_key_id":"your_private_key_id","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n","client_email":"your_service_account_email@project.iam.gserviceaccount.com","client_id":"your_client_id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your_service_account_email%40project.iam.gserviceaccount.com"}
LINE_OA_URL=https://line.me/R/ti/p/@your-line-oa-id
NODE_ENV=production
```

## 📋 โครงสร้าง Google Sheet

### Sheet: Applications

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

## 🔍 การทดสอบ

### 1. ทดสอบการเชื่อมต่อ
```bash
curl https://your-app.vercel.app/api/positions
```

### 2. ทดสอบการส่งใบสมัคร
1. เปิดเว็บไซต์
2. กรอกข้อมูลและส่งใบสมัคร
3. ตรวจสอบ Google Sheet ว่ามีข้อมูลใหม่

### 3. ทดสอบปุ่ม LINE OA
1. หลังจากส่งใบสมัครสำเร็จ
2. คลิกปุ่ม "เพิ่ม LINE OA"
3. ตรวจสอบว่าเปิด LINE OA ได้

## 🛠️ การแก้ไขปัญหา

### ปัญหา: Google Sheets API Error
- ตรวจสอบ Service Account Key
- ตรวจสอบ Sheet ID
- ตรวจสอบสิทธิ์การเข้าถึง Sheet

### ปัญหา: Permission Denied
- แชร์ Sheet กับ Service Account email
- ให้สิทธิ์ "Editor"
- ตรวจสอบ Google Sheets API เปิดใช้งาน

### ปัญหา: Invalid JSON
- ตรวจสอบ GOOGLE_SERVICE_ACCOUNT_KEY format
- ใช้ JSON string ที่ถูกต้อง
- ตรวจสอบ private key format

## 📊 การจัดการข้อมูล

### การดูข้อมูล
- เปิด Google Sheet
- ข้อมูลจะถูกเพิ่มอัตโนมัติ
- สามารถ sort, filter, search ได้

### การอัปเดตสถานะ
- แก้ไขคอลัมน์ "Status"
- ใช้คำว่า: pending, approved, rejected, contacted

### การ Export ข้อมูล
- File > Download > CSV
- หรือใช้ Google Apps Script

## 🔒 Security

### Best Practices
- อย่าแชร์ Service Account Key
- ใช้ Environment Variables
- จำกัดสิทธิ์การเข้าถึง Sheet
- ตรวจสอบ logs เป็นประจำ

### การลบข้อมูล
- ลบแถวใน Google Sheet
- หรือสร้าง Sheet ใหม่

## 📞 Support

หากมีปัญหา:
1. ตรวจสอบ Google Cloud Console logs
2. ตรวจสอบ Vercel logs
3. ตรวจสอบ Google Sheet permissions

---

**🎉 ระบบพร้อมใช้งาน!**

หลังจากตั้งค่าเสร็จ ระบบจะ:
- บันทึกข้อมูลใบสมัครใน Google Sheets
- แสดงปุ่ม LINE OA หลังจากส่งใบสมัคร
- ไม่ต้องตั้งค่า database ที่ซับซ้อน

**Happy Setup! 🚀** 