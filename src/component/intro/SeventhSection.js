import React from "react";
import styled from "styled-components";
import service1 from "../../assets/img/service1.svg";
import service2 from "../../assets/img/service2.svg";
import service3 from "../../assets/img/service3.svg";

const SeventhSection = () => {
  return (
    <SeventhSectionWrapper>
      <Caption1>
        <p>
          <span>보다</span> 특별한
        </p>
        <p>Premium 서비스</p>
      </Caption1>
      <Caption2>월 990원에 제한 없는 서비스를 경험해보세요</Caption2>
      <ServiceContainer>
        <Service>
          <ImgBox src={service1} alt="서비스1"></ImgBox>
          <Caption3>
            하루에 답할 수 있는 <br />
            질문 수 증가
          </Caption3>
        </Service>
        <Service>
          <ImgBox src={service2} alt="서비스1"></ImgBox>
          <Caption3>
            하루의 인터뷰를 정리해주는
            <br />
            요약 서비스 제공
          </Caption3>
        </Service>
        <Service>
          <ImgBox src={service3} alt="서비스1"></ImgBox>
          <Caption3>
            챌린지 달성을 위한
            <br /> 아이템 무료 제공
          </Caption3>
        </Service>
      </ServiceContainer>
    </SeventhSectionWrapper>
  );
};

export default SeventhSection;

const SeventhSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 1000px;
  padding-top: 100px;
  padding-bottom: 0px;
  background-color: #ece8d6;
`;

const Caption1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    font-size: 64px;
    font-weight: 400;
    color: #4f4a36;
    line-height: normal;
  }
  span {
    font-weight: 600;
  }
  margin: 10px;
`;

const Caption2 = styled.div`
  font-size: 20px;
  font-weight: 300;
  color: #4f4a36;
  margin: 10px;
`;

const Caption3 = styled.div`
  font-size: 20px;
  font-weight: 300;
  color: #4f4a36;
  text-align: center;
  line-height: 130%;
`;

const ServiceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px 18%;
  width: 100%;
  height: 550px;
`;

const Service = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 32%;
  height: 100%;
  border-radius: 10px;
  background-color: rgba(245, 245, 245, 0.4);
`;

const ImgBox = styled.img`
  margin-top: 15%;
  margin-bottom: 10%;
  width: 70%;
`;
