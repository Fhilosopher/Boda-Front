import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { instance } from "../../api/instance";

const LoginHandler = () => {
  const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

  const [subscribe, setSubscribe] = useState({
    endpoint: "",
    p256dh: "",
    auth: "",
  });

  const navigate = useNavigate();

  const code = new URL(window.location.href).searchParams.get("code");
  console.log("인가코드: " + code);

  //카카오에서 인가코드로 토큰 받기
  const getToken = async (code) => {
    const response = await fetch(
      `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${code}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
    return response.json();
  };

  // 유저 정보 받기
  const getUserInfo = async (kakaoAccessToken) => {
    const headers = {
      Authorization: `Bearer ${kakaoAccessToken}`,
    };
    try {
      const res = await instance.post("accounts/kakaoLogin/", {}, { headers });
      if (res.status === 200) {
        localStorage.setItem("accessToken", res.data.access_token);
        localStorage.setItem("user_pk", res.data.user_pk);
        //navigate(res.data.redirect_url);
        navigate("/home");
        alert("반갑습니다. " + `${res.data.name}` + "님 로그인 되었습니다.");
      } else {
        alert("post 성공, status 이상");
      }
    } catch (err) {
      alert(err, "post 실패");
    }
  };

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

  useEffect(() => {
    if (code) {
      getToken(code).then((res) => {
        // console.log("카카오 리스폰스: " + res);
        // // 카카오에서 인가코드로 토큰 받아오기
        // console.log("카카오 토큰: " + res.access_token);

        // 유저 정보 받아오기
        getUserInfo(res.access_token).then(() => {
          // 구독 정보 전송하기
          handlePushNotification();
        });
      });
    }
  }, [code]);

  return (
    <Notice>
      <Caption>
        로그인 중입니다
        <br />
        잠시만 기다려주세요
      </Caption>
      <Spinner />
    </Notice>
  );
};

export default LoginHandler;

const Notice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

const Caption = styled.div`
  margin: 15px;
  margin-top: 30px;
  font-size: 20px;
  line-height: 130%;
  color: #4f4a36;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  margin: 20px 0px;
  border: 10px solid rgba(255, 255, 255, 0.5);
  border-top: 10px solid #4f4a36;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 2s linear infinite;
`;
