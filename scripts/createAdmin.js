// scripts/createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../src/config/database');
const User = require('../src/models/User');

async function createAdminUser() {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Verificar si ya existe un admin
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('⚠️  Ya existe un usuario administrador:');
      console.log(`   Username: ${adminExists.username}`);
      console.log(`   Email: ${adminExists.email}`);
      console.log('\n   Si deseas crear otro admin, usa la ruta POST /api/users/admin desde la aplicación.');
      process.exit(0);
    }

    // Crear el usuario admin
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = new User({
      username: 'admin',
      email: 'admin@biblioteca.com',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();

    console.log('\n✅ Administrador inicial creado exitosamente!');
    console.log('\n📋 Credenciales:');
    console.log('   Email: admin@biblioteca.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña inmediatamente después del primer login.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear administrador:', error.message);
    process.exit(1);
  }
}

// Ejecutar el script
createAdminUser();