import React, { useRef, useState } from "react";
import styled from "styled-components";
import SendButton from "../../assets/img/SendButton.svg";
import AnswerTextArea from "./AnswerTextArea";

const AnswerInputContainer = styled.div`
  position: relative;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const ScrollableContainer = styled.div`
  gap: 10px;
  padding: 20px;
  background-color: #edede4;
  display: flex;
  align-items: flex-end;
  border-radius: 15px;
  position: relative;
  max-height: 135px; /* 원하는 높이로 조절 */
`;

function TypingPart({ handleClickSendButton }) {
  const [input, setInput] = useState("");
  const inputRef = useRef();
  const onChangeInput = (e) => {
    setInput(e.target.value);
  };

  const onSubmit = () => {
    if (input === "") {
      inputRef.current.focus();
      return;
    }
    handleClickSendButton(input);
    setInput("");
  };

  return (
    <div>
      <AnswerInputContainer>
        <ScrollableContainer>
          <AnswerTextArea
            value={input}
            ref={inputRef}
            onChange={onChangeInput}
            placeholder="구체적인 답변일수록 좋은 인터뷰가 이루어질 수 있습니다"
          />

          <img src={SendButton} alt="Logo" onClick={onSubmit} />
        </ScrollableContainer>
      </AnswerInputContainer>
    </div>
  );
}

export default TypingPart;
