const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

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

// Excel file path
const EXCEL_FILE_PATH = path.join(process.cwd(), 'applications.xlsx');

// Initialize Excel file with headers
function initializeExcelFile() {
  try {
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

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
    
    XLSX.writeFile(workbook, EXCEL_FILE_PATH);
    console.log('Excel file initialized successfully');
  } catch (error) {
    console.error('Error initializing Excel file:', error);
  }
}

// Save application to Excel file
async function saveToExcel(applicationData) {
  try {
    let workbook;
    let worksheet;
    
    // Check if file exists
    if (fs.existsSync(EXCEL_FILE_PATH)) {
      workbook = XLSX.readFile(EXCEL_FILE_PATH);
      worksheet = workbook.Sheets['Applications'];
    } else {
      // Initialize new file
      initializeExcelFile();
      workbook = XLSX.readFile(EXCEL_FILE_PATH);
      worksheet = workbook.Sheets['Applications'];
    }

    // Convert worksheet to JSON to get existing data
    const existingData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Add new application data
    const newRow = [
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
    ];
    
    existingData.push(newRow);
    
    // Create new worksheet with updated data
    const newWorksheet = XLSX.utils.aoa_to_sheet(existingData);
    workbook.Sheets['Applications'] = newWorksheet;
    
    // Write to file
    XLSX.writeFile(workbook, EXCEL_FILE_PATH);
    
    console.log('Application saved to Excel file successfully');
  } catch (error) {
    console.error('Excel file error:', error);
    throw error;
  }
}

// Get all applications from Excel file
async function getAllApplications() {
  try {
    if (!fs.existsSync(EXCEL_FILE_PATH)) {
      return [];
    }
    
    const workbook = XLSX.readFile(EXCEL_FILE_PATH);
    const worksheet = workbook.Sheets['Applications'];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Skip header row and convert to objects
    const applications = data.slice(1).map(row => ({
      application_id: row[0],
      first_name: row[1],
      last_name: row[2],
      email: row[3],
      phone: row[4],
      position: row[5],
      experience_years: row[6],
      education: row[7],
      skills: row[8],
      cover_letter: row[9],
      resume_filename: row[10],
      submission_date: row[11],
      status: row[12]
    }));
    
    return applications;
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return [];
  }
}

// Get application by ID
async function getApplicationById(id) {
  try {
    const applications = await getAllApplications();
    return applications.find(app => app.application_id === id);
  } catch (error) {
    console.error('Error getting application by ID:', error);
    return null;
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
      // Get application by ID or all applications
      const { id } = req.query;
      
      if (id) {
        // Get specific application
        const application = await getApplicationById(id);
        if (!application) {
          return res.status(404).json({ error: 'Application not found' });
        }
        res.status(200).json(application);
      } else {
        // Get all applications
        const applications = await getAllApplications();
        res.status(200).json(applications);
      }
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

          // Save to Excel file
          await saveToExcel(application);

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