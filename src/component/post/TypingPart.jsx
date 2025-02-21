import React, { useRef, useState } from "react";
import styled from "styled-components";
import SendButton from "../../assets/img/SendButton.svg";
import AnswerTextArea from "./AnswerTextArea";

const AnswerInputContainer = styled.div`
  position: relative;
  margin-top: 20px;
  margin-bottom: 20px;
  pointer-events: ${(props) => (props.isFinished ? "none" : "auto")};
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

  img {
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

function TypingPart({ handleClickSendButton, isFinished }) {
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
      <AnswerInputContainer isFinished={isFinished}>
        <ScrollableContainer>
          <AnswerTextArea
            value={input}
            ref={inputRef}
            onChange={onChangeInput}
            placeholder={
              isFinished
                ? "오늘의 질문 개수 한도에 도달하였습니다. 이어서 답하시려면 Premium 구독 서비스를 이용해주세요!"
                : "구체적인 답변일수록 좋은 인터뷰가 이루어질 수 있습니다"
            }
          />
          <img src={SendButton} alt="전송" onClick={onSubmit} />
        </ScrollableContainer>
      </AnswerInputContainer>
    </div>
  );
}

export default TypingPart;
