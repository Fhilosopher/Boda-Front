import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Book1 from "../../assets/img/Book1.svg";
import Book2 from "../../assets/img/Book2.svg";
import Book3 from "../../assets/img/Book3.svg";
import Book4 from "../../assets/img/Book4.svg";
import Book5 from "../../assets/img/Book5.svg";
import Book6 from "../../assets/img/Book6.svg";
import { useNavigate } from "react-router-dom";
import { instance } from "../../api/instance";

function Title({ handleAlert }) {
  const [bookGroups, setBookGroups] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [isMatchedDate, setIsMatchedDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookData, setBookData] = useState([]); // 데이터 상태 추가
  const navigate = useNavigate();

  const bookImages = [Book1, Book2, Book3, Book4, Book5, Book6];
  const totalBooks = bookGroups.reduce(
    (total, group) => total + group.length,
    0
  );

  const getBookList = async () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    try {
      const res = await instance.get(
        `/diary/month/list_months/?user_id=${localStorage.getItem("user_pk")}`,
        { headers }
      );

      if (res.status === 200) {
        setBookData(res.data.data); // 데이터 상태 설정
        const groupedBooks = groupBooksByDate(res.data.data);
        setBookGroups(groupedBooks);
        calculateDate(res.data.data);
        setLoading(true);
      }
    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        // 서버 응답이 있으면 상태 코드를 확인
        if (err.response.status === 401) {
          alert("Unauthorized: 인증 토큰이 없거나 만료되었습니다.");
        } else {
          alert(`Error: ${err.response.status}`);
        }
      } else {
        // 서버 응답이 없으면 네트워크 에러
        alert("Network Error");
      }
    }
  };

  const getInterviewList = async (month_id) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    try {
      const res = await instance.get(
        `/diary/diary/list_diaries/?month_id=${month_id}`,
        {
          headers,
        }
      );
      if (res.status === 200) {
        calculateDate(res.data.data);
      }
    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        // 서버 응답이 있으면 상태 코드를 확인
        if (err.response.status === 401) {
          alert("Unauthorized: 인증 토큰이 없거나 만료되었습니다.");
        } else {
          alert(`Error: ${err.response.status}`);
        }
      } else {
        // 서버 응답이 없으면 네트워크 에러
        alert("Network Error");
      }
    }
  };

  const calculateDate = async (data) => {
    const currentDateTime = new Date();
    const currentHour = currentDateTime.getHours();

    let relevantDate;
    if (currentHour < 5) {
      // 현재 시각이 오전 5시 이전인 경우 어제 날짜를 사용
      const yesterday = new Date();
      yesterday.setDate(currentDateTime.getDate() - 1);
      relevantDate = yesterday.toLocaleDateString("en-CA"); // YYYY-MM-DD 형식
    } else {
      // 현재 시각이 오전 5시 이후인 경우 오늘 날짜를 사용
      relevantDate = currentDateTime.toLocaleDateString("en-CA"); // YYYY-MM-DD 형식
    }

    const match = data.some((entry) => entry.created_date === relevantDate);

    setIsMatchedDate(match);

    if (match) {
      setIsMatchedDate(true);
    }
  };

  const groupBooksByDate = (data) => {
    const groups = [];
    data.forEach((item) => {
      const dateString = `${item.year}.${String(item.month).padStart(2, "0")}`;
      const lastGroup = groups[groups.length - 1];

      if (!lastGroup || lastGroup.length === 3) {
        groups.push([dateString]);
      } else {
        lastGroup.push(dateString);
      }
    });
    return groups;
  };

  useEffect(() => {
    getBookList();
  }, []);

  useEffect(() => {
    const currentDateTime = new Date();
    const currentHour = currentDateTime.getHours();

    let relevantDateTime;
    if (currentHour < 5) {
      // 현재 시각이 오전 5시 이전인 경우 어제 날짜를 사용
      const yesterday = new Date();
      yesterday.setDate(currentDateTime.getDate() - 1);
      relevantDateTime = yesterday;
    } else {
      // 현재 시각이 오전 5시 이후인 경우 오늘 날짜를 사용
      relevantDateTime = currentDateTime;
    }

    const match = bookData.some(
      (entry) => entry.month === relevantDateTime.getMonth() + 1
    );
    const matchedData = bookData.find(
      (entry) => entry.month === relevantDateTime.getMonth() + 1
    );

    if (match) {
      localStorage.setItem("latest_month_id", matchedData.id);
      getInterviewList(matchedData.id);
    }
  }, [bookData]);

  //   // clickedOnce 상태를 localStorage를 기반으로 초기화
  //   const resetClickedOnceIfNeeded = () => {
  //     const now = new Date();
  //     const resetHour = 5;
  //     const resetDate = new Date(
  //       now.getFullYear(),
  //       now.getMonth(),
  //       now.getDate(),
  //       resetHour,
  //       0,
  //       0,
  //       0
  //     );

  //     if (now.getHours() < resetHour) {
  //       resetDate.setDate(resetDate.getDate() - 1);
  //     }

  //     const lastResetTime = localStorage.getItem("lastResetTime");
  //     if (!lastResetTime || new Date(lastResetTime) < resetDate) {
  //       setClickedOnce(false);
  //       localStorage.setItem("lastResetTime", now.toISOString());
  //     } else {
  //       setClickedOnce(JSON.parse(localStorage.getItem("clickedOnce")) || false);
  //     }
  //   };

  //   useEffect(() => {
  //     resetClickedOnceIfNeeded();
  //   }, []);

  //   useEffect(() => {
  //     localStorage.setItem("clickedOnce", JSON.stringify(clickedOnce));
  //   }, [clickedOnce]);

  const handleClick = async () => {
    const currentDateTime = new Date();
    const currentHour = currentDateTime.getHours();

    let relevantDateTime;
    if (currentHour < 5) {
      // 현재 시각이 오전 5시 이전인 경우 어제 날짜를 사용
      const yesterday = new Date();
      yesterday.setDate(currentDateTime.getDate() - 1);
      relevantDateTime = yesterday;
    } else {
      // 현재 시각이 오전 5시 이후인 경우 오늘 날짜를 사용
      relevantDateTime = currentDateTime;
    }

    const match = bookData.some(
      (entry) => entry.month === relevantDateTime.getMonth() + 1
    );
    const matchedData = bookData.find(
      (entry) => entry.month === relevantDateTime.getMonth() + 1
    );

    if (match) {
      getInterviewList(matchedData.id);
    }

    if (!isMatchedDate) {
      handleAlert();
    } else {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  if (!loading) {
    return (
      <Notice>
        <Caption>
          메인페이지 로딩 중입니다
          <br />
          잠시만 기다려주세요
        </Caption>
        <Spinner />
      </Notice>
    );
  }

  return (
    <>
      <Container>
        <Header>
          <Heading1>My&nbsp;Interview</Heading1>
          <Heading2>{totalBooks}편의 에세이</Heading2>
        </Header>
        <BookContainer>
          {bookGroups.map((group, groupIndex) => (
            <SupportRectangleContainer key={groupIndex}>
              <BooksContainer>
                {group.map((date, index) => {
                  const globalIndex = groupIndex * 3 + index;
                  const [year, month] = date.split(".");
                  const bookId = bookData[globalIndex]?.id; // ID 추출
                  return (
                    <BookWithDate key={index}>
                      <DateText>
                        {year.split("").join("\n")}
                        {"\n"}.{"\n"}
                        {month.split("").join("\n")}
                      </DateText>
                      <BookImage
                        src={bookImages[globalIndex % bookImages.length]}
                        onClick={() => {
                          navigate(`/months/${bookId}`);
                        }}
                      />
                    </BookWithDate>
                  );
                })}
              </BooksContainer>
              <BookShelf />
            </SupportRectangleContainer>
          ))}
        </BookContainer>
        <NavButton onClick={handleClick}>+</NavButton>
        {showMessage && (
          <AlertMessage>이미 오늘의 인터뷰를 작성하셨습니다</AlertMessage>
        )}
      </Container>
    </>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  flex: 1;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Heading1 = styled.h1`
  display: fixed;
  color: #65744b;
  text-align: center;
  color: #3a3a3b;
  font-size: 36px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 7.2px;
`;

const Heading2 = styled.h2`
  font-size: 20px;
  margin: 20px 0;
  text-align: center;
  color: #3a3a3b;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const BookContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 65%;
  height: 70%;
  overflow-y: hidden;
  overflow-x: hidden;
  position: relative;
  &:hover {
    overflow-y: auto;
  }
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const BookImage = styled.img`
  width: 150px;
  margin: 0 10px;
  z-index: 1;
  cursor: pointer;

  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const BooksContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 30px;
  position: relative;
`;

const BookShelf = styled.div`
  width: 900px;
  height: 10px;
  background-color: #4f4a36;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin-top: 20px;
  position: absolute;
  bottom: 0;
`;

const SupportRectangleContainer = styled.div`
  position: relative;
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;
`;

const BookWithDate = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 0 50px;
`;

const DateText = styled.div`
  display: flex;
  flex-direction: column;
  white-space: pre;
  text-align: center;
  line-height: 1;
  margin-top: 10px;
  color: #3a3a3b;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const NavButton = styled.button`
  color: #f5f5e8;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 21px;
  border: none;
  height: 50px;
  width: 50px;
  border-radius: 30%;
  padding: 10px 20px;
  font-size: 40px;
  cursor: pointer;
  margin: 0 10px;
  background-color: #4f4a36;
  z-index: 1000;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(5px);
  }
`;

const AlertMessage = styled.div`
  position: fixed;
  bottom: 100px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 30px;
  padding: 10px 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  font-size: 18px;
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

export default Title;
