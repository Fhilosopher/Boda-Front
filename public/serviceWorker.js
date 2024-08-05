self.addEventListener("push", function (event) {
  let data = event.data.json();
  const title = data.title || "알림";

  try {
    data = event.data.json();
  } catch (e) {
    data = { title: "Notification", body: event.data.text() };
  }

  const options = {
    body: data.body,
    icon: data.icon || "https://i.imgur.com/J490BGB.png",
    badge: data.badge || "https://i.imgur.com/NCVXfsQ.png",
    image: data.image,
    data: {
      url: data.url,
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(
      event.notification.data.url || "https://bodaessay.vercel.app/"
    )
  );
});
