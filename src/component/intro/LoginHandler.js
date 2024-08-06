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
  // console.log("인가코드: " + code);
  if (code) {
    console.log("인가코드 발급완료");
  }

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

  useEffect(() => {
    if (code) {
      getToken(code).then((res) => {
        // console.log("카카오 리스폰스: " + res);
        // // 카카오에서 인가코드로 토큰 받아오기
        // console.log("카카오 토큰: " + res.access_token);

        // 유저 정보 받아오기
        getUserInfo(res.access_token).then(() => {
          // 구독 정보 전송하기
          // handlePushNotification();
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
