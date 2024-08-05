self.addEventListener("install", function (event) {
  // 서비스 워커 설치 시 활성화
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  // 활성화 단계에서 기존 클라이언트를 제어하도록 설정
  event.waitUntil(clients.claim());
});

self.addEventListener("push", function (event) {
  let data;

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
