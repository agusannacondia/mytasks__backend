const express = require('express')
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middlewares/auth')
const authController = require('../controllers/authController')

// Crea un usuario  /api/auth
router.post('/', 
    authController.autenticarUsuario
);

router.get('/',
    auth, 
    authController.usuarioAutenticado
);

module.exports = router;









