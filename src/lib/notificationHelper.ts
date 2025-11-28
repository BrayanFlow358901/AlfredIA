import * as Notifications from 'expo-notifications';

export async function scheduleNotification(title: string, body: string, date: Date) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { date },
  });
}
