import AsyncStorage from '@react-native-async-storage/async-storage';

export const CHAT_STORAGE_KEY = 'alfredia_chat_history';

export async function saveChatHistory(messages: { sender: string; text: string }[]) {
  try {
    await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    // Error al guardar
  }
}

export async function loadChatHistory(): Promise<{ sender: string; text: string }[]> {
  try {
    const data = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    // Error al cargar
  }
  return [];
}
