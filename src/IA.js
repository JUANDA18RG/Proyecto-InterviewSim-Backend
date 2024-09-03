import { OPENAI_API_KEY } from './config.js';
import OpenAI from 'openai';

async function IA({title, description,Dificultad}) {
    const message = [
        {
            role: "system",
            content: `Eres InterviewSim, un programa que genera problemas de programación para entrevistas técnicas. Quiero que crees un ejercicio basado en el tema: ${title}. 
                      La descripción del problema es: ${description}. 
                      La dificultad del ejercicio debe ser de nivel ${Dificultad} en una escala de 0 a 5, donde 5 es la máxima complejidad. 
                      El ejercicio debe poner a prueba las habilidades del programador, pero debe ser lo suficientemente conciso para resolverse en un solo archivo o una hoja de código. 
                      Evita problemas que requieran soluciones largas o la necesidad de múltiples archivos. 
                      El ejercicio debe enfocarse en preguntas típicas de entrevistas técnicas o en la práctica directa de programación, y debe poder completarse en aproximadamente 30 minutos en un solo lenguaje de programación.`
        }
    ];
    
    

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: message,
        max_tokens: 500,
    });
    return completion.choices[0].message.content;
}

export default IA;