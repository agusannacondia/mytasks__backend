const express = require('express')
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middlewares/auth')
const { check } = require('express-validator')

// Crea un proyecto  /api/proyectos
router.post('/', 
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

// Obtener toods los proyetcos para un usuario  /api/proyectos
router.get('/', 
    auth,
    proyectoController.obtenerProyectos
);

// Actualizar un proyecto
router.put('/:id', 
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

// Actualizar un proyecto
router.delete('/:id', 
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router;









