import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Upload, Send, CheckCircle, AlertCircle } from 'lucide-react';
import './App.css';

interface Position {
  id: number;
  title: string;
  department: string;
  description: string;
  requirements: string;
}

interface ApplicationForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  experience_years: number;
  education: string;
  skills: string;
  cover_letter: string;
}

// API base URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-vercel-app.vercel.app/api' 
  : '/api';

function App() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ApplicationForm>();

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/positions`);
      setPositions(response.data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const onSubmit = async (data: ApplicationForm) => {
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Add form data
      Object.keys(data).forEach(key => {
        formData.append(key, data[key as keyof ApplicationForm].toString());
      });

      // Add file if selected
      if (selectedFile) {
        formData.append('resume', selectedFile);
      }

      const response = await axios.post(`${API_BASE_URL}/applications`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setApplicationId(response.data.application_id);
      setSubmitSuccess(true);
      reset();
      setSelectedFile(null);
      
    } catch (error: any) {
      setError(error.response?.data?.error || 'เกิดข้อผิดพลาดในการส่งใบสมัคร');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="container">
        <div className="header">
          <h1>🎉 สมัครงานสำเร็จ!</h1>
          <p>ขอบคุณที่สนใจร่วมงานกับ DYGS</p>
        </div>
        
        <div className="card">
          <div className="success-message">
            <CheckCircle size={24} style={{ marginRight: '8px' }} />
            ใบสมัครงานของคุณได้รับการส่งเรียบร้อยแล้ว
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <strong>Application ID:</strong> {applicationId}
          </div>
          
          <p style={{ marginBottom: '20px' }}>
            เราจะติดต่อกลับไปยังอีเมลหรือเบอร์โทรศัพท์ที่คุณระบุภายใน 3-5 วันทำการ
          </p>
          
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSubmitSuccess(false);
              setApplicationId('');
            }}
          >
            สมัครงานใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🚛 DYGS Logistics</h1>
        <p>ระบบสมัครงานออนไลน์ - เชื่อมต่อ LINE OA</p>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '24px', color: '#495057' }}>
          📋 ใบสมัครงาน
        </h2>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} style={{ marginRight: '8px' }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">ชื่อ *</label>
              <input
                type="text"
                className="form-input"
                {...register('first_name', { required: 'กรุณากรอกชื่อ' })}
                placeholder="ชื่อ"
              />
              {errors.first_name && (
                <span style={{ color: '#dc3545', fontSize: '14px' }}>
                  {errors.first_name.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">นามสกุล *</label>
              <input
                type="text"
                className="form-input"
                {...register('last_name', { required: 'กรุณากรอกนามสกุล' })}
                placeholder="นามสกุล"
              />
              {errors.last_name && (
                <span style={{ color: '#dc3545', fontSize: '14px' }}>
                  {errors.last_name.message}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">อีเมล *</label>
              <input
                type="email"
                className="form-input"
                {...register('email', { 
                  required: 'กรุณากรอกอีเมล',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'รูปแบบอีเมลไม่ถูกต้อง'
                  }
                })}
                placeholder="example@email.com"
              />
              {errors.email && (
                <span style={{ color: '#dc3545', fontSize: '14px' }}>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">เบอร์โทรศัพท์ *</label>
              <input
                type="tel"
                className="form-input"
                {...register('phone', { 
                  required: 'กรุณากรอกเบอร์โทรศัพท์',
                  pattern: {
                    value: /^[0-9-+\s()]+$/,
                    message: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง'
                  }
                })}
                placeholder="081-234-5678"
              />
              {errors.phone && (
                <span style={{ color: '#dc3545', fontSize: '14px' }}>
                  {errors.phone.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">ตำแหน่งที่สมัคร *</label>
            <select
              className="form-select"
              {...register('position', { required: 'กรุณาเลือกตำแหน่ง' })}
            >
              <option value="">เลือกตำแหน่ง</option>
              {positions.map((position) => (
                <option key={position.id} value={position.title}>
                  {position.title} - {position.department}
                </option>
              ))}
            </select>
            {errors.position && (
              <span style={{ color: '#dc3545', fontSize: '14px' }}>
                {errors.position.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">ประสบการณ์การทำงาน (ปี) *</label>
            <input
              type="number"
              className="form-input"
              {...register('experience_years', { 
                required: 'กรุณากรอกประสบการณ์การทำงาน',
                min: { value: 0, message: 'ประสบการณ์ต้องไม่น้อยกว่า 0 ปี' },
                max: { value: 50, message: 'ประสบการณ์ต้องไม่เกิน 50 ปี' }
              })}
              placeholder="0"
              min="0"
              max="50"
            />
            {errors.experience_years && (
              <span style={{ color: '#dc3545', fontSize: '14px' }}>
                {errors.experience_years.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">การศึกษา *</label>
            <input
              type="text"
              className="form-input"
              {...register('education', { required: 'กรุณากรอกการศึกษา' })}
              placeholder="เช่น ปริญญาตรี สาขาบริหารธุรกิจ มหาวิทยาลัย..."
            />
            {errors.education && (
              <span style={{ color: '#dc3545', fontSize: '14px' }}>
                {errors.education.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">ทักษะและความสามารถ *</label>
            <textarea
              className="form-textarea"
              {...register('skills', { required: 'กรุณากรอกทักษะและความสามารถ' })}
              placeholder="เช่น ภาษาอังกฤษ, Microsoft Office, การจัดการทีม, การแก้ไขปัญหา..."
            />
            {errors.skills && (
              <span style={{ color: '#dc3545', fontSize: '14px' }}>
                {errors.skills.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">จดหมายสมัครงาน (Cover Letter)</label>
            <textarea
              className="form-textarea"
              {...register('cover_letter')}
              placeholder="บอกเราเกี่ยวกับตัวคุณ เหตุผลที่อยากทำงานกับเรา และสิ่งที่คุณสามารถนำมาสู่บริษัทได้..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">อัปโหลด Resume/CV</label>
            <div
              className="file-upload"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('resume-upload')?.click()}
            >
              <Upload size={48} style={{ marginBottom: '16px', color: '#6c757d' }} />
              <p style={{ marginBottom: '8px', color: '#495057' }}>
                {selectedFile ? selectedFile.name : 'คลิกหรือลากไฟล์มาวางที่นี่'}
              </p>
              <p style={{ fontSize: '14px', color: '#6c757d' }}>
                รองรับไฟล์ PDF, DOC, DOCX, JPG, PNG (ขนาดไม่เกิน 5MB)
              </p>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', marginTop: '20px' }}
          >
            {isSubmitting ? (
              <>
                <div className="loading" style={{ marginRight: '8px' }}></div>
                กำลังส่งใบสมัคร...
              </>
            ) : (
              <>
                <Send size={20} style={{ marginRight: '8px' }} />
                ส่งใบสมัครงาน
              </>
            )}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px', color: '#495057' }}>
          📞 ติดต่อเรา
        </h3>
        <p style={{ marginBottom: '8px' }}>
          <strong>บริษัท DYGS Logistics</strong>
        </p>
        <p style={{ marginBottom: '8px' }}>
          📧 Email: hr@dygs.co.th
        </p>
        <p style={{ marginBottom: '8px' }}>
          📱 โทร: 02-123-4567
        </p>
        <p style={{ marginBottom: '8px' }}>
          📍 ที่อยู่: 123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110
        </p>
        <p style={{ fontSize: '14px', color: '#6c757d' }}>
          * ข้อมูลใบสมัครจะถูกส่งไปยัง LINE OA ของบริษัทโดยอัตโนมัติ
        </p>
      </div>
    </div>
  );
}

export default App; 