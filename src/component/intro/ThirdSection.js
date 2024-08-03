import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

const ThirdSection = () => {
  const [isInView, setIsInView] = useState([false, false, false]);
  const questionRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ]);

  useEffect(() => {
    const observers = questionRefs.current.map(
      (ref, index) =>
        new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setIsInView((prevState) => {
                  const newState = [...prevState];
                  newState[index] = true;
                  return newState;
                });
              } else {
                setIsInView((prevState) => {
                  const newState = [...prevState];
                  newState[index] = false;
                  return newState;
                });
              }
            });
          },
          { threshold: 0.1 }
        )
    );

    questionRefs.current.forEach((ref, index) => {
      if (ref.current) {
        observers[index].observe(ref.current);
      }
    });

    return () => {
      questionRefs.current.forEach((ref, index) => {
        if (ref.current) {
          observers[index].unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <ThirdSectionWrapper>
      <Caption>
        <p>어렵지 않은 질문부터</p>
        <p>시작해보세요</p>
      </Caption>
      <QuestionBox
        size="400px"
        loc="left"
        ref={questionRefs.current[0]}
        isInView={isInView[0]}
      >
        <Date>2024년 5월 12일 호</Date>
        <Question>하루 중 가장 좋아하는 시간대는 언제인가요?</Question>
      </QuestionBox>
      <QuestionBox
        size="550px"
        loc="right"
        ref={questionRefs.current[1]}
        isInView={isInView[1]}
      >
        <Date>2024년 6월 28일 호</Date>
        <Question>
          당신의 기억에 깊게 남아있는 여행지와 그곳에서의 추억은 무엇인가요?
        </Question>
      </QuestionBox>
      <QuestionBox
        size="500px"
        loc="left"
        ref={questionRefs.current[2]}
        isInView={isInView[2]}
      >
        <Date>2024년 7월 9일 호</Date>
        <Question>
          당신의 수면 패턴은 어떤가요? 충분한 수면을 취하고 있나요?
        </Question>
      </QuestionBox>
    </ThirdSectionWrapper>
  );
};

export default ThirdSection;

const ThirdSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 1000px;
  padding-top: 100px;
  background-color: #ece8d6;
`;

const Caption = styled.div`
  p {
    margin: 10px;
    margin-left: 200px;
    font-size: 64px;
    font-weight: 400;
    line-height: normal;
    color: #4f4a36;
  }
`;

const questionBoxAnimation = keyframes`
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0px);
    opacity: 100%;
  }
`;

const QuestionBox = styled.div`
  display: flex;
  flex-direction: column;
  width: ${(props) => props.size};
  height: 100px;
  margin: 20px 250px;
  margin-top: 40px;
  align-self: ${(props) => (props.loc === "right" ? "flex-end" : "flex-start")};
  border-radius: 20px;
  background-color: #f9f9f1;
  box-shadow: 0px 1px 3px 1px rgba(115, 116, 111, 0.15),
    0px 1px 2px 0px rgba(115, 116, 111, 0.3);
  opacity: 0;

  animation: ${(props) => (props.isInView ? questionBoxAnimation : "none")} 1s
    ease-out forwards;
`;

const Date = styled.div`
  margin: 15px;
  font-size: 16px;
  font-style: normal;
  font-weight: 100;
  color: #4f4a36;
  text-align: center;
`;

const Question = styled.div`
  margin: 10px 20px;
  font-size: 18px;
  font-weight: 300;
  color: #4f4a36;
`;
