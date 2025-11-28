import axios from 'axios';

const API_KEY = 'AIzaSyBM620ACuvSeRehQ3hPVUAJBkBFUWz62FI';

export async function askGemini(prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta2/models/gemini-pro:generateContent?key=${API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  try {
    const response = await axios.post(url, body);
    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts &&
      response.data.candidates[0].content.parts[0] &&
      response.data.candidates[0].content.parts[0].text
    ) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      return 'Gemini respondió sin contenido.';
    }
  } catch (error: any) {
    if (error.response) {
      // Error de respuesta HTTP
      return `Error Gemini: ${error.response.status} - ${error.response.data?.error?.message || 'Sin mensaje'}`;
    } else if (error.request) {
      // No hubo respuesta
      return 'Error Gemini: No se recibió respuesta del servidor.';
    } else {
      // Otro error
      return `Error Gemini: ${error.message}`;
    }
  }
}
