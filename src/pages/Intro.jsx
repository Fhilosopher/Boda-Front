import React from "react";
import IntroHeader from "../component/intro/IntroHeader";
import FirstSection from "../component/intro/FirstSection";
import SecondSection from "../component/intro/SecondSection";
import IntroFooter from "../component/intro/IntroFooter";
import ThirdSection from "../component/intro/ThirdSection";
import FourthSection from "../component/intro/FourthSection";
import FifthSection from "../component/intro/FifthSection";
import SixthSection from "../component/intro/SixthSection";
import SeventhSection from "../component/intro/SeventhSection";
import styled from "styled-components";

const Intro = () => {
  return (
    <IntroWrapper>
      <IntroHeader />
      <FirstSection />
      <SecondSection />
      <ThirdSection />
      <FourthSection />
      <FifthSection />
      <SixthSection />
      <SeventhSection />
      <IntroFooter />
    </IntroWrapper>
  );
};

const IntroWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  overflow-x: hidden;
  margin: 0 auto;
  background-position: top center;
`;

export default Intro;
