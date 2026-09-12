import React, { useState } from "react";
import { enviarMensajeChat } from "../services/chatService";

export const ChatBot = () => {
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!input.trim() || cargando) return;

    const mensajeUsuario = input.trim();
    setInput("");

    // Agregar mensaje del usuario al chat
    const nuevosMensajes = [
      ...mensajes,
      { emisor: "usuario", texto: mensajeUsuario },
    ];
    setMensajes(nuevosMensajes);
    setCargando(true);

    try {
      // Llamada al backend de FastAPI
      const respuestaBot = await enviarMensajeChat(mensajeUsuario);

      setMensajes([...nuevosMensajes, { emisor: "bot", texto: respuestaBot }]);
    } catch (error) {
      setMensajes([
        ...nuevosMensajes,
        {
          emisor: "bot",
          texto: "Lo siento, ocurrió un error al comunicarse con el servidor.",
        },
      ]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {mensajes.map((m, index) => (
          <div
            key={index}
            style={{
              textAlign: m.emisor === "usuario" ? "right" : "left",
              margin: "8px 0",
            }}
          >
            <span
              style={{
                background: m.emisor === "usuario" ? "#007bff" : "#e9ecef",
                color: m.emisor === "usuario" ? "#fff" : "#000",
                padding: "8px 12px",
                borderRadius: "12px",
                display: "inline-block",
              }}
            >
              {m.texto}
            </span>
          </div>
        ))}
        {cargando && (
          <p style={{ fontStyle: "italic", color: "#666" }}>
            El bot está escribiendo...
          </p>
        )}
      </div>

      <form onSubmit={manejarEnvio} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu consulta sobre la UCSS..."
          style={{ flex: 1, padding: "10px" }}
        />
        <button
          type="submit"
          disabled={cargando}
          style={{ padding: "10px 20px" }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};
