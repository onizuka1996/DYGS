const { MongoClient } = require('mongodb');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedDb = client.db('dygs_jobs');
  return cachedDb;
}

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image, PDF and document files are allowed!'));
    }
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
📝 จดหมายสมัครงาน: ${applicationData.cover_letter ? 'มี' : 'ไม่มี'}
📎 Resume: ${applicationData.resume_data}

⏰ เวลาสมัคร: ${new Date().toLocaleString('th-TH')}`
    };

    if (process.env.LINE_GROUP_ID) {
      await client.pushMessage(process.env.LINE_GROUP_ID, message);
    }
    
    console.log('Application sent to LINE OA successfully');
  } catch (error) {
    console.error('LINE OA error:', error);
  }
}

// Initialize collections
async function initializeCollections(db) {
  try {
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
    }
  } catch (error) {
    console.error('Error initializing collections:', error);
  }
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const db = await connectToDatabase();
    await initializeCollections(db);

    if (req.method === 'GET') {
      // Get application by ID
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Application ID is required' });
      }

      const application = await db.collection('applications')
        .findOne({ application_id: id });
      
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      
      res.status(200).json(application);
    } else if (req.method === 'POST') {
      // Handle file upload and application submission
      upload.single('resume')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        try {
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
            resume_data = {
              filename: req.file.originalname,
              mimetype: req.file.mimetype,
              size: req.file.size,
              data: req.file.buffer.toString('base64')
            };
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

          res.status(200).json({ 
            success: true, 
            application_id,
            message: 'สมัครงานสำเร็จ! เราจะติดต่อกลับภายใน 3-5 วันทำการ' 
          });

        } catch (error) {
          console.error('Application error:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
}; 