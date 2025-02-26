import { Request, Response } from 'express';
import NotificationService from '../services/notification.service';
import {
  CreateNotificationDto,
  MarkNotificationAsReadDto,
} from '../dtos/notification.dto';
import { validate } from 'class-validator';

class NotificationController {
  async createNotification(req: Request, res: Response): Promise<Response> {
    try {
      const dto = Object.assign(new CreateNotificationDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const notification = await NotificationService.createNotification(dto);
      return res.status(201).json(notification);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getUserNotifications(req: Request, res: Response): Promise<Response> {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const notifications =
        await NotificationService.getUserNotifications(userId);
      return res.status(200).json(notifications);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getUnreadNotifications(req: Request, res: Response): Promise<Response> {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const unreadNotifications =
        await NotificationService.getUnreadNotifications(userId);
      return res.status(200).json(unreadNotifications);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async markAsRead(req: Request, res: Response): Promise<Response> {
    try {
      const dto = Object.assign(new MarkNotificationAsReadDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const updatedNotification = await NotificationService.markAsRead(
        dto.notificationId,
      );
      return res.status(200).json(updatedNotification);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new NotificationController();
