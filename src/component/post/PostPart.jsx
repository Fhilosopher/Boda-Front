import React, { useEffect, useState } from "react";
import "./PostPart.css";
import Button from "./Button.jsx";
import SaveContent from "./SaveContent.jsx";
import TypingPart from "./TypingPart";
import styled from "styled-components";
import { instance } from "../../api/instance.js";
import { useLocation } from "react-router-dom";

function PostPart({ post_id, apiData, handleAlert }) {
  const location = useLocation();
  const { falseData } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}년 ${month}월 ${day}일 호`;
  };
  const [repost, setRepost] = useState(null);
  const [firstq, setFirstq] = useState([]);
  const [date, setDate] = useState([]);
  const [contents, setContent] = useState([]);
  const [questions, setQuestion] = useState([]);
  useEffect(() => {
    if (falseData != undefined) {
      const post_index = falseData.findIndex((item) => item.id == post_id);

      const fetchPostData = async () => {
        try {
          const headers = {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          };
          const res = await instance.get(
            `diary/diary/list_diaries/?month_id=${falseData[post_index].month_id}`,
            {
              headers,
            }
          );
          setFirstq(res.data.data[post_index].firstq);
          setRepost(res.data.data[post_index].messages);
          setDate(res.data.data[post_index].created_date);
          if (res.data.data[post_index].messages.length / 2 == 7) {
            setIsFinished(true);
          }
        } catch (err) {
          alert(err);
        }
      };
      fetchPostData();
    }
  }, []);

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
      diary_id: post_id,
      answer: input,
    };

    const res = await instance.post(`diary/qna/`, body, { headers });

    onQuestionCreate(res.data.data.question);
    setLoading(false);
    if (res.data.status === "finish") {
      setIsFinished(true);
    }
    //fetchCommentList();
  };

  if (falseData != undefined) {
    return (
      <>
        <div className="ContentName">Interviewing...</div>
        <Part>
          <div className="PostPart">
            <div className="InputHead">
              <div className="Date">
                {formatDate(date)}
                <Button handleAlert={handleAlert} />
              </div>
            </div>
            <SaveContent
              firstq={firstq}
              repost={repost}
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
