import React from "react";
import styled from "styled-components";

function AfterButton({ hide, handleNext }) {
  return (
    <>
      <After onClick={handleNext} hide={hide}>
        &gt;
      </After>
    </>
  );
}

const After = styled.button`
  visibility: ${(props) => (props.hide ? "hidden" : "visible")};
  margin-left: 51px;
  background-color: #6b5b53;
  border-radius: 20px;
  color: white;
  height: 50px;
  width: 50px;
  font-size: 24px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateX(5px);
  }
`;

export default AfterButton;
