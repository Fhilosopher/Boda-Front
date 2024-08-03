import Swal from "sweetalert2";
import "./Alert.css";
import AlertImg from "./../../assets/img/AlertImg.svg";

function TimeAlert(onConfirm) {
  Swal.fire({
    title: "15분 후에 자동으로 메인페이지로 이동합니다",
    text: "매일 오전 5시에 사이트가 초기화됩니다",
    imageUrl: AlertImg,
    confirmButtonText: "확인",
    confirmButtonColor: "#4F4A36",
    width: "30%",
    buttonsStyling: false,
    customClass: {
      popup: "my-custom-alert",
      confirmButton: "my-confirm-button",
    },
  });
}

export default TimeAlert;
