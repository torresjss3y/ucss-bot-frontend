import React, { useState, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { enviarMensajeChat } from "@/services/chatService";

interface Mensaje {
  id: string;
  texto: string;
  emisor: "usuario" | "bot";
}

export default function HomeScreen() {
  const [inputMensaje, setInputMensaje] = useState("");
  const [chatLog, setChatLog] = useState<Mensaje[]>([
    {
      id: "1",
      texto: "¡Hola! Soy tu ChatBoot UCSS. ¿En qué te puedo ayudar hoy?",
      emisor: "bot",
    },
  ]);
  const [cargando, setCargando] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const enviarMensaje = async () => {
    if (!inputMensaje.trim() || cargando) return;

    const textoAEnviar = inputMensaje.trim();
    const mensajeUsuario: Mensaje = {
      id: Date.now().toString(),
      texto: textoAEnviar,
      emisor: "usuario",
    };

    setChatLog((prev) => [...prev, mensajeUsuario]);
    setInputMensaje("");
    setCargando(true);

    try {
      // Uso de la función importada en lugar de axios directo
      const respuestaBot = await enviarMensajeChat(textoAEnviar);

      const mensajeBot: Mensaje = {
        id: (Date.now() + 1).toString(),
        texto: respuestaBot,
        emisor: "bot",
      };
      setChatLog((prev) => [...prev, mensajeBot]);
    } catch (error) {
      const errorBot: Mensaje = {
        id: (Date.now() + 1).toString(),
        texto: "Error al conectar con el servidor",
        emisor: "bot",
      };
      setChatLog((prev) => [...prev, errorBot]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        >
          {/* Encabezado */}
          <ThemedView style={styles.header}>
            <ThemedText type="subtitle" style={styles.title}>
              ChatBoot UCSS
            </ThemedText>
          </ThemedView>

          {/* Lista de mensajes */}
          <FlatList
            ref={flatListRef}
            data={chatLog}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={styles.chatContainer}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            renderItem={({ item }) => (
              <View
                style={[
                  styles.burbuja,
                  item.emisor === "usuario" ? styles.usuario : styles.bot,
                ]}
              >
                <ThemedText
                  style={
                    item.emisor === "usuario"
                      ? styles.textoUsuario
                      : styles.textoBot
                  }
                >
                  {item.texto}
                </ThemedText>
              </View>
            )}
          />

          {/* Campo de entrada de texto */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un mensaje..."
              placeholderTextColor="#888"
              value={inputMensaje}
              onChangeText={setInputMensaje}
              onSubmitEditing={enviarMensaje}
            />
            <TouchableOpacity
              style={styles.botonIcono}
              onPress={enviarMensaje}
              disabled={cargando}
            >
              {cargando ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="send" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Cambiado de "row" a "column" para apilar correctamente en pantallas anchas
    flexDirection: "column",
  },
  safeArea: {
    flex: 1,
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.three,
    // Centra todo el bloque de la app en la pantalla web
    alignSelf: "center",
  },
  header: {
    paddingVertical: Spacing.three,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    textAlign: "center",
  },
  list: {
    flex: 1,
  },
  chatContainer: {
    paddingVertical: Spacing.three,
  },
  burbuja: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    marginBottom: Spacing.two,
    maxWidth: "80%",
  },
  usuario: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  bot: {
    backgroundColor: "#E5E5EA",
    alignSelf: "flex-start",
  },
  textoUsuario: {
    color: "#FFFFFF",
  },
  textoBot: {
    color: "#000000",
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: Spacing.two,
    gap: Spacing.two,
    alignItems: "center",
    width: "100%",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    height: 44,
    color: "#000",
    backgroundColor: "#fff",
  },
  botonIcono: {
    backgroundColor: "#007AFF",
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
});
