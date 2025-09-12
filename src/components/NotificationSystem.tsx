import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, type: "spring" }}
            className={`
              max-w-sm bg-white rounded-lg shadow-lg border-l-4 p-4
              ${notification.type === 'success' ? 'border-green-500' : ''}
              ${notification.type === 'error' ? 'border-red-500' : ''}
              ${notification.type === 'warning' ? 'border-yellow-500' : ''}
              ${notification.type === 'info' ? 'border-blue-500' : ''}
            `}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {notification.type === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                {notification.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-bold text-gray-900 font-kids">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 font-kids">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => onRemove(notification.id)}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// 通知管理器Hook
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // 自动移除通知
    const duration = notification.duration || 5000;
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'success', title, message, duration });
  };

  const showError = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'error', title, message, duration });
  };

  const showInfo = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'info', title, message, duration });
  };

  const showWarning = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'warning', title, message, duration });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};

export default NotificationSystem;
