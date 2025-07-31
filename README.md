# 🚛 DYGS Logistics - ระบบสมัครงานออนไลน์

ระบบสมัครงานออนไลน์สำหรับบริษัทโลจิสติก DYGS ที่เชื่อมต่อกับ LINE OA เพื่อรับการแจ้งเตือนใบสมัครงานใหม่

## ✨ Features

- 📋 ฟอร์มสมัครงานที่ใช้งานง่าย
- 📎 อัปโหลดไฟล์ Resume/CV
- 🔗 เชื่อมต่อ LINE OA สำหรับการแจ้งเตือน
- 💾 เก็บข้อมูลในฐานข้อมูล SQLite
- 📱 Responsive Design รองรับทุกอุปกรณ์
- ✅ Form Validation แบบ Real-time
- 🎨 UI/UX ที่สวยงามและทันสมัย

## 🛠️ Technology Stack

### Backend
- **Node.js** + **Express.js**
- **SQLite** Database
- **Multer** สำหรับ File Upload
- **LINE Bot SDK** สำหรับเชื่อมต่อ LINE OA

### Frontend
- **React** + **TypeScript**
- **React Hook Form** สำหรับ Form Management
- **Axios** สำหรับ API Calls
- **Lucide React** สำหรับ Icons

## 🚀 การติดตั้งและใช้งาน

### 1. Clone โปรเจค
```bash
git clone <repository-url>
cd dygs-job-application
```

### 2. ติดตั้ง Dependencies
```bash
# ติดตั้ง dependencies ทั้งหมด
npm run install-all

# หรือติดตั้งแยก
npm install
cd server && npm install
cd ../client && npm install
```

### 3. ตั้งค่า Environment Variables
```bash
# คัดลอกไฟล์ .env.example
cp server/.env.example server/.env

# แก้ไขไฟล์ .env ใน server folder
```

### 4. ตั้งค่า LINE Bot
1. สร้าง LINE Bot ใน [LINE Developers Console](https://developers.line.biz/)
2. รับ Channel Access Token และ Channel Secret
3. เพิ่ม Bot เข้าใน LINE Group ที่ต้องการ
4. รับ Group ID จาก LINE Group
5. ใส่ข้อมูลในไฟล์ `.env`

### 5. รันโปรเจค
```bash
# รันทั้ง Frontend และ Backend
npm run dev

# หรือรันแยก
npm run server  # Backend ที่ port 5000
npm run client  # Frontend ที่ port 3000
```

## 📋 การใช้งาน

### สำหรับผู้สมัครงาน
1. เข้าไปที่ `http://localhost:3000`
2. กรอกข้อมูลส่วนตัว
3. เลือกตำแหน่งที่ต้องการสมัคร
4. อัปโหลด Resume/CV (ไม่บังคับ)
5. กดส่งใบสมัคร

### สำหรับ HR/Admin
1. ข้อมูลจะถูกส่งไปยัง LINE Group ที่กำหนด
2. ตรวจสอบข้อมูลในฐานข้อมูล SQLite
3. ติดต่อกลับผู้สมัครผ่านอีเมลหรือเบอร์โทร

## 🗄️ Database Schema

### ตาราง applications
- `id` - Primary Key
- `application_id` - รหัสใบสมัคร (Unique)
- `first_name` - ชื่อ
- `last_name` - นามสกุล
- `email` - อีเมล
- `phone` - เบอร์โทรศัพท์
- `position` - ตำแหน่งที่สมัคร
- `experience_years` - ประสบการณ์ (ปี)
- `education` - การศึกษา
- `skills` - ทักษะและความสามารถ
- `resume_path` - Path ของไฟล์ Resume
- `cover_letter` - จดหมายสมัครงาน
- `status` - สถานะ (pending, approved, rejected)
- `created_at` - วันที่สร้าง
- `updated_at` - วันที่อัปเดต

### ตาราง positions
- `id` - Primary Key
- `title` - ชื่อตำแหน่ง
- `department` - แผนก
- `description` - รายละเอียดงาน
- `requirements` - คุณสมบัติที่ต้องการ
- `is_active` - สถานะการเปิดรับ

## 🔧 API Endpoints

### GET /api/positions
รับรายการตำแหน่งงานทั้งหมด

### POST /api/applications
ส่งใบสมัครงานใหม่
- Content-Type: `multipart/form-data`
- Fields: first_name, last_name, email, phone, position, experience_years, education, skills, cover_letter
- File: resume (optional)

### GET /api/applications/:id
ดูรายละเอียดใบสมัครตาม Application ID

## 📱 LINE OA Integration

ระบบจะส่งข้อความแจ้งเตือนไปยัง LINE Group เมื่อมีใบสมัครใหม่ โดยมีข้อมูล:
- Application ID
- ข้อมูลผู้สมัคร
- ตำแหน่งที่สมัคร
- ประสบการณ์และทักษะ
- สถานะการแนบไฟล์

## 🎨 Customization

### เปลี่ยนตำแหน่งงาน
แก้ไขข้อมูลในตาราง `positions` หรือเพิ่มในไฟล์ `server/index.js`

### ปรับแต่ง UI
แก้ไขไฟล์ CSS ใน `client/src/index.css` และ `client/src/App.css`

### เพิ่มฟิลด์ใหม่
1. เพิ่มคอลัมน์ในฐานข้อมูล
2. อัปเดต API endpoint
3. เพิ่มฟิลด์ในฟอร์ม React

## 🔒 Security Features

- File upload validation
- SQL injection prevention
- CORS configuration
- Input sanitization
- File size limits

## 📞 Support

หากมีปัญหาหรือต้องการความช่วยเหลือ:
- 📧 Email: support@dygs.co.th
- 📱 LINE: @dygs-support

## 📄 License

MIT License - ดูรายละเอียดในไฟล์ LICENSE

---

**พัฒนาโดยทีม DYGS Logistics** 🚛 