import mongoose from 'mongoose';
import { Notification, NotificationType } from '../modules/analytics/notification.model.js';

const inMemoryNotifications: Map<string, any> = new Map();
const isDbConnected = (): boolean => mongoose.connection.readyState === 1;

export class NotificationService {
  static async createNotification(
    type: NotificationType,
    title: string,
    message: string,
    metadata: any = {}
  ): Promise<any> {
    const notificationId = `NOTIF-${Date.now().toString(36).toUpperCase()}`;
    const newNotif = {
      notificationId,
      type,
      title,
      message,
      metadata,
      read: false,
      createdAt: new Date(),
    };

    if (isDbConnected()) {
      try {
        await Notification.create(newNotif);
      } catch (e) {
        inMemoryNotifications.set(notificationId, newNotif);
      }
    } else {
      inMemoryNotifications.set(notificationId, newNotif);
    }

    return newNotif;
  }

  static getInMemoryNotifications(): any[] {
    return Array.from(inMemoryNotifications.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static markInMemoryRead(id: string): void {
    const notif = inMemoryNotifications.get(id);
    if (notif) {
      notif.read = true;
    }
  }
}
