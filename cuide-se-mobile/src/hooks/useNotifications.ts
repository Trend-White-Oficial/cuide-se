import { useState } from 'react';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = () => {
    // Placeholder logic for fetching notifications
    setNotifications([{ id: 1, message: 'Nova notificação' }]);
  };

  return { notifications, fetchNotifications };
};

export default useNotifications;