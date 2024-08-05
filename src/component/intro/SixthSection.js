import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import interview1 from "../../assets/img/interview1.svg";
import interview2 from "../../assets/img/interview2.svg";
import interview3 from "../../assets/img/interview3.svg";
import interview4 from "../../assets/img/interview4.svg";
import interview5 from "../../assets/img/interview5.svg";
import interviews from "../../assets/img/interviews.svg";
import essay from "../../assets/img/essay.svg";

const SixthSection = () => {
  const [isInView, setIsInView] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const imgContainerRef = useRef(null);

  const images = [interview1, interview2, interview3, interview4, interview5];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false);
            setIsAnimationComplete(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (imgContainerRef.current) {
      observer.observe(imgContainerRef.current);
    }

    return () => {
      if (imgContainerRef.current) {
        observer.unobserve(imgContainerRef.current);
      }
    };
  }, []);

  const handleAnimationEnd = () => {
    setIsAnimationComplete(true);
  };

  return (
    <SixthSectionWrapper>
      <Caption2>
        <p>내가 쓴 에세이를</p>
        <p>실제 책으로 받아볼 수 있는</p>
      </Caption2>
      <Caption1>나만의 책 서비스</Caption1>
      <ImgContainer ref={imgContainerRef}>
        <BackgroundImg isInView={isAnimationComplete} />
        {images.map((src, index) => (
          <InterviewImg
            key={index}
            src={src}
            isInView={isInView}
            index={index}
            onAnimationEnd={
              index === images.length - 1 ? handleAnimationEnd : undefined
            }
          />
        ))}
        <BookImg src={essay} isInView={isAnimationComplete}></BookImg>
      </ImgContainer>
      <Caption3>
        내가 인터뷰 한 내용들을 실제 책으로 만들어 나만의 하나 뿐인 책을 만들 수
        있어요 <br />
        *단, 뱃지 5개 이상 보유 회원 대상
      </Caption3>
    </SixthSectionWrapper>
  );
};

export default SixthSection;

const SixthSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 1000px;
  padding-top: 100px;
  background-color: #ece8d6;
`;

const Caption1 = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 64px;
  font-weight: 400;
  margin: 10px;
  margin-left: 200px;
  color: #4f4a36;
`;

const Caption2 = styled.div`
  font-size: 20px;
  font-weight: 300;
  line-height: normal;
  color: #4f4a36;
  margin-left: 200px;
`;

const Caption3 = styled.div`
  margin-top: 10px;
  align-self: center;
  text-align: center;
  font-size: 16px;
  font-weight: 300;
  line-height: normal;
  color: #4f4a36;
`;

const ImgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-self: center;
  align-items: center;
  width: 80%;
  height: 350px;
  margin: 30px 0px;
  position: relative;
`;

const BackgroundImg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${interviews});
  background-size: cover;
  background-position: center;
  opacity: 0;
  opacity: ${(props) => (props.isInView ? 0.7 : 0)};
  transition: opacity 1.5s ease-in-out;
  z-index: 1;
`;

const BookImg = styled.img`
  height: 81%;
  z-index: 1;
  opacity: ${(props) => (props.isInView ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

const mergeAnimation = (index) => keyframes`
  0% {
    transform: rotate(${index * 10 - 20}deg) translateX(${index * 200 - 400}px);
  }
  100% {
    transform: rotate(0deg) translateX(0);
  }
`;

const InterviewImg = styled.img`
  height: 80%;
  position: absolute;
  transform-origin: center;
  opacity: ${(props) => (props.isInView ? 1 : 0)};
  transform: rotate(${(props) => props.index * 10 - 20}deg)
    translateX(${(props) => props.index * 200 - 400}px);
  animation: ${(props) =>
      props.isInView ? mergeAnimation(props.index) : "none"}
    1s ease-in-out forwards;
  z-index: 0;
`;
