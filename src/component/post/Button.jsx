import React from "react";
import styled from "styled-components";

function Button({ handleAlert }) {
  return (
    <div>
      <EndButton onClick={handleAlert}>마무리</EndButton>
    </div>
  );
}

const EndButton = styled.button`
  position: absolute;
  background-color: #6b5b53;
  top: 30px; /* 배경 요소 위에 위치를 조정 */
  right: 14px;
  width: 77px;
  height: 35px;
  flex-shrink: 0;
  justify-content: center;
  color: #f2f2f3;
  border-radius: 20rem;
  font-size: 18px;
  font-weight: 500;
`;

export default Button;
