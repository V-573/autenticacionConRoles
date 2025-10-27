// src/routes/index.js
const express = require('express');
const router = express.Router();


// routers hijos
const authRouter = require('./auth.routes');







// Endpoint de salud para verificar el enrutador
router.get('/health', (req, res) => {
  res.json({ ok: true, service: 'api', timestamp: new Date().toISOString() });
});





// montar /auth/*
router.use('/auth', authRouter);


module.exports = router;