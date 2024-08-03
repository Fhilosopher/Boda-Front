import React, { useRef, useEffect } from "react";
import "./AnswerTextArea.css";

const AnswerTextArea = React.forwardRef(
  ({ value, onChange, placeholder }, ref) => {
    const textareaRef = useRef(null);

    useEffect(() => {
      const textarea = ref ? ref.current : textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value, ref]);

    return (
      <textarea
        ref={ref || textareaRef}
        value={value}
        onChange={onChange}
        className="textarea"
        placeholder={placeholder}
      />
    );
  }
);

AnswerTextArea.displayName = "AnswerTextArea";

export default AnswerTextArea;
