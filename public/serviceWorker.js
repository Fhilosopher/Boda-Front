self.addEventListener("push", function (event) {
  const data = event.data.json();
  const title = data.title || "알림";
  const options = {
    body: data.body,
    icon: data.icon,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
