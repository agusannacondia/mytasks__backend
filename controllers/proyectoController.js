const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator')

exports.crearProyecto = async (req, res) => {

    // Validamos el proyecto
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() })
    }

    try {
        // Crear proyecto
        const proyecto = new Proyecto(req.body);

        // Obtener el credaor con JWT
        proyecto.creador = req.usuario.id;

        // Guardo el proyecto
        proyecto.save();

        // Mensaje de confirmacion
        res.json(proyecto)
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.obtenerProyectos = async (req, res) => {

    try {
        let usuario = req.usuario.id;

        const proyectos = await Proyecto.find({ creador: usuario }).sort({ fechaCreacion: -1 });

        // Mensaje de confirmacion
        res.json({ proyectos })
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.actualizarProyecto = async (req, res) => {

    // Validamos el proyecto
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() })
    }

    // Extraer informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        let proyecto = await Proyecto.findById(req.params.id);

        // Verifico si existe el proyecto
        if(!proyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Verifico que coincide el proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado' });
        }

        proyecto = Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });

        res.json({ proyecto });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarProyecto = async (req, res) => {

    try {
        let proyecto = await Proyecto.findById(req.params.id);
        console.log(proyecto);
        // Verifico si existe el proyecto
        if(!proyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Verifico que coincide el proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado' });
        }

        await Proyecto.findOneAndRemove({ _id : req.params.id });
        res.json({ msg: 'Proyecto eliminado '})
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}