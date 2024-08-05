import React from "react";
import styled from "styled-components";
import Router from "./Router";
import { useState } from "react";
import { instance } from "./api/instance";

const App = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(`${process.env.PUBLIC_URL}/serviceWorker.js`)
        .then(function (registration) {
          console.log("서비스 워커가 등록되었습니다:", registration);
          handlePushNotification();
        })
        .catch(function (error) {
          console.error("서비스 워커 등록 실패:", error);
        });
    });
  }

  const [subscribe, setSubscribe] = useState({
    endpoint: "",
    p256dh: "",
    auth: "",
  });

  const handlePushNotification = async () => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      try {
        // 알림 권한 요청
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          // Service Worker 등록 확인
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            // 푸시 구독 확인
            const subscription =
              await registration.pushManager.getSubscription();
            if (subscription) {
              // 이미 구독된 경우, endpoint와 key를 추출
              const endpoint = subscription.endpoint;
              const key = subscription.getKey("p256dh");
              const auth = subscription.getKey("auth");

              const updatedSubscribe = {
                endpoint: endpoint,
                p256dh: arrayBufferToBase64(key),
                auth: arrayBufferToBase64(auth),
              };
              setSubscribe(updatedSubscribe);
              sendPushNotification(updatedSubscribe);

              console.log("기존 푸시 구독 정보가 존재합니다");
              console.log("Endpoint:", endpoint);
              console.log("p256dh:", key ? arrayBufferToBase64(key) : "없음");
              console.log("Auth:", auth ? arrayBufferToBase64(auth) : "없음");
            } else {
              // 구독이 없는 경우 새로 구독 생성
              const newSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                  "BKd1I8PDrg7zidthfuKgR-0k_-CwlXZk3p1_F1tLWAur3w3lDdSfiAQHFl_cXRi6pguzNe9Akfxrqo25XXXxGZ4"
                ), // VAPID 공개 키
              });

              const endpoint = newSubscription.endpoint;
              const key = newSubscription.getKey("p256dh");
              const auth = newSubscription.getKey("auth");

              const updatedSubscribe = {
                endpoint: endpoint,
                p256dh: arrayBufferToBase64(key),
                auth: arrayBufferToBase64(auth),
              };
              setSubscribe(updatedSubscribe);
              sendPushNotification(updatedSubscribe);

              console.log("새로운 푸시 구독 정보를 등록하였습니다.");
              console.log("Endpoint:", endpoint);
              console.log("p256dh:", key ? arrayBufferToBase64(key) : "없음");
              console.log("Auth:", auth ? arrayBufferToBase64(auth) : "없음");
            }
          } else {
            alert("서비스 워커가 등록되지 않았습니다.");
          }
        } else {
          alert("알림 권한이 거부되었습니다.");
        }
      } catch (error) {
        console.error("푸시 알림 처리 중 오류 발생:", error);
      }
    } else {
      alert(
        "이 브라우저는 알림을 지원하지 않거나, 서비스 워커를 지원하지 않습니다."
      );
    }
  };

  const sendPushNotification = async (updatedSubscribe) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    const body = {
      endpoint: updatedSubscribe.endpoint,
      keys: {
        p256dh: updatedSubscribe.p256dh,
        auth: updatedSubscribe.auth,
      },
    };
    try {
      const res = await instance.post("webmessage/subscribe/", body, {
        headers,
      });
      // const res = {
      //   message: "Subscription saved.",
      // };
      if (res.status === 200) {
        console.log("구독정보 전송 완료");
      } else {
        console.log("구독정보 전송 실패");
      }
    } catch (err) {
      alert(err);
    }
  };

  // ArrayBuffer를 Base64로 변환하는 함수
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Base64로 인코딩된 VAPID 공개 키를 Uint8Array로 변환하는 함수
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return (
    <AppContainer>
      <Router />
    </AppContainer>
  );
};

export default App;

// const AppContainer = styled.div`
//   width: 100vw;
//   height: 100vh;
//   overflow: scroll;
//   margin: 0 auto;
//   background-position: top center;
// `;

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
`;
