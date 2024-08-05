self.addEventListener("push", function (event) {
  const data = event.data.json();
  const title = data.title || "알림";
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    image: data.image,
    data: {
      url: data.url,
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const url = event.notification.data.url;
  alert("URL", url);
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
