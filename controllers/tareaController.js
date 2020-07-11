const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator')

exports.crearTarea = async (req, res) => {

    // Validamos el proyecto
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() })
    }

    try {
        // Obtengo el proyecto de la peticion
        const { proyecto } = req.body;

        // Busco que sea un proyecto valido
        const existeProyecto = await Proyecto.findById(proyecto);

        if(!existeProyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        // Verificar que el proyecto pertenezca al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Crear tarea
        const tarea = new Tarea(req.body);

        // Guardo el proyecto
        await tarea.save();

        // Mensaje de confirmacion
        res.json({ tarea })
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.obtenerTareas = async (req, res) => {

    try {
        // Obtengo el proyecto de la peticion
        const { proyecto } = req.query;

        // Busco que sea un proyecto valido
        const existeProyecto = await Proyecto.findById(proyecto);

        if(!existeProyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        // Verificar que el proyecto pertenezca al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado' });
        }

        const tareas = await Tarea.find({ proyecto }).sort({ estado: 1, nombre: 1 });

        // Mensaje de confirmacion
        res.json({ tareas })
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.actualizarTarea = async (req, res) => {
    try {
        const { proyecto, nombre, estado } = req.body;

        let tarea = await Tarea.findById(req.params.id);
        // Verifico si existe la tarea
        if(!tarea){
            return res.status(404).json({ msg: 'Tarea no encontrada' });
        }

        // Extraigo proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({  msg: 'No autorizado' });
        }

        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, { new: true });

        res.json({ tarea });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarTarea = async (req, res) => {
    try {
        const { proyecto } = req.query;

        let tarea = await Tarea.findById(req.params.id);
        
        // Verifico si existe la tarea
        if(!tarea){
            return res.status(404).json({ msg: 'Tarea no encontrada' });
        }

        // Extraigo proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({  msg: 'No autorizado' });
        }

        // Eliminar proyecto
        await Tarea.findOneAndRemove({_id: req.params.id});

        res.json({msg: 'Tarea eliminada'});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}