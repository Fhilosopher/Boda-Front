import React, { useEffect, useState } from "react";
import Header from "../component/common/Header";
import MonthsPage from "../component/months/MonthsPages";
import Logo from "../assets/img/logo.svg";
import Alert from "../component/common/Alert";
import TimeAlert from "../component/common/TimeAlert";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { instance } from "../api/instance";

function Months() {
  const navigate = useNavigate();
  const [alertShown, setAlertShown] = useState(false);
  const [moveShown, setMoveShown] = useState(false);

  const handleConfirm = async () => {
    const body = {
      user_id: `${localStorage.getItem("user_pk")}`,
      month_id: `${localStorage.getItem("latest_month_id")}`,
    };
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    const res = await instance.post(`/diary/diary/`, body, { headers });

    navigate(`/post/${res.data.data.id}`, {
      state: { apiData: res.data.data },
    });
  };

  const handleAlert = () => {
    Alert(
      "오늘의 인터뷰를 시작하시겠습니까?",
      "인터뷰는 하루에 한 번만 작성할 수 있습니다",
      Logo,
      "시작",
      () => {
        handleConfirm();
      }
    );
  };

  const handleTimeAlert = () => {
    TimeAlert();
  };

  useEffect(() => {
    const AlertHour = 4; // 오전 4시
    const AlertMinute = 45; // 45분

    const MoveHour = 5; // 오전 5시
    const MoveMinute = 0; // 0분
    const MoveSecond = 0; // 0초

    const checkTime = () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      const currentSecond = currentTime.getSeconds();

      if (
        currentHour === AlertHour &&
        currentMinute === AlertMinute &&
        !alertShown
      ) {
        handleTimeAlert();
        setAlertShown(true); // 경고창이 표시된 후 상태 업데이트
      }

      if (
        currentHour === MoveHour &&
        currentMinute === MoveMinute &&
        currentSecond === MoveSecond &&
        !moveShown
      ) {
        navigate("/home");
        setMoveShown(true); // 홈으로 이동
      }
    };

    // 매 1초마다 시간을 확인합니다.
    const intervalId = setInterval(checkTime, 1000);

    // 컴포넌트 언마운트 시 interval을 정리합니다.
    return () => clearInterval(intervalId);
  }, [alertShown, moveShown]); // alertShown 상태가 변경될 때마다 이펙트를 재실행

  return (
    <MonthPage>
      <Header
        handleHome={() => {
          navigate("/home");
        }}
        handleMyInfo={() => {
          navigate("/info");
        }}
        handleLogOut={() => {
          navigate("/kakao-logout");
        }}
      />
      <MonthsPage handleAlert={handleAlert} />
    </MonthPage>
  );
}

const MonthPage = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`;

export default Months;
