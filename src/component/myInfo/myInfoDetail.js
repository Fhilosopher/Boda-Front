import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { instance } from "../../api/instance";
import badge1 from "../../assets/img/badge1.svg";
import badge2 from "../../assets/img/badge2.svg";
import badge3 from "../../assets/img/badge3.svg";
import badge4 from "../../assets/img/badge4.svg";

function MyInfoDetail() {
  const [userData, setUserData] = useState(null);
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [pushTime, setPushTime] = useState("00:00");
  const [itemNum, setItemNum] = useState(0);

  const badgeMap = {
    1: badge1,
    7: badge2,
    14: badge3,
    30: badge4,
  };

  const [subscribe, setSubscribe] = useState({
    endpoint: "",
    p256dh: "",
    auth: "",
  });

  useEffect(() => {
    const fetchMyInfo = async () => {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };
      try {
        const res = await instance.get(
          `/accounts/MyPage/mypageDetail/?user_id=${localStorage.getItem(
            "user_pk"
          )}`,
          { headers }
        );
        if (res.status === 200) {
          setUserData(res.data);
          setIsPushEnabled(res.data.is_alert);
          setPushTime(
            `${String(res.data.alert_hour).padStart(2, "0")}:${String(
              res.data.alert_min
            ).padStart(2, "0")}`
          );
        }
      } catch (err) {
        alert(err);
      }
    };

    const handlePushNotification = async () => {
      if ("Notification" in window && "serviceWorker" in navigator) {
        try {
          // 알림 권한 요청
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            // Service Worker 등록 확인
            const registration =
              await navigator.serviceWorker.getRegistration();
            if (registration) {
              // 푸시 구독 확인
              const subscription =
                await registration.pushManager.getSubscription();
              if (subscription) {
                // 이미 구독된 경우, endpoint와 key를 추출
                const endpoint = subscription.endpoint;
                const key = subscription.getKey("p256dh");
                const auth = subscription.getKey("auth");

                const updatedSubscribe = {
                  endpoint: endpoint,
                  p256dh: arrayBufferToBase64(key),
                  auth: arrayBufferToBase64(auth),
                };
                setSubscribe(updatedSubscribe);
                sendPushNotification(updatedSubscribe);

                console.log("기존 푸시 구독 정보가 존재합니다");
                console.log("Endpoint:", endpoint);
                console.log("p256dh:", key ? arrayBufferToBase64(key) : "없음");
                console.log("Auth:", auth ? arrayBufferToBase64(auth) : "없음");
              } else {
                // 구독이 없는 경우 새로 구독 생성
                const newSubscription =
                  await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(
                      "BKd1I8PDrg7zidthfuKgR-0k_-CwlXZk3p1_F1tLWAur3w3lDdSfiAQHFl_cXRi6pguzNe9Akfxrqo25XXXxGZ4"
                    ), // VAPID 공개 키
                  });

                const endpoint = newSubscription.endpoint;
                const key = newSubscription.getKey("p256dh");
                const auth = newSubscription.getKey("auth");

                const updatedSubscribe = {
                  endpoint: endpoint,
                  p256dh: arrayBufferToBase64(key),
                  auth: arrayBufferToBase64(auth),
                };
                setSubscribe(updatedSubscribe);
                sendPushNotification(updatedSubscribe);

                console.log("새로운 푸시 구독 정보를 등록하였습니다.");
                console.log("Endpoint:", endpoint);
                console.log("p256dh:", key ? arrayBufferToBase64(key) : "없음");
                console.log("Auth:", auth ? arrayBufferToBase64(auth) : "없음");
              }
            } else {
              alert("서비스 워커가 등록되지 않았습니다.");
            }
          } else {
            alert("알림 권한이 거부되었습니다.");
          }
        } catch (error) {
          console.error("푸시 알림 처리 중 오류 발생:", error);
        }
      } else {
        alert(
          "이 브라우저는 알림을 지원하지 않거나, 서비스 워커를 지원하지 않습니다."
        );
      }
    };

    const sendPushNotification = async (updatedSubscribe) => {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };
      const body = {
        endpoint: updatedSubscribe.endpoint,
        keys: {
          p256dh: updatedSubscribe.p256dh,
          auth: updatedSubscribe.auth,
        },
      };
      try {
        const res = await instance.post("webmessage/subscribe/", body, {
          headers,
        });
        // const res = {
        //   message: "Subscription saved.",
        // };
        if (res.status === 200) {
          console.log("구독정보 전송 완료");
        } else {
          console.log("구독정보 전송 실패");
        }
      } catch (err) {
        alert(err);
      }
    };

    // ArrayBuffer를 Base64로 변환하는 함수
    const arrayBufferToBase64 = (buffer) => {
      let binary = "";
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    };

    // Base64로 인코딩된 VAPID 공개 키를 Uint8Array로 변환하는 함수
    const urlBase64ToUint8Array = (base64String) => {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; i++) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    };

    fetchMyInfo();
    handlePushNotification();
  }, []);

  const handlePushOnOff = async () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    try {
      const res = await instance.put(
        `accounts/MyPage/alertOnOff/?user_id=${localStorage.getItem(
          "user_pk"
        )}`,
        {},
        { headers }
      );

      if (res.status === 200) {
        if (res.data.is_alert === true) {
          setAlertMessage("웹 푸시가 설정되었습니다");
        } else if (res.data.is_alert === false) {
          setAlertMessage("웹 푸시가 해제되었습니다");
        }
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 1500);
        setIsPushEnabled(res.data.is_alert);
      }
    } catch (err) {
      alert(err);
    }
  };

  const handleTimeChange = async (event) => {
    const newTime = event.target.value;
    setPushTime(newTime);

    const [newHour, newMin] = newTime.split(":");

    const body = {
      alert_hour: newHour,
      alert_min: newMin,
    };

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };

    try {
      const res = await instance.put(
        `/accounts/MyPage/alertHourMin/?user_id=${localStorage.getItem(
          "user_pk"
        )}`,
        body,
        { headers }
      );
      if (res.status === 200) {
        console.log("푸시 알림 시간 재설정 완료");
      } else {
        console.error("푸시 알림 시간 재설정 실패");
      }
    } catch (err) {
      console.error("푸시 알림 시간 재설정 에러", err);
    }
  };

  if (!userData) {
    return (
      <Notice>
        <Caption>
          마이페이지 로딩 중입니다
          <br />
          잠시만 기다려주세요
        </Caption>
        <Spinner />
      </Notice>
    );
  }

  return (
    <Container>
      <Heading1>My Page</Heading1>
      <Content>
        <Scrollabar>
          <Settings>
            <SectionTitle>Settings</SectionTitle>
            <SettingsItem>이름: {userData.name}</SettingsItem>
            <SettingsItem>
              웹 PUSH 알림 설정:
              <ToggleSwitch>
                <input
                  type="checkbox"
                  checked={isPushEnabled}
                  onChange={handlePushOnOff}
                />
                <Slider isEnabled={isPushEnabled}>
                  <SliderCircle isEnabled={isPushEnabled}></SliderCircle>
                  <SliderText isEnabled={isPushEnabled}>
                    {isPushEnabled ? "on" : "off"}
                  </SliderText>
                </Slider>
              </ToggleSwitch>
              <TimeInput
                type="time"
                disabled={!isPushEnabled}
                value={pushTime}
                onChange={handleTimeChange}
              />
            </SettingsItem>
          </Settings>
          <Challenges>
            <SectionTitle>My Challenge</SectionTitle>{" "}
            <ChallengeItem>
              <p>{`보유 아이템 개수: ${itemNum}`}</p>
              <icon title="아이템 1개 사용 시 초기화된 챌린지 일 수를 1회 복구합니다">
                ?
              </icon>
            </ChallengeItem>
            <ChallengeContent>
              <ChallengeStatus>{`${userData.DailyChallenges.current_day}일째 도전 중!`}</ChallengeStatus>
              매일매일 인터뷰에 참여해서 챌린지에 도전해보세요!
              <ProgressWrapper>
                <ProgressLabelLeft>{`${userData.DailyChallenges.start_day}일`}</ProgressLabelLeft>
                <ProgressBar>
                  <ProgressFill
                    progress={
                      userData.DailyChallenges.current_day /
                      userData.DailyChallenges.goal_day
                    }
                  />
                </ProgressBar>
                <ProgressLabelRight>{`${userData.DailyChallenges.goal_day}일`}</ProgressLabelRight>
              </ProgressWrapper>
            </ChallengeContent>
          </Challenges>
          <Badges>
            <SectionTitle>My Badge</SectionTitle>
            <BadgeContainer>
              {userData.Badges.map((badge) => (
                <Badge
                  src={badgeMap[badge.title]}
                  key={badge.id}
                  title={
                    badge.title == "1"
                      ? "첫 인터뷰 작성 뱃지"
                      : `${badge.title}` + "일 연속 인터뷰 달성 뱃지"
                  }
                ></Badge>
              ))}
            </BadgeContainer>
          </Badges>
        </Scrollabar>
      </Content>
      {showMessage && <AlertMessage>{alertMessage}</AlertMessage>}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  overflow: hidden;
`;

const Heading1 = styled.h1`
  margin-bottom: 41px;
  color: #3a3a3b;
  text-align: center;
  font-size: 36px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 7.2px;
`;

const Content = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 100%;
  background-color: #f9f9f1;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const Scrollabar = styled.div`
  margin: 40px;
  margin-bottom: 0px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  overflow-x: hidden;
  position: relative;

  &:hover {
    overflow-y: auto;
  }

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  color: #4f4a36;
  border-bottom: 1px solid #4f4a36;
  padding-bottom: 10px;
  margin-bottom: 20px;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Settings = styled.div`
  margin-top: 20px;
  margin-bottom: 40px;
`;

const SettingsItem = styled.div`
  font-size: 18px;
  color: #4f4a36;
  margin-left: 20px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  margin-left: 10px;

  input {
    display: none;
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => (props.isEnabled ? "#4F4A36" : "#ccc")};
  transition: 0.4s;
  border-radius: 34px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isEnabled ? "flex-end" : "flex-start")};
`;

const SliderCircle = styled.span`
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: ${(props) => (props.isEnabled ? "calc(100% - 28px)" : "2px")};
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
`;

const SliderText = styled.span`
  position: absolute;
  left: ${(props) => (props.isEnabled ? "10px" : "32px")};
  color: white;
  font-size: 13px;
  font-weight: bold;
  transition: 0.4s;
  z-index: 1;
`;

const TimeInput = styled.input`
  width: 130px;
  font-size: 16px;
  color: #666;
  margin-left: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Challenges = styled.div`
  margin-bottom: 30px;
`;

const ChallengeContent = styled.div`
  font-size: 18px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #4f4a36;
  margin: 50px 80px;
`;

const ChallengeStatus = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 50px;
`;

const ProgressBar = styled.div`
  position: relative;
  width: 100%;
  height: 20px;
  background-color: #d8d5c9;
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  width: ${(props) => props.progress * 100}%;
  height: 100%;
  background-color: #4f4a36;
  transition: width 0.4s ease;
`;

const ProgressLabelLeft = styled.div`
  margin-right: 10px;
  color: #4f4a36;
  font-size: 15px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  white-space: nowrap;
`;

const ProgressLabelRight = styled.div`
  margin-left: 10px;
  color: #4f4a36;
  font-size: 15px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  white-space: nowrap;
`;
const Badges = styled.div`
  margin-bottom: 100px;
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-left: 20px;
`;

const Badge = styled.img`
  width: 100px;
  height: 100px;
  margin: 3px;
  border-radius: 50%;
`;

const AlertMessage = styled.div`
  position: fixed;
  bottom: 100px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 30px;
  padding: 10px 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  font-size: 18px;
`;

const ChallengeItem = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
  align-items: center;
  p {
    color: #3a3a3b;
    font-size: 12px;
  }
  icon {
    margin-left: 8px;
    padding: 2px 5px;
    background-color: #3a3a3b;
    border-radius: 100%;
    color: white;
    font-size: 12px;
  }
`;

const Notice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

const Caption = styled.div`
  margin: 15px;
  margin-top: 30px;
  font-size: 20px;
  line-height: 130%;
  color: #4f4a36;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  margin: 20px 0px;
  border: 10px solid rgba(255, 255, 255, 0.5);
  border-top: 10px solid #4f4a36;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 2s linear infinite;
`;

export default MyInfoDetail;
