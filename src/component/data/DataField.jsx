import React from "react";
import styled from "styled-components";

function DataField({ messages }) {
  const renderMessages = (messages) =>
    messages.map((message, index) => (
      <div key={index}>
        {message.role === "assistant" && <Q>질문: {message.content}</Q>}
        {message.role === "user" && <A>나: {message.content}</A>}
      </div>
    ));
  return (
    <>
      <MyField>
        <QAndA>{renderMessages(messages)}</QAndA>
      </MyField>
    </>
  );
}

const Q = styled.div`
  color: #65744b;
`;

const A = styled.div`
  color: #3a3a3b;
  white-space: pre-wrap;
  margin-bottom: 40px;
`;

const QAndA = styled.div`
  display: flex;
  flex-direction: column;
  color: #3a3a3b;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.8;
`;

const MyField = styled.div`
  height: 50%;
  margin: 10px 10px 30px 33px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  flex: 1;
  overflow: auto;
  padding-right: 25px; /* 스크롤바 공간 고려한 패딩 */

  /* hover 상태에서 스크롤바가 있을 때 padding-right 조정 */
  &:hover {
    &::-webkit-scrollbar {
      width: 12px;
    }
    &::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 12px; /* 스크롤바 넓이 */
      background: #f9f9f1; /* 배경색과 동일하게 맞춤 */
    }
  }
`;

export default DataField;
