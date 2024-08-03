import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";

const KakaoLogin = () => {
  const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
  const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const loginHandler = () => {
    window.location.href = link;
  };

  useEffect(() => {
    loginHandler();
  }, []);

  return (
    <Notice>
      <Caption>
        로딩 중입니다
        <br />
        잠시만 기다려주세요
      </Caption>
      <Spinner />
    </Notice>
  );
};

export default KakaoLogin;

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
