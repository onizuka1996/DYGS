const { google } = require('googleapis');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

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

// Google Sheets API setup
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Save application to Google Sheets
async function saveToGoogleSheets(applicationData) {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = 'Applications!A:Z'; // Assuming sheet name is "Applications"
    
    const values = [
      [
        applicationData.application_id,
        applicationData.first_name,
        applicationData.last_name,
        applicationData.email,
        applicationData.phone,
        applicationData.position,
        applicationData.experience_years,
        applicationData.education,
        applicationData.skills,
        applicationData.cover_letter || '',
        applicationData.resume_filename || '',
        new Date().toISOString(),
        'pending'
      ]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: { values }
    });

    console.log('Application saved to Google Sheets successfully');
  } catch (error) {
    console.error('Google Sheets error:', error);
    throw error;
  }
}

// Initialize Google Sheet
async function initializeGoogleSheet() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    // Create headers if sheet doesn't exist
    const headers = [
      'Application ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Position',
      'Experience (Years)',
      'Education',
      'Skills',
      'Cover Letter',
      'Resume File',
      'Submission Date',
      'Status'
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Applications!A1:M1',
      valueInputOption: 'RAW',
      resource: { values: [headers] }
    });

    console.log('Google Sheet initialized successfully');
  } catch (error) {
    console.error('Error initializing Google Sheet:', error);
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
    if (req.method === 'GET') {
      // Get application by ID
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Application ID is required' });
      }

      // For now, return a simple response since we're not storing in database
      res.status(200).json({ 
        application_id: id,
        message: 'Application submitted successfully. Please check your email for confirmation.'
      });
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
          let resume_filename = null;
          if (req.file) {
            resume_filename = req.file.originalname;
            // In a real implementation, you might want to upload to cloud storage
            // For now, we'll just store the filename
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
            cover_letter,
            resume_filename
          };

          // Save to Google Sheets
          await saveToGoogleSheets(application);

          // Generate LINE OA URL
          const lineOAUrl = process.env.LINE_OA_URL || 'https://line.me/R/ti/p/@dygs-logistics';
          
          res.status(200).json({ 
            success: true, 
            application_id,
            line_oa_url: lineOAUrl,
            message: 'สมัครงานสำเร็จ! กรุณาเพิ่ม LINE OA เพื่อติดตามสถานะการสมัครงาน' 
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
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}; 