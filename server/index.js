const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
let db;
const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    await client.connect();
    db = client.db('dygs_jobs');
    console.log('Connected to MongoDB');
    
    // Initialize collections and sample data
    await initializeCollections();
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

const initializeCollections = async () => {
  try {
    // Create collections if they don't exist
    const applications = db.collection('applications');
    const positions = db.collection('positions');

    // Create indexes
    await applications.createIndex({ application_id: 1 }, { unique: true });
    await positions.createIndex({ title: 1 });

    // Check if positions collection is empty and insert sample data
    const positionsCount = await positions.countDocuments();
    if (positionsCount === 0) {
      await positions.insertMany([
        {
          title: 'Logistics Coordinator',
          department: 'Operations',
          description: 'จัดการและประสานงานการขนส่งสินค้า',
          requirements: 'ประสบการณ์ 2-3 ปี, ภาษาอังกฤษดี',
          is_active: true
        },
        {
          title: 'Warehouse Manager',
          department: 'Warehouse',
          description: 'จัดการคลังสินค้าและทีมงาน',
          requirements: 'ประสบการณ์ 5+ ปี, ภาวะผู้นำ',
          is_active: true
        },
        {
          title: 'Delivery Driver',
          department: 'Transportation',
          description: 'ขับรถส่งสินค้าในพื้นที่',
          requirements: 'ใบขับขี่, ร่างกายแข็งแรง',
          is_active: true
        },
        {
          title: 'Customer Service',
          department: 'Sales',
          description: 'ให้บริการลูกค้าและประสานงาน',
          requirements: 'ประสบการณ์ 1-2 ปี, การสื่อสารดี',
          is_active: true
        },
        {
          title: 'IT Support',
          department: 'IT',
          description: 'ดูแลระบบคอมพิวเตอร์และเครือข่าย',
          requirements: 'ความรู้ IT, การแก้ไขปัญหา',
          is_active: true
        }
      ]);
      console.log('Sample positions inserted');
    }
  } catch (error) {
    console.error('Error initializing collections:', error);
  }
};

// File upload configuration (for local development only)
let upload;
if (process.env.NODE_ENV !== 'production') {
  // Create uploads directory if it doesn't exist (local only)
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  });

  upload = multer({ 
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image, PDF and document files are allowed!'));
      }
    }
  });
} else {
  // For production (Vercel), use memory storage
  upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image, PDF and document files are allowed!'));
      }
    }
  });
}

// Routes
app.get('/api/positions', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const positions = await db.collection('positions')
      .find({ is_active: true })
      .toArray();
    
    res.json(positions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

app.post('/api/applications', upload.single('resume'), async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const {
      first_name,
      last_name,
      email,
      phone,
      position,
      experience_years,
      education,
      skills,
      cover_letter
    } = req.body;

    const application_id = `DYGS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Handle file upload
    let resume_data = null;
    if (req.file) {
      if (process.env.NODE_ENV === 'production') {
        // For production, store file data in database (base64)
        resume_data = {
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          data: req.file.buffer.toString('base64')
        };
      } else {
        // For local development, store file path
        resume_data = req.file.filename;
      }
    }

    const application = {
      application_id,
      first_name,
      last_name,
      email,
      phone,
      position,
      experience_years: parseInt(experience_years),
      education,
      skills,
      resume_data,
      cover_letter,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date()
    };

    await db.collection('applications').insertOne(application);

    // Send to LINE OA
    await sendToLineOA({
      application_id,
      first_name,
      last_name,
      email,
      phone,
      position,
      experience_years,
      education,
      skills,
      cover_letter,
      resume_data: resume_data ? 'แนบมาแล้ว' : 'ไม่มี'
    });

    res.json({ 
      success: true, 
      application_id,
      message: 'สมัครงานสำเร็จ! เราจะติดต่อกลับภายใน 3-5 วันทำการ' 
    });

  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/applications/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const { id } = req.params;
    
    const application = await db.collection('applications')
      .findOne({ application_id: id });
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// LINE OA Integration
async function sendToLineOA(applicationData) {
  try {
    const line = require('@line/bot-sdk');
    
    const config = {
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET
    };

    const client = new line.Client(config);

    const message = {
      type: 'text',
      text: `📋 ใบสมัครงานใหม่จาก DYGS

🆔 Application ID: ${applicationData.application_id}
👤 ชื่อ: ${applicationData.first_name} ${applicationData.last_name}
📧 อีเมล: ${applicationData.email}
📱 เบอร์โทร: ${applicationData.phone}
💼 ตำแหน่ง: ${applicationData.position}
📈 ประสบการณ์: ${applicationData.experience_years} ปี
🎓 การศึกษา: ${applicationData.education}
🛠️ ทักษะ: ${applicationData.skills}
�� จดหมายสมัครงาน: ${applicationData.cover_letter ? 'มี' : 'ไม่มี'}
📎 Resume: ${applicationData.resume_data}

⏰ เวลาสมัคร: ${new Date().toLocaleString('th-TH')}`
    };

    // Send to LINE group or user
    if (process.env.LINE_GROUP_ID) {
      await client.pushMessage(process.env.LINE_GROUP_ID, message);
    }
    
    console.log('Application sent to LINE OA successfully');
  } catch (error) {
    console.error('LINE OA error:', error);
  }
}

// Serve static files (for local development)
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to database and start server
if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 DYGS Job Application Server running on port ${PORT}`);
      console.log(`📋 Ready to receive job applications`);
      console.log(`🔗 LINE OA integration: ${process.env.LINE_CHANNEL_ACCESS_TOKEN ? 'Enabled' : 'Disabled'}`);
    });
  });
} else {
  // For Vercel, connect to database on first request
  app.use(async (req, res, next) => {
    if (!db) {
      await connectDB();
    }
    next();
  });
}

// Export for Vercel
module.exports = app; 