import { getRepository, Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';


export const NotificationRepository: Repository<Notification> =
  AppDataSource.getRepository(Notification);
export class NotificationRepository {
  private repo: Repository<Notification>;

  constructor() {
    this.repo = getRepository(Notification);
  }

  async create(notificationData: Partial<Notification>): Promise<Notification> {
    const notification = this.repo.create(notificationData);
    return await this.repo.save(notification);
  }

  async findAll(): Promise<Notification[]> {
    return await this.repo.find();
  }

  async findById(id: number): Promise<Notification | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByUserId(userId: number): Promise<Notification[]> {
    return await this.repo.find({ where: { userId } });
  }

  async markAsRead(id: number): Promise<void> {
    await this.repo.update(id, { read: true });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}

