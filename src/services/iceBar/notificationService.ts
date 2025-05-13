
import { IceBar } from '@/types/iceBar';
import { getIceBarsStore, updateIceBarStore } from './dataStore';
import { getAllIceBars } from './queryService';

// Obtener notificaciones no leídas
export const getUnreadNotifications = async (): Promise<{ 
  count: number, 
  bars: IceBar[] 
}> => {
  const allBars = await getAllIceBars();
  
  const barsWithNotifications = allBars.filter(
    bar => bar.notifications.some(notification => !notification.read)
  );
  
  return {
    count: barsWithNotifications.length,
    bars: barsWithNotifications
  };
};

// Marcar notificaciones como leídas
export const markNotificationsAsRead = async (barId: string): Promise<boolean> => {
  const iceBars = getIceBarsStore();
  const barIndex = iceBars.findIndex(bar => bar.id === barId);
  
  if (barIndex === -1) {
    return false;
  }
  
  const bar = { ...iceBars[barIndex] };
  bar.notifications = bar.notifications.map(notification => ({ ...notification, read: true }));
  
  updateIceBarStore(bar);
  
  return true;
};
