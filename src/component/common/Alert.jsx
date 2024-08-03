import Swal from "sweetalert2";
import "./Alert.css";

function Alert(title, text, imageUrl, confirmButtonText, onConfirm) {
  Swal.fire({
    title: title,
    text: text,
    imageUrl: imageUrl,
    confirmButtonText: confirmButtonText,

    showCancelButton: true,
    confirmButtonColor: "#4F4A36",
    cancelButtonColor: "#4F4A3696",
    width: "30%",
    buttonsStyling: false,
    customClass: {
      popup: "my-custom-alert",
      confirmButton: "my-confirm-button",
      cancelButton: "my-cancel-button",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      if (onConfirm) {
        onConfirm();
      }
    }
  });
}

export default Alert;
