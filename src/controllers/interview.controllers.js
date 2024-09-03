import Interview from '../models/interview.model.js';
import IA from '../IA.js';


//crear entrevista
export const createInterview = async (req, res) => {
    const { title, description, empresa, Dificultad, userId } = req.body;

    const teacherId = req.userId || userId;
    if (!teacherId) {
        return res.status(400).json({ message: 'El ID del profesor es obligatorio.' });
    }

    try {
        const newInterview = new Interview({
            title,
            description,
            empresa,
            teacher: teacherId,
            Dificultad,
        });

        const interviewSaved = await newInterview.save();
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
        res.status(200).json({ interview, IAresult }); 
    } catch (error) {
        console.error('Error al obtener entrevista por ID:', error);
        res.status(500).json({ message: error.message });
    }
};