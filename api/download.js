const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const excelFilePath = path.join(process.cwd(), 'applications.xlsx');
    
    // Check if file exists
    if (!fs.existsSync(excelFilePath)) {
      return res.status(404).json({ error: 'Excel file not found. No applications submitted yet.' });
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="dygs-applications.xlsx"');
    res.setHeader('Content-Length', fs.statSync(excelFilePath).size);

    // Stream the file
    const fileStream = fs.createReadStream(excelFilePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
}; 