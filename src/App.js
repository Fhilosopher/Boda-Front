import React from "react";
import styled from "styled-components";
import Router from "./Router";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${process.env.PUBLIC_URL}/serviceWorker.js`)
      .then(function (registration) {
        console.log("서비스 워커가 등록되었습니다:", registration);
      })
      .catch(function (error) {
        console.error("서비스 워커 등록 실패:", error);
      });
  });
}

const App = () => {
  return (
    <AppContainer>
      <Router />
    </AppContainer>
  );
};

export default App;

// const AppContainer = styled.div`
//   width: 100vw;
//   height: 100vh;
//   overflow: scroll;
//   margin: 0 auto;
//   background-position: top center;
// `;

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
`;
