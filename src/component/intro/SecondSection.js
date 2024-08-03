import React from "react";
import styled from "styled-components";
import example from "../../assets/img/example.svg";

const SecondSection = () => {
  return (
    <SecondSectionWrapper>
      <Caption1>
        <p>인터뷰형 에세이의</p>
        <p>주인공이 되어보세요</p>
      </Caption1>
      <Caption2>
        <span>보다</span>와 함께 이루는 의미있는 변화
      </Caption2>
      <ImgBox src={example}></ImgBox>
    </SecondSectionWrapper>
  );
};

export default SecondSection;

const SecondSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 1300px;
  padding-top: 200px;
  background-color: #ece8d6;
`;

const Caption1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    margin: 10px;
    font-size: 64px;
    font-weight: 400;
    color: #4f4a36;
  }
`;

const Caption2 = styled.div`
  margin: 15px;
  margin-top: 30px;
  font-size: 20px;
  font-weight: 300;
  color: #4f4a36;

  span {
    font-weight: 600;
  }
`;

const ImgBox = styled.img`
  width: 60%;
  margin-top: 50px;
`;
