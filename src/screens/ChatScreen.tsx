
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Keyboard, useColorScheme } from 'react-native';
import { askGemini } from '../lib/aiClient';
import { saveChatHistory, loadChatHistory, clearChatHistory } from '../lib/chatStorage';
import { COLORS_LIGHT, COLORS_DARK } from '../theme';
import { scheduleNotification } from '../lib/notificationHelper';
import { createCalendarEvent } from '../lib/calendarHelper';

const SUGERENCIAS = [
  '¿Cuál es mi agenda hoy?',
  'Recomiéndame una rutina de ejercicio',
  '¿Puedes crear una alarma para mañana?',
  '¿Qué lugares cercanos me sugieres?'
];

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

  useEffect(() => {
    (async () => {
      const history = await loadChatHistory();
      if (history.length > 0) {
        setMessages(history);
      } else {
        setMessages([{ sender: 'AlfredIA', text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?' }]);
      }
    })();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
    saveChatHistory(messages);
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'Tú', text: input }]);
    setLoading(true);
    setInput('');
    Keyboard.dismiss();

    // Comandos inteligentes
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('agendar') || lowerInput.includes('cita') || lowerInput.includes('evento')) {
      // Crear evento en calendario para dentro de 1 hora (ejemplo)
      const now = new Date();
      const start = new Date(now.getTime() + 60 * 60 * 1000);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      await createCalendarEvent('Evento AlfredIA', start, end);
      setMessages(prev => [...prev, { sender: 'AlfredIA', text: '¡Evento agendado en tu calendario para dentro de 1 hora!' }]);
      setLoading(false);
      return;
    }
    if (lowerInput.includes('alarma') || lowerInput.includes('despertar') || lowerInput.includes('recordatorio')) {
      // Crear notificación local para dentro de 1 minuto (ejemplo)
      const now = new Date();
      const trigger = new Date(now.getTime() + 60 * 1000);
      await scheduleNotification('Alarma AlfredIA', '¡Es hora de tu alarma!', trigger);
      setMessages(prev => [...prev, { sender: 'AlfredIA', text: '¡Alarma creada! Te avisaré en 1 minuto.' }]);
      setLoading(false);
      return;
    }

    try {
      const aiResponse = await askGemini(input);
      setMessages(prev => [...prev, { sender: 'AlfredIA', text: aiResponse }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyPress = ({ nativeEvent }: any) => {
    if (nativeEvent.key === 'Enter') {
      handleSend();
    }
  };

  const handleClear = async () => {
    setMessages([{ sender: 'AlfredIA', text: 'Historial borrado. ¿En qué puedo ayudarte ahora?' }]);
    await clearChatHistory();
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }] }>
      <ScrollView style={[styles.chatArea, { backgroundColor: themeColors.background }]} ref={scrollRef} accessible accessibilityLabel="Historial de chat">
        {messages.map((msg, idx) => (
          <View key={idx} style={msg.sender === 'Tú' ? [styles.userMsg, { backgroundColor: colorScheme === 'dark' ? '#334155' : '#e0f7fa' }] : [styles.aiMsg, { backgroundColor: colorScheme === 'dark' ? '#23232a' : '#f1f8e9' }] }>
            <Text style={[styles.sender, { color: themeColors.text }]} accessibilityRole="text" accessibilityLabel={`Mensaje de ${msg.sender}`}>{msg.sender}:</Text>
            <Text style={[styles.messageText, { color: themeColors.text }]} accessibilityRole="text" accessibilityLabel={msg.text}>{msg.text}</Text>
          </View>
        ))}
        {loading && (
          <View style={styles.aiMsg}>
            <ActivityIndicator size="small" color="#0f172a" accessibilityLabel="Cargando respuesta" />
            <Text style={{ color: themeColors.primary }}>AlfredIA está pensando...</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.sugerenciasArea}>
        <Text style={[styles.sugerenciasTitle, { color: themeColors.primary }]} accessibilityRole="header">Sugerencias rápidas:</Text>
        <View style={styles.sugerenciasList}>
          {SUGERENCIAS.map((sug, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.sugerenciaBtn}
              onPress={() => setInput(sug)}
              accessible
              accessibilityLabel={`Sugerencia: ${sug}`}
            >
              <Text style={[styles.sugerenciaText, { color: themeColors.secondary }]} accessibilityRole="button">{sug}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.clearBtn, { borderColor: themeColors.border }]}
          onPress={handleClear}
          accessible
          accessibilityLabel="Limpiar chat"
        >
          <Text style={[styles.clearText, { color: themeColors.secondary }]}>Borrar chat</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.inputArea, { backgroundColor: themeColors.surface }] }>
        <TextInput
          style={[styles.input, { color: themeColors.text, borderColor: themeColors.border, backgroundColor: themeColors.surface } ]}
          value={input}
          onChangeText={setInput}
          placeholder="Escribe tu mensaje..."
          onSubmitEditing={handleSend}
          onKeyPress={handleInputKeyPress}
          accessible
          accessibilityLabel="Campo para escribir mensaje"
          accessibilityHint="Escribe y envía un mensaje a AlfredIA"
          returnKeyType="send"
        />
        {/* Botón de voz eliminado por incompatibilidad de módulo nativo en Expo Go */}
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: themeColors.primary }, loading && { backgroundColor: themeColors.muted }]}
          onPress={handleSend}
          disabled={loading}
          accessible
          accessibilityLabel="Enviar mensaje"
        >
          <Text style={[styles.sendBtnText, { color: themeColors.text }]} accessibilityRole="button">{loading ? 'Enviando...' : 'Enviar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  chatArea: { flex: 1, marginBottom: 10 },
  inputArea: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginRight: 8, fontSize: 16 },
  userMsg: { alignSelf: 'flex-end', backgroundColor: '#e0f7fa', borderRadius: 5, marginVertical: 2, padding: 6, maxWidth: '80%' },
  aiMsg: { alignSelf: 'flex-start', backgroundColor: '#f1f8e9', borderRadius: 5, marginVertical: 2, padding: 6, maxWidth: '80%' },
  sender: { fontWeight: 'bold', marginBottom: 2, color: '#222', fontSize: 18 },
  messageText: { fontSize: 16, color: '#222', lineHeight: 22 },
  sendBtn: { backgroundColor: '#0f172a', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 6, marginLeft: 6 },
  sendBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  sugerenciasArea: { marginBottom: 8 },
  sugerenciasTitle: { fontWeight: 'bold', marginBottom: 4, color: '#0f172a' },
  sugerenciasList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  sugerenciaBtn: { backgroundColor: '#e0e7ff', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12, marginRight: 6, marginBottom: 6 },
  sugerenciaText: { color: '#3730a3', fontSize: 13 },
  clearBtn: { marginTop: 6, alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1 },
  clearText: { fontWeight: '600' },
});

export default ChatScreen;
