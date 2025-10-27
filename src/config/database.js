// src/config/database.js
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://vaj573cali:abc54321@cluster0.7xbo2v1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB');
  } catch (err) {
    console.error('❌ Error de conexión a MongoDB:', err);
    process.exit(1); // Salir si no puede conectar
  }
};

module.exports = connectDB;