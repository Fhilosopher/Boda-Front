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
  padding-right: 37px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: hidden; /* 기본적으로 스크롤바 숨김 */
  overflow-x: hidden;
  position: relative;
  flex: 1;
  /* Hover 상태에서 스크롤바 보이기 */
  &:hover {
    overflow-y: auto;
    padding-right: 25px;
  }
`;

export default DataField;
