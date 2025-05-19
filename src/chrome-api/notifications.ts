// requires "notifications" permission in manifest.json

export default class NotificationModel {
  static showBasicNotification({
    title,
    message,
    iconPath,
  }: {
    title: string;
    message: string;
    iconPath: string;
  }) {
    chrome.notifications.create({
      message,
      title: title,
      type: "basic",
      iconUrl: iconPath,
    });
  }

  constructor(public readonly notificationId: string) {}

  async showNotification(options: chrome.notifications.NotificationCreateOptions) {
    return await chrome.notifications.create(this.notificationId, options);
  }

  async clearNotification() {
    return await chrome.notifications.clear(this.notificationId);
  }

  onClicked(callback: () => void) {
    const cb = (notificationId: string) => {
      if (notificationId === this.notificationId) {
        callback();
      }
    };
    NotificationModel.onNotificationClicked(cb);
  }

  onClosed(callback: () => void) {
    const cb = (notificationId: string) => {
      if (notificationId === this.notificationId) {
        callback();
      }
    };
    NotificationModel.onNotificationClosed(cb);
  }

  static onNotificationClicked(callback: (notificationId: string) => void) {
    const cb = (notificationId: string) => {
      callback(notificationId);
    };
    chrome.notifications.onClicked.addListener(cb);
    return cb;
  }

  static onNotificationClosed(callback: (notificationId: string) => void) {
    const cb = (notificationId: string) => {
      callback(notificationId);
    };
    chrome.notifications.onClosed.addListener(cb);
    return cb;
  }
}

/**
 * Examples
 * 
 * 
 * NotificationModel.show({
    message: "Extension installed",
    title: "Extension installed",
    iconUrl: "icon.png",
    type: "basic",
    buttons: [
      {
        title: "View",
      },
    ],
  });
 */
