import OpenAI from 'openai';

async function IAInfo() {
    const message = [
        {
            role: "system",
            content: `
                Eres InterviewSim, un programa que proporciona información estadística sobre las entrevistas técnicas en países de Latinoamérica o de todo el mundo.
                Tu tarea es devolver los datos de las entrevistas técnicas en el siguiente formato JSON:
                {
                    "data": [
                        {
                            "country": "Nombre del país",
                            "totalInterviews": "Número total de entrevistas técnicas en este país"
                        },
                        ...
                    ]
                }
                Asegúrate de que los datos proporcionados sean coherentes y detallados, representando tanto países específicos`
        },
    ];

    const openai = new OpenAI({ apiKey: process.env.TOKEN_OPENAI });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: message,
            max_tokens: 1000,
        });

        // Usar una estrategia de limpieza del JSON antes de parsearlo
        const responseText = completion.choices[0].message.content;

        // Limpiar comillas simples o caracteres innecesarios (opcional, dependiendo del error que estás viendo)
        const cleanResponse = responseText.replace(/'/g, '"').trim();

        // Validar si el resultado es JSON válido
        const parsedResponse = JSON.parse(cleanResponse);

        return parsedResponse;

    } catch (error) {
        console.error("Error al generar las recomendaciones:", error);
        return { error: "Hubo un error al generar la información." };
    }
}

export default IAInfo;
