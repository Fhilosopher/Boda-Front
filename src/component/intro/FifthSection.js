import React from "react";
import styled, { keyframes } from "styled-components";
import badge1 from "../../assets/img/badge1.svg";
import badge2 from "../../assets/img/badge2.svg";
import badge3 from "../../assets/img/badge3.svg";
import badge4 from "../../assets/img/badge4.svg";

const badges = [
  badge1,
  badge2,
  badge3,
  badge4,
  badge1,
  badge2,
  badge3,
  badge4,
  badge1,
  badge2,
  badge3,
  badge4,
  badge1,
  badge2,
  badge3,
  badge4,
  badge1,
  badge2,
  badge3,
  badge4,
  badge1,
  badge2,
  badge3,
  badge4,
  badge1,
];

const FifthSection = () => {
  return (
    <FifthSectionWrapper>
      <Caption1>모으는 재미가 있는 챌린지</Caption1>
      <Caption2>연속 에세이 작성 챌린지를 통해 뱃지를 수집해보세요!</Caption2>
      <BadgeWrapper>
        <BadgeContainer>
          {badges.map((badge, index) => (
            <Badge key={index} src={badge} alt="뱃지" />
          ))}
        </BadgeContainer>
      </BadgeWrapper>
    </FifthSectionWrapper>
  );
};

export default FifthSection;

const FifthSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 800px;
  padding-top: 200px;
  background-color: #ece8d6;
`;

const Caption1 = styled.div`
  font-size: 64px;
  font-weight: 400;
  color: #4f4a36;
  margin: 10px;
  margin-left: 200px;
`;

const Caption2 = styled.div`
  font-size: 20px;
  font-weight: 300;
  color: #4f4a36;
  margin: 10px;
  margin-left: 200px;
`;

const scrollAnimation = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-50%);
  }
`;

const BadgeWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  margin: 30px 0;
`;

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  width: 2880px;
  animation: ${scrollAnimation} 10s linear infinite;
`;

const Badge = styled.img`
  width: 100px;
  margin: 0 10px;
`;
