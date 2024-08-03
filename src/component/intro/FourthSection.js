import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

const FourthSection = () => {
  const [isInView, setIsInView] = useState(false);
  const spanRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (spanRef.current) {
      observer.observe(spanRef.current);
    }

    return () => {
      if (spanRef.current) {
        observer.unobserve(spanRef.current);
      }
    };
  }, []);

  return (
    <FourthSectionWrapper>
      <Caption1>
        <p>하루에</p>
        <p>
          단{" "}
          <AnimatedSpan ref={spanRef} isInView={isInView}>
            한 번
          </AnimatedSpan>
          의
        </p>
        <p>인터뷰</p>
      </Caption1>
      <Caption2>
        <p>편안한 질문에만 답변하는 습관을 버리고,</p>
        <p>단 한 번의 인터뷰를 통해 사색할 기회를 만들어 보아요</p>
      </Caption2>
    </FourthSectionWrapper>
  );
};

export default FourthSection;

const FourthSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 800px;
  padding-top: 200px;
  background-color: #ece8d6;
`;

const Caption1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 60px;

  p {
    display: flex;
    align-items: center;
    margin: 5px;
    font-size: 64px;
    font-weight: 400;
    color: #4f4a36;
  }
`;

const borderAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const AnimatedSpan = styled.span`
  font-size: 1.2em;
  font-weight: 600;
  padding: 5px 5px;
  margin: 0px 5px;
  display: inline-block;
  vertical-align: middle;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${(props) => (props.isInView ? "100%" : "0")};
    height: 5px;
    background-color: #ab7e7b;
    animation: ${(props) => (props.isInView ? borderAnimation : "none")} 1s
      ease-out forwards;
  }
`;

const Caption2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    display: flex;
    align-items: center;
    margin: 5px;
    font-size: 20px;
    color: #4f4a36;
  }
`;
