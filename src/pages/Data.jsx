import React, { useEffect, useState } from "react";
import "./../component/post/PostPart.css";
import Header from "./../component/common/Header";
import BeforeButton from "../component/data/BeforeButton";
import styled, { keyframes } from "styled-components";
import AfterButton from "../component/data/AfterButton";
import { useNavigate, useParams } from "react-router-dom";
import DataField from "../component/data/DataField";
import { instance } from "./../api/instance";
import TimeAlert from "../component/common/TimeAlert";

function Data() {
  const navigate = useNavigate();
  const { item_id } = useParams();
  const [post, setPost] = useState(null);
  const [alertShown, setAlertShown] = useState(false);
  const [moveShown, setMoveShown] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}년 ${month}월 ${day}일 호`;
  };

  const fetchPostData = async (id) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };
      const res = await instance.get(`diary/diary/${id}/view_diary/`, {
        headers,
      });
      setPost(res.data.data);
    } catch (err) {
      alert(err);
    }
  };

  const handlePrevious = () => {
    if (post?.previous_diary) {
      if (post.previous_diary.is_complete) {
        fetchPostData(post.previous_diary.id);
      }
    }
  };

  const handleNext = () => {
    if (post?.next_diary) {
      if (post.next_diary.is_complete) {
        fetchPostData(post.next_diary.id);
      }
    }
  };

  const handleTimeAlert = () => {
    TimeAlert();
  };

  useEffect(() => {
    fetchPostData(item_id);
  }, [item_id]);

  useEffect(() => {
    const AlertHour = 4; // 오전 4시
    const AlertMinute = 45; // 45분

    const MoveHour = 5; // 오전 5시
    const MoveMinute = 0; // 0분

    const checkTime = () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();

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
        !moveShown
      ) {
        navigate("/home");
        setMoveShown(true); // 홈으로 이동
      }
    };

    const intervalId = setInterval(checkTime, 1000);

    return () => clearInterval(intervalId);
  }, [alertShown, moveShown, navigate]);

  if (!post) {
    return (
      <Notice>
        <Caption>
          인터뷰 로딩 중입니다
          <br />
          잠시만 기다려주세요
        </Caption>
        <Spinner />
      </Notice>
    );
  }

  return (
    <>
      <DataPage>
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
        <div className="ContentName">Interview</div>
        <DataHome>
          <BeforeButton
            hide={
              post.previous_diary === null ||
              post.previous_diary.is_complete === false
            }
            handlePrevious={handlePrevious}
          />
          <DataPart>
            <div className="InputHead">
              <div className="Date">{formatDate(post.diary.created_date)}</div>
            </div>
            <DataField messages={post.diary.messages} />
          </DataPart>
          <AfterButton
            hide={
              post.next_diary === null || post.next_diary.is_complete === false
            }
            handleNext={handleNext}
          />
        </DataHome>
      </DataPage>
    </>
  );
}

const DataPart = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 100%;
  background-color: #f9f9f1;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  margin-bottom: 0px;
  padding-left: 27px;
  padding-right: 27px;
`;

const DataPage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const DataHome = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  overflow-y: hidden;
`;

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

export default Data;
