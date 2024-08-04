import React, { useEffect, useState } from "react";
import "./PostPart.css";
import Button from "./Button.jsx";
import SaveContent from "./SaveContent.jsx";
import TypingPart from "./TypingPart";
import styled from "styled-components";
import { instance } from "../../api/instance.js";

function PostPart({ apiData, handleAlert }) {
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}년 ${month}월 ${day}일 호`;
  };
  const [contents, setContent] = useState([]);
  const [questions, setQuestion] = useState([]);
  const onContentCreate = (content) => {
    const newContent = { content };
    setContent([...contents, newContent]);
  };
  const onQuestionCreate = (question) => {
    const newQuestion = { question };
    setQuestion([...questions, newQuestion]);
  };
  const handleClickSendButton = async (input) => {
    onContentCreate(input);
    setLoading(true);
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    const body = {
      diary_id: apiData.id,
      answer: input,
    };
    /*const res = {
      status: "success",
      data: {
        id: 1,
        answer: input,
        question:
          "I see we're still going in circles! Let's try something different. How about you share a topic or question you'd like me to respond to? That way, we can break this pattern and have a more engaging conversation.",
        diary_id: 2,
      },
    };*/
    const res = await instance.post(`diary/qna/`, body, { headers });
    console.log("Response:", res);
    onQuestionCreate(res.data.data.question);
    setLoading(false);
    if (res.data.status === "finish") {
      setIsFinished(true);
    }
    //fetchCommentList();
  };

  return (
    <>
      <div className="ContentName">Interviewing...</div>
      <Part>
        <div className="PostPart">
          <div className="InputHead">
            <div className="Date">
              {formatDate(apiData?.created_date)}
              <Button handleAlert={handleAlert} />
            </div>
          </div>
          <SaveContent
            apiData={apiData}
            contents={contents}
            questions={questions}
          />
          <div className="InputPart">
            {loading ? (
              <div className="Loading">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            ) : (
              <div></div>
            )}
            <TypingPart
              handleClickSendButton={handleClickSendButton}
              isFinished={isFinished}
            />
          </div>
        </div>
      </Part>
    </>
  );
}

const Part = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

export default PostPart;
