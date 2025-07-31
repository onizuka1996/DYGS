module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Static positions data
    const positions = [
      {
        id: 1,
        title: 'Logistics Coordinator',
        department: 'Operations',
        description: 'จัดการและประสานงานการขนส่งสินค้า',
        requirements: 'ประสบการณ์ 2-3 ปี, ภาษาอังกฤษดี',
        is_active: true
      },
      {
        id: 2,
        title: 'Warehouse Manager',
        department: 'Warehouse',
        description: 'จัดการคลังสินค้าและทีมงาน',
        requirements: 'ประสบการณ์ 5+ ปี, ภาวะผู้นำ',
        is_active: true
      },
      {
        id: 3,
        title: 'Delivery Driver',
        department: 'Transportation',
        description: 'ขับรถส่งสินค้าในพื้นที่',
        requirements: 'ใบขับขี่, ร่างกายแข็งแรง',
        is_active: true
      },
      {
        id: 4,
        title: 'Customer Service',
        department: 'Sales',
        description: 'ให้บริการลูกค้าและประสานงาน',
        requirements: 'ประสบการณ์ 1-2 ปี, การสื่อสารดี',
        is_active: true
      },
      {
        id: 5,
        title: 'IT Support',
        department: 'IT',
        description: 'ดูแลระบบคอมพิวเตอร์และเครือข่าย',
        requirements: 'ความรู้ IT, การแก้ไขปัญหา',
        is_active: true
      }
    ];
    
    res.status(200).json(positions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
}; 