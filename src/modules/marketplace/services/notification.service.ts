import { getRepository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dtos/notification.dto';

class NotificationService {

  private notificationRepository = getRepository(Notification);

  async createNotification(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId: dto.userId,
      type: dto.type,
      message: dto.message,
      read: false,
    });
    return this.notificationRepository.save(notification);
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId, read: false },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: number): Promise<Notification> {

    const notification = await NotificationRepository.findOne({

    const notification = await this.notificationRepository.findOne({

      where: { id: notificationId },
    });
    if (!notification) {
      throw new Error('Notification not found');
    }
    notification.read = true;
    return this.notificationRepository.save(notification);
  }
}

export default new NotificationService();
