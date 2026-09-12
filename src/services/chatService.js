import { Platform } from "react-native";

// URL pública de producción en Render
const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
  "https://ucss-boot-backend.onrender.com/api/chat";

export const enviarMensajeChat = async (mensaje) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mensaje }),
    });

    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor: ${response.status}`);
    }

    const data = await response.json();
    return data.respuesta;
  } catch (error) {
    console.error("Error al conectar con la API:", error);
    throw error;
  }
};
