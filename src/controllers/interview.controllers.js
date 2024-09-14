import Interview from '../models/interview.model.js';
import IA from '../IA.js';
import User from '../models/user.model.js';
import Teacher from '../models/teacher.model.js';
import IARecomendacionEntrevista from '../IARecomendacionEntrevista.js';
import IAInfo from '../IAInfoTiempoReal.js';

//crear entrevista
export const createInterview = async (req, res) => {
    const { title, description, empresa, Dificultad, userId, tipoEntrevista, opciones, codigoBase } = req.body;

    const teacherId = req.userId || userId;
    if (!teacherId) {
        return res.status(400).json({ message: 'El ID del profesor es obligatorio.' });
    }

    try {
        const interviewData = {
            title,
            description,
            empresa,
            teacher: teacherId,
            Dificultad,
            tipoEntrevista,
        };

        if (tipoEntrevista === 'opcionMultiple') {
            interviewData.opciones = opciones;
        } else if (tipoEntrevista === 'programacion') {
            interviewData.codigoBase = codigoBase;
        }

        const newInterview = new Interview(interviewData);
        const interviewSaved = await newInterview.save();

        // Crear un mensaje detallado para la acción
        const actionMessage = `El profesor ha creado una nueva entrevista: "${title}" con una dificultad de "${Dificultad}" para la empresa "${empresa}".`;

        // Buscar al profesor y agregar la acción a su lista de acciones
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }
        teacher.accionesEntrevistasTeacher.push(actionMessage);
        await teacher.save();

        res.json(interviewSaved);
        console.log('Entrevista creada:', interviewSaved);
    } catch (error) {
        console.error('Error al crear entrevista:', error);
        res.status(500).json({ message: error.message });
    }
};


//traer todas las entrevistas
export const getInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find();
        res.json(interviews);
    } catch (error) {
        console.error('Error al obtener entrevistas:', error);
        res.status(500).json({ message: error.message });
    }
};


//traer entrevista por id
export const getInterviewById = async (req, res) => {
    const interviewId = req.params.id;
    try {
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ message: 'Entrevista no encontrada' });
        }
        const IAresult = await IA(interview);
        res.status(200).json({ interview, IAresult , tipoEntrevista: interview.tipoEntrevista }); 
    } catch (error) {
        console.error('Error al obtener entrevista por ID:', error);
        res.status(500).json({ message: error.message });
    }
};

//Traer entrevistas por profesor
export const getInterviewsByTeacher = async (req, res) => {
    const teacherId = req.params.id;
    try {
      const interviews = await Interview.find({ teacher: teacherId });
      res.json(interviews);
    } catch (error) {
      console.error('Error al obtener entrevistas por profesor:', error);
      res.status(500).json({ message: error.message });
    }
};


//Eliminar entrevista por id
export const deleteInterviewById = async (req, res) => {
    const interviewId = req.params.id;
    try {
        const interview = await Interview.findByIdAndDelete(interviewId);
        if (!interview) {
            return res.status(404).json({ message: 'Entrevista no encontrada' });
        }
        res.json({ message: 'Entrevista eliminada' });
    } catch (error) {
        console.error('Error al eliminar entrevista por ID:', error);
        res.status(500).json({ message: error.message });
    }
};


//Calificar entrevista
export const calificarEntrevista = async (req, res) => {
    const { respuestaIA, respuestaUser, userID, nombreEntrevista, dificultad } = req.body;
    console.log("respuestas de la entrevista: ", respuestaIA, respuestaUser, userID);

    // Inicializar el puntaje
    let score = 0;

    // Recorrer las respuestas del usuario y las respuestas correctas
    respuestaUser.forEach((respuesta, index) => {
        if (respuesta === respuestaIA[index]) {
            score++;
        }
    });

    // Construir la cadena descriptiva de la calificación
    const calificacionDescripcion = `Obtuviste ${score} de ${respuestaIA.length} en la entrevista "${nombreEntrevista}" con una dificultad de "${dificultad}". ¡Sigue así y continúa mejorando!`;

    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Inicializar calificacionesEntrevistas si no está definido
        if (!user.calificacionesEntrevistas) {
            user.calificacionesEntrevistas = [];
        }

        // Agregar la nueva calificación
        user.calificacionesEntrevistas.push(calificacionDescripcion);
        await user.save();

        //enviar recomendaciones de fallas en la entrevista

        // Enviar el puntaje de vuelta al frontend
        res.status(200).json({ message: "Calificación completada", score, total: respuestaIA.length });
    } catch (error) {
        console.error('Error al guardar la calificación:', error);
        res.status(500).json({ message: "Error al guardar la calificación" });
    }
};


// Obtener recomendaciones de la IA
export const obtenerRecomendaciones = async (req, res) => {
    const { preguntas, respuestaUser, respuestaIA } = req.body;
    try {
        const recomendaciones = await IARecomendacionEntrevista({
            Preguntas: preguntas,
            Respuestas: respuestaUser,
            RespuestasCorrectas: respuestaIA
        });
        res.status(200).json({ recomendaciones });
    } catch (error) {
        console.error('Error al obtener recomendaciones de la IA:', error);
        res.status(500).json({ message: "Error al obtener recomendaciones de la IA" });
    }
};

export const mostrarInfo = async (req, res) => {
    try {
        const info = await IAInfo();

        if (!info || !info.data || !Array.isArray(info.data)) {
            return res.status(500).json({ message: "Formato incorrecto de la respuesta de la IA" });
        }

        res.status(200).json({ info });
    } catch (error) {
        console.error('Error al obtener información de la IA:', error);
        res.status(500).json({ message: "Error al obtener información de la IA", error: error.message });
    }
};
