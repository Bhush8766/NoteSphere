export const showNotification = (title, message) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
    });
  }
};