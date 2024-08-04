import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../../assets/img/logo.svg";
import kakao from "../../assets/img/kakao.svg";
import sliderFirst from "../../assets/img/sliderFirst.svg";
import sliderSecond from "../../assets/img/sliderSecond.svg";
import sliderThird from "../../assets/img/sliderThird.svg";
import close from "../../assets/img/close.svg";
import expandleft from "../../assets/img/expand_left.svg";
import expandright from "../../assets/img/expand_right.svg";

const IntroHeader = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [curSlide, setCurSlide] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const imgBoxRef = useRef(null);
  const navigate = useNavigate();

  const sliderCompartment = [sliderFirst, sliderSecond, sliderThird];
  const FIRST_SLIDE_INDEX = 0;
  const LAST_SLIDE_INDEX = sliderCompartment.length - 1;
  const MOVE_SLIDE_INDEX = 1;

  const handleStartClick = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const moveToSlide = (direction) => {
    if (direction === "next") {
      setCurSlide((prevSlide) =>
        prevSlide < LAST_SLIDE_INDEX
          ? prevSlide + MOVE_SLIDE_INDEX
          : FIRST_SLIDE_INDEX
      );
    } else if (direction === "prev") {
      setCurSlide((prevSlide) =>
        prevSlide > FIRST_SLIDE_INDEX
          ? prevSlide - MOVE_SLIDE_INDEX
          : LAST_SLIDE_INDEX
      );
    }
  };

  useEffect(() => {
    const updateSlideWidth = () => {
      if (imgBoxRef.current) {
        setSlideWidth(imgBoxRef.current.offsetWidth);
      }
    };
    updateSlideWidth();
    window.addEventListener("resize", updateSlideWidth);
    return () => window.removeEventListener("resize", updateSlideWidth);
  }, [curSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      moveToSlide("next");
    }, 2000);

    return () => clearInterval(interval);
  }, [curSlide]);

  const handleKakaoLogin = () => {
    navigate("/kakao-login");
  };

  const handleLogoClick = () => {
    const link = "https://boda.vercel.app/";
    window.location.href = link;
  };
  return (
    <>
      <IntroHeaderWrapper>
        <LogoItem onClick={handleLogoClick}>
          <LogoImg src={logo} alt="서비스 로고" />
        </LogoItem>
        <StartItem onClick={handleStartClick}>
          <Start color={"#FFFFFF"}>시작하기</Start>
        </StartItem>
      </IntroHeaderWrapper>
      {isPopupVisible && (
        <PopupOverlay onClick={handleClosePopup}>
          <PopupContainer onClick={(e) => e.stopPropagation()}>
            <PopupContent color="#FFFBEF">
              <SliderContainer>
                <ImgBox ref={imgBoxRef}>
                  {sliderCompartment.map((item, index) => (
                    <div
                      className="compartment"
                      key={index}
                      style={{
                        transform: `translateX(${-slideWidth * curSlide}px)`,
                        transition: "all 0.4s ease-in-out",
                        backgroundImage: `url(${item})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ))}
                </ImgBox>
                <Dots>
                  <img
                    src={expandleft}
                    className="prev-button"
                    onClick={() => moveToSlide("prev")}
                    alt="이전"
                  />
                  {sliderCompartment.map((_, index) => (
                    <Dot key={index} active={curSlide === index} />
                  ))}
                  <img
                    src={expandright}
                    className="next-button"
                    onClick={() => moveToSlide("next")}
                    alt="다음"
                  />
                </Dots>
              </SliderContainer>
            </PopupContent>
            <PopupContent color="#F0EADF">
              <CaptionBox>
                <img src={logo} alt="로고" />
                <p>시작하기</p>
              </CaptionBox>
              <LoginBox onClick={handleKakaoLogin}>
                <img src={kakao} alt="카카오" />
                <p>카카오 계정으로 로그인</p>
              </LoginBox>
            </PopupContent>
            <CloseButton src={close} onClick={handleClosePopup} alt="닫기" />
          </PopupContainer>
        </PopupOverlay>
      )}
    </>
  );
};

const IntroHeaderWrapper = styled.div`
  display: flex;
  position: fixed;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  z-index: 2;
`;

const LogoItem = styled.div`
  display: flex;
  width: 200px;
  height: 100%;
  align-items: center;
  cursor: pointer;

  .logotext {
    display: flex;
    margin-left: 15px;
  }
`;

const LogoImg = styled.img`
  height: 30px;
  margin-left: 30px;
`;

const StartItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140px;
  height: 50px;
  margin-right: 100px;
  border-radius: 30px;
  background-color: #4f4a36;
  cursor: pointer;

  &:hover {
    background-color: #817b6a;
  }
`;

const Start = styled.div`
  color: #ffffff;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
`;

const PopupOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 3;
`;

const PopupContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 50%;
  height: 60%;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const PopupContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  height: 120%;
  border-radius: 10px;
  background-color: ${(props) => props.color};
`;

const CaptionBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  height: 50px;

  img {
    width: 65px;
    margin: 0px 8px;
  }
  p {
    text-align: center;
    font-weight: 600;
    font-size: 20px;
    color: #4f4a36;
  }
`;

const LoginBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 30px;
  margin: 10px 30px;
  height: 50px;
  border-radius: 8px;
  cursor: pointer;
  background-color: #f6e550;

  img {
    margin: 10px 20px;
    width: 8%;
  }
  p {
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #4f4a36;
  }
  &:hover {
    background-color: #e7d53b;
  }
`;

const CloseButton = styled.img`
  width: 25px;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

const SliderContainer = styled.div`
  position: relative;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: 300px;
  margin-bottom: 50px;
`;

const ImgBox = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  align-items: center;

  .compartment {
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    font-size: 40px;
    text-align: center;
  }
`;

const Dots = styled.div`
  position: absolute;
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: center;

  .prev-button,
  .next-button {
    display: flex;
    position: absolute;
    margin: 0 35%;
    top: 0;
    border: none;
    cursor: pointer;
    font-size: 50px;
    color: #4f4a36;
    width: 20px;
    height: 20px;
    z-index: 1;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;
  }

  .prev-button {
    left: 0;
    &:hover {
      transform: translateX(-5px);
      transition: all 0.2s ease-in-out;
    }
  }

  .next-button {
    right: 0;
    &:hover {
      transform: translateX(5px);
      transition: all 0.2s ease-in-out;
    }
  }
`;

const Dot = styled.div`
  align-self: center;
  width: 8px;
  height: 8px;
  margin: 0 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "#4F4A36" : "#CDC8B6")};
`;

export default IntroHeader;
