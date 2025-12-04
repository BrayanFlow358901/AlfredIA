import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

export async function createCalendarEvent(title: string, startDate: Date, endDate: Date) {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  let calendarId = calendars.find(c => c.allowsModifications)?.id;
  if (!calendarId) {
    // Crear un calendario si no existe
    const defaultSource = Platform.OS === 'ios' ? await Calendar.getDefaultCalendarAsync() : { isLocalAccount: true, name: 'AlfredIA' };
    calendarId = await Calendar.createCalendarAsync({
      title: 'AlfredIA',
      color: 'blue',
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultSource.id,
      source: defaultSource,
      name: 'AlfredIA',
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
  }
  await Calendar.createEventAsync(calendarId, {
    title,
    startDate,
    endDate,
    timeZone: 'local',
    notes: 'Creado por AlfredIA',
  });
}
