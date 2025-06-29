/**
 * 🧪 TESTS UNITAIRES POUR VALIDATEURS DE NOTIFICATIONS
 * Tests complets avec coverage des edge cases
 * 
 * @fileoverview Suite de tests complète pour valider le bon fonctionnement
 * des validateurs de notifications avec tous les cas de figure possibles.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  NotificationValidators,
  notificationValidators,
  isEbiosNotification,
  isNotificationAction,
  isNotificationContext,
  isNotificationEvent,
  isValidNotificationType,
  isValidNotificationCategory,
  isValidNotificationPriority,
  isValidNotificationStatus
} from '../../utils/notificationValidators';
import type {
  EbiosNotification,
  NotificationAction,
  NotificationContext,
  NotificationEvent,
  CreateNotificationInput
} from '../../types';

describe('NotificationValidators', () => {
  let validators: NotificationValidators;

  beforeEach(() => {
    validators = NotificationValidators.getInstance();
  });

  describe('Type Guards', () => {
    describe('isEbiosNotification', () => {
      it('should validate a complete valid notification', () => {
        const validNotification: EbiosNotification = {
          id: 'test-123',
          type: 'success',
          category: 'workshop',
          priority: 'medium',
          status: 'unread',
          title: 'Test Notification',
          message: 'This is a test message',
          actions: [],
          context: {},
          createdAt: '2024-01-01T10:00:00.000Z',
          source: 'test',
          tags: ['test']
        };

        expect(isEbiosNotification(validNotification)).toBe(true);
      });

      it('should reject notification with missing required fields', () => {
        const invalidNotification = {
          id: 'test-123',
          type: 'success',
          // missing other required fields
        };

        expect(isEbiosNotification(invalidNotification)).toBe(false);
      });

      it('should reject notification with invalid types', () => {
        const invalidNotification = {
          id: 123, // should be string
          type: 'success',
          category: 'workshop',
          priority: 'medium',
          status: 'unread',
          title: 'Test',
          message: 'Test',
          actions: [],
          context: {},
          createdAt: '2024-01-01T10:00:00.000Z',
          source: 'test',
          tags: ['test']
        };

        expect(isEbiosNotification(invalidNotification)).toBe(false);
      });

      it('should reject null or undefined', () => {
        expect(isEbiosNotification(null)).toBe(false);
        expect(isEbiosNotification(undefined)).toBe(false);
        expect(isEbiosNotification({})).toBe(false);
      });
    });

    describe('isNotificationAction', () => {
      it('should validate a complete valid action', () => {
        const validAction: NotificationAction = {
          id: 'test-action',
          label: 'Test Action',
          type: 'primary',
          icon: '🔔',
          url: '/test',
          external: false
        };

        expect(isNotificationAction(validAction)).toBe(true);
      });

      it('should validate minimal valid action', () => {
        const minimalAction = {
          id: 'test',
          label: 'Test',
          type: 'secondary'
        };

        expect(isNotificationAction(minimalAction)).toBe(true);
      });

      it('should reject action with invalid type', () => {
        const invalidAction = {
          id: 'test',
          label: 'Test',
          type: 'invalid-type'
        };

        expect(isNotificationAction(invalidAction)).toBe(false);
      });

      it('should reject action with missing required fields', () => {
        const invalidAction = {
          id: 'test'
          // missing label and type
        };

        expect(isNotificationAction(invalidAction)).toBe(false);
      });
    });

    describe('isNotificationContext', () => {
      it('should validate empty context', () => {
        expect(isNotificationContext({})).toBe(true);
      });

      it('should validate complete context', () => {
        const validContext: NotificationContext = {
          missionId: 'mission-123',
          workshopId: 1,
          stepId: 'step-1',
          reportId: 'report-123',
          moduleId: 'module-123',
          userId: 'user-123',
          sessionId: 'session-123',
          errorCode: 'ERR_001',
          metadata: { key: 'value' }
        };

        expect(isNotificationContext(validContext)).toBe(true);
      });

      it('should reject context with invalid types', () => {
        const invalidContext = {
          missionId: 123, // should be string
          workshopId: 'invalid' // should be number
        };

        expect(isNotificationContext(invalidContext)).toBe(false);
      });
    });

    describe('isNotificationEvent', () => {
      it('should validate complete valid event', () => {
        const validEvent: NotificationEvent = {
          type: 'created',
          notificationId: 'notif-123',
          timestamp: '2024-01-01T10:00:00.000Z',
          actionId: 'action-123',
          metadata: { key: 'value' }
        };

        expect(isNotificationEvent(validEvent)).toBe(true);
      });

      it('should validate minimal valid event', () => {
        const minimalEvent = {
          type: 'created',
          notificationId: 'notif-123',
          timestamp: '2024-01-01T10:00:00.000Z'
        };

        expect(isNotificationEvent(minimalEvent)).toBe(true);
      });

      it('should reject event with missing required fields', () => {
        const invalidEvent = {
          type: 'created'
          // missing notificationId and timestamp
        };

        expect(isNotificationEvent(invalidEvent)).toBe(false);
      });
    });
  });

  describe('Enum Validators', () => {
    describe('isValidNotificationType', () => {
      it('should validate all valid types', () => {
        const validTypes = ['info', 'success', 'warning', 'error', 'action', 'achievement', 'reminder', 'update'];
        validTypes.forEach(type => {
          expect(isValidNotificationType(type)).toBe(true);
        });
      });

      it('should reject invalid types', () => {
        expect(isValidNotificationType('invalid')).toBe(false);
        expect(isValidNotificationType('')).toBe(false);
        expect(isValidNotificationType(null)).toBe(false);
        expect(isValidNotificationType(123)).toBe(false);
      });
    });

    describe('isValidNotificationCategory', () => {
      it('should validate all valid categories', () => {
        const validCategories = ['formation', 'workshop', 'validation', 'report', 'sync', 'collaboration', 'system', 'security'];
        validCategories.forEach(category => {
          expect(isValidNotificationCategory(category)).toBe(true);
        });
      });

      it('should reject invalid categories', () => {
        expect(isValidNotificationCategory('invalid')).toBe(false);
        expect(isValidNotificationCategory('')).toBe(false);
        expect(isValidNotificationCategory(null)).toBe(false);
      });
    });

    describe('isValidNotificationPriority', () => {
      it('should validate all valid priorities', () => {
        const validPriorities = ['low', 'medium', 'high', 'urgent'];
        validPriorities.forEach(priority => {
          expect(isValidNotificationPriority(priority)).toBe(true);
        });
      });

      it('should reject invalid priorities', () => {
        expect(isValidNotificationPriority('invalid')).toBe(false);
        expect(isValidNotificationPriority('critical')).toBe(false);
        expect(isValidNotificationPriority(1)).toBe(false);
      });
    });

    describe('isValidNotificationStatus', () => {
      it('should validate all valid statuses', () => {
        const validStatuses = ['unread', 'read', 'archived', 'dismissed'];
        validStatuses.forEach(status => {
          expect(isValidNotificationStatus(status)).toBe(true);
        });
      });

      it('should reject invalid statuses', () => {
        expect(isValidNotificationStatus('invalid')).toBe(false);
        expect(isValidNotificationStatus('pending')).toBe(false);
        expect(isValidNotificationStatus(true)).toBe(false);
      });
    });
  });

  describe('Schema Validation', () => {
    describe('EbiosNotification validation', () => {
      it('should validate complete valid notification', () => {
        const validData = {
          id: 'test-123',
          type: 'success',
          category: 'workshop',
          priority: 'medium',
          status: 'unread',
          title: 'Test Notification',
          message: 'This is a test message',
          actions: [],
          context: {},
          createdAt: '2024-01-01T10:00:00.000Z',
          source: 'test',
          tags: ['test']
        };

        const result = validators.validateAndSanitize('EbiosNotification', validData);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
        expect(result.data).toEqual(validData);
      });

      it('should reject notification with missing required fields', () => {
        const invalidData = {
          type: 'success',
          category: 'workshop'
          // missing other required fields
        };

        const result = validators.validateAndSanitize('EbiosNotification', invalidData);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors.some(e => e.field === 'id')).toBe(true);
        expect(result.errors.some(e => e.field === 'title')).toBe(true);
        expect(result.errors.some(e => e.field === 'message')).toBe(true);
      });

      it('should generate warnings for long content', () => {
        const dataWithLongContent = {
          id: 'test-123',
          type: 'success',
          category: 'workshop',
          priority: 'medium',
          status: 'unread',
          title: 'A'.repeat(150), // Very long title
          message: 'B'.repeat(600), // Very long message
          actions: [],
          context: {},
          createdAt: '2024-01-01T10:00:00.000Z',
          source: 'test',
          tags: ['test']
        };

        const result = validators.validateAndSanitize('EbiosNotification', dataWithLongContent);
        expect(result.warnings.length).toBeGreaterThan(0);
        expect(result.warnings.some(w => w.includes('titre'))).toBe(true);
        expect(result.warnings.some(w => w.includes('message'))).toBe(true);
      });

      it('should validate actions array', () => {
        const dataWithInvalidActions = {
          id: 'test-123',
          type: 'success',
          category: 'workshop',
          priority: 'medium',
          status: 'unread',
          title: 'Test',
          message: 'Test',
          actions: [
            { id: 'valid', label: 'Valid', type: 'primary' },
            { id: 'invalid' } // missing required fields
          ],
          context: {},
          createdAt: '2024-01-01T10:00:00.000Z',
          source: 'test',
          tags: ['test']
        };

        const result = validators.validateAndSanitize('EbiosNotification', dataWithInvalidActions);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.field.includes('actions[1]'))).toBe(true);
      });

      it('should validate date formats', () => {
        const dataWithInvalidDates = {
          id: 'test-123',
          type: 'success',
          category: 'workshop',
          priority: 'medium',
          status: 'unread',
          title: 'Test',
          message: 'Test',
          actions: [],
          context: {},
          createdAt: 'invalid-date',
          readAt: '2024-13-45T25:70:80.000Z', // Invalid date
          source: 'test',
          tags: ['test']
        };

        const result = validators.validateAndSanitize('EbiosNotification', dataWithInvalidDates);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.field === 'createdAt')).toBe(true);
        expect(result.errors.some(e => e.field === 'readAt')).toBe(true);
      });
    });

    describe('CreateNotificationInput validation', () => {
      it('should validate valid input', () => {
        const validInput: CreateNotificationInput = {
          type: 'success',
          category: 'workshop',
          priority: 'medium',
          title: 'Test Notification',
          message: 'This is a test message',
          actions: [],
          context: {},
          source: 'test',
          tags: ['test']
        };

        const result = validators.validateAndSanitize('CreateNotificationInput', validInput);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should reject input with invalid enums', () => {
        const invalidInput = {
          type: 'invalid-type',
          category: 'invalid-category',
          priority: 'invalid-priority',
          title: 'Test',
          message: 'Test',
          actions: [],
          context: {},
          source: 'test',
          tags: ['test']
        };

        const result = validators.validateAndSanitize('CreateNotificationInput', invalidInput);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.field === 'type')).toBe(true);
        expect(result.errors.some(e => e.field === 'category')).toBe(true);
        expect(result.errors.some(e => e.field === 'priority')).toBe(true);
      });
    });

    describe('NotificationAction validation', () => {
      it('should validate complete action', () => {
        const validAction = {
          id: 'test-action',
          label: 'Test Action',
          type: 'primary',
          icon: '🔔',
          url: '/test'
        };

        const result = validators.validateAndSanitize('NotificationAction', validAction);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should warn about actions without URL or callback', () => {
        const actionWithoutUrlOrCallback = {
          id: 'test-action',
          label: 'Test Action',
          type: 'primary'
        };

        const result = validators.validateAndSanitize('NotificationAction', actionWithoutUrlOrCallback);
        expect(result.isValid).toBe(true);
        expect(result.warnings.some(w => w.includes('sans URL ni callback'))).toBe(true);
      });
    });

    describe('NotificationContext validation', () => {
      it('should validate empty context', () => {
        const result = validators.validateAndSanitize('NotificationContext', {});
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should warn about workshopId out of EBIOS range', () => {
        const contextWithInvalidWorkshop = {
          workshopId: 10 // Out of EBIOS range (1-5)
        };

        const result = validators.validateAndSanitize('NotificationContext', contextWithInvalidWorkshop);
        expect(result.isValid).toBe(true);
        expect(result.warnings.some(w => w.includes('hors de la plage EBIOS'))).toBe(true);
      });

      it('should reject context with invalid types', () => {
        const invalidContext = {
          missionId: 123, // should be string
          workshopId: 'invalid' // should be number
        };

        const result = validators.validateAndSanitize('NotificationContext', invalidContext);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.field === 'missionId')).toBe(true);
        expect(result.errors.some(e => e.field === 'workshopId')).toBe(true);
      });
    });

    describe('NotificationEvent validation', () => {
      it('should validate complete event', () => {
        const validEvent = {
          type: 'created',
          notificationId: 'notif-123',
          timestamp: '2024-01-01T10:00:00.000Z',
          actionId: 'action-123',
          metadata: { key: 'value' }
        };

        const result = validators.validateAndSanitize('NotificationEvent', validEvent);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should reject event with invalid timestamp', () => {
        const invalidEvent = {
          type: 'created',
          notificationId: 'notif-123',
          timestamp: 'invalid-timestamp'
        };

        const result = validators.validateAndSanitize('NotificationEvent', invalidEvent);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.field === 'timestamp')).toBe(true);
      });
    });
  });

  describe('Sanitization', () => {
    it('should trim and limit string lengths', () => {
      const dataWithExtraSpaces = {
        id: '  test-123  ',
        type: 'success',
        category: 'workshop',
        priority: 'medium',
        status: 'unread',
        title: '  ' + 'A'.repeat(150) + '  ', // Long title with spaces
        message: '  ' + 'B'.repeat(600) + '  ', // Long message with spaces
        actions: [],
        context: {},
        createdAt: '2024-01-01T10:00:00.000Z',
        source: 'test',
        tags: ['test', '', 'valid']
      };

      const result = validators.validateAndSanitize('EbiosNotification', dataWithExtraSpaces);
      expect(result.data?.title).toHaveLength(100); // Trimmed to max length
      expect(result.data?.message).toHaveLength(500); // Trimmed to max length
      expect(result.data?.tags).toEqual(['test', 'valid']); // Empty string filtered out
    });

    it('should filter invalid actions', () => {
      const dataWithMixedActions = {
        id: 'test-123',
        type: 'success',
        category: 'workshop',
        priority: 'medium',
        status: 'unread',
        title: 'Test',
        message: 'Test',
        actions: [
          { id: 'valid', label: 'Valid', type: 'primary' },
          { invalid: 'action' }, // Invalid action
          { id: 'valid2', label: 'Valid 2', type: 'secondary' }
        ],
        context: {},
        createdAt: '2024-01-01T10:00:00.000Z',
        source: 'test',
        tags: ['test']
      };

      const result = validators.validateAndSanitize('EbiosNotification', dataWithMixedActions);
      expect(result.data?.actions).toHaveLength(2); // Only valid actions kept
    });
  });

  describe('Error Handling', () => {
    it('should handle unknown schema gracefully', () => {
      const result = validators.validateAndSanitize('UnknownSchema', {});
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('SCHEMA_NOT_FOUND');
    });

    it('should provide detailed error information', () => {
      const invalidData = {
        id: '', // Empty string
        type: 'invalid-type',
        // missing other fields
      };

      const result = validators.validateAndSanitize('EbiosNotification', invalidData);
      expect(result.isValid).toBe(false);
      
      result.errors.forEach(error => {
        expect(error).toHaveProperty('field');
        expect(error).toHaveProperty('message');
        expect(error).toHaveProperty('code');
        expect(error).toHaveProperty('severity');
        expect(['error', 'warning']).toContain(error.severity);
      });
    });
  });

  describe('Utility Methods', () => {
    it('should return available schemas', () => {
      const schemas = validators.getAvailableSchemas();
      expect(schemas).toContain('EbiosNotification');
      expect(schemas).toContain('CreateNotificationInput');
      expect(schemas).toContain('NotificationAction');
      expect(schemas).toContain('NotificationContext');
      expect(schemas).toContain('NotificationEvent');
    });

    it('should perform quick validation with type guards', () => {
      const validNotification = {
        id: 'test',
        type: 'success',
        category: 'workshop',
        priority: 'medium',
        status: 'unread',
        title: 'Test',
        message: 'Test',
        actions: [],
        context: {},
        createdAt: '2024-01-01T10:00:00.000Z',
        source: 'test',
        tags: ['test']
      };

      const isValid = validators.quickValidate(validNotification, isEbiosNotification);
      expect(isValid).toBe(true);

      const isInvalid = validators.quickValidate({}, isEbiosNotification);
      expect(isInvalid).toBe(false);
    });
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = NotificationValidators.getInstance();
      const instance2 = NotificationValidators.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should use the global instance', () => {
      expect(notificationValidators).toBe(NotificationValidators.getInstance());
    });
  });
});
