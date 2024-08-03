import React from "react";
import styled from "styled-components";

const IntroFooter = () => {
  return (
    <IntroFooterWrapper>
      <Caption>
        상호명: 보다 BODA
        <br />
        copyright ⓒ 2024 Likelion Sogang Univ. 펭귄대소동 All rights reserved.
      </Caption>
    </IntroFooterWrapper>
  );
};

export default IntroFooter;

const IntroFooterWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 30px 50px;
  width: 100%;
  height: 150px;
  background-color: #4f4a36;
`;

const Caption = styled.div`
  font-size: 16px;
  font-weight: 300;
  color: #ece8d6;
  line-height: 120%;
`;
