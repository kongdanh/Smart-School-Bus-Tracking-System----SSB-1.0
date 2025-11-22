// Test kết nối database
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔄 Đang kết nối đến database...');
    console.log(`📍 DATABASE_URL: ${process.env.DATABASE_URL}`);
    
    // Test kết nối
    const result = await prisma.$queryRaw`SELECT 1`;
    
    console.log('✅ Kết nối database thành công!');
    
    // Lấy số lượng users
    const userCount = await prisma.user.count();
    console.log(`📊 Số lượng users: ${userCount}`);
    
    // Lấy tất cả users
    const users = await prisma.user.findMany();
    console.log('\n📋 Danh sách users:');
    console.table(users);
    
  } catch (error) {
    console.error('❌ Lỗi kết nối database:');
    console.error('Error:', error.message);
    console.error('\nCó thể là do:');
    console.error('1. MySQL service không chạy');
    console.error('2. DATABASE_URL sai');
    console.error('3. Database "ssb10" không tồn tại');
    console.error('4. Username/password không đúng');
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
