import React from "react";
import styled from "styled-components";
function BeforeButton({ hide, handlePrevious }) {
  return (
    <>
      <Before onClick={handlePrevious} hide={hide}>
        &lt;
      </Before>
    </>
  );
}

const Before = styled.button`
  visibility: ${(props) => (props.hide ? "hidden" : "visible")};
  margin-right: 51px;
  background-color: #6b5b53;
  border-radius: 20px;
  color: white;
  height: 50px;
  width: 50px;
  font-size: 24px;

  transition: transform 0.3s ease;

  &:hover {
    transform: translateX(-5px);
  }
`;

export default BeforeButton;
