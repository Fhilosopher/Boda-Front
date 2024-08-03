import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Intro from "./pages/Intro";
import KakaoLogin from "./component/intro/KakaoLogin";
import LoginHandler from "./component/intro/LoginHandler";
import KakaoLogout from "./component/intro/KakaoLogout";
import Home from "./pages/Home";
import Months from "./pages/Months";
import MyInfo from "./pages/MyInfo";
import Data from "./pages/Data";
import Post from "./pages/Post";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/kakao-login" element={<KakaoLogin />} />
        <Route
          path="/accounts/kakaoLogin/"
          element={<LoginHandler />} //당신이 redirect_url에 맞춰 꾸밀 컴포넌트
        />
        <Route path="/kakao-logout" element={<KakaoLogout />} />
        <Route path="/home" element={<Home />} />
        <Route path="/months" element={<Months />} />
        <Route path="/months/:month_id" element={<Months />} />
        <Route path="/data/:item_id" element={<Data />} />
        <Route path="/post/:post_id" element={<Post />} />
        <Route path="/info" element={<MyInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
