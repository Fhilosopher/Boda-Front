import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import sliderFirst from "../../assets/img/sliderFirst.svg";
import sliderSecond from "../../assets/img/sliderSecond.svg";
import sliderThird from "../../assets/img/sliderThird.svg";
import expandleft from "../../assets/img/expand_left.svg";
import expandright from "../../assets/img/expand_right.svg";

const FirstSection = () => {
  const [curSlide, setCurSlide] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const imgBoxRef = useRef(null);

  const sliderCompartment = [sliderFirst, sliderSecond, sliderThird];
  const FIRST_SLIDE_INDEX = 0;
  const LAST_SLIDE_INDEX = sliderCompartment.length - 1;
  const MOVE_SLIDE_INDEX = 1;

  const moveToSlide = (value) => {
    if (value === "next") {
      setCurSlide((prevState) =>
        prevState < LAST_SLIDE_INDEX
          ? prevState + MOVE_SLIDE_INDEX
          : FIRST_SLIDE_INDEX
      );
    }
    if (value === "prev") {
      setCurSlide((prevState) =>
        prevState > FIRST_SLIDE_INDEX
          ? prevState - MOVE_SLIDE_INDEX
          : LAST_SLIDE_INDEX
      );
    }
  };

  useEffect(() => {
    const updateSlideWidth = () => {
      if (imgBoxRef.current) {
        setSlideWidth(imgBoxRef.current.offsetWidth);
      }
    };
    updateSlideWidth();
    window.addEventListener("resize", updateSlideWidth);
    return () => window.removeEventListener("resize", updateSlideWidth);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      moveToSlide("next");
    }, 2000);

    return () => clearInterval(interval);
  }, [curSlide]);

  return (
    <FirstSectionWrapper>
      <SliderContainer>
        <button
          src={expandleft}
          className="prev-button"
          onClick={() => moveToSlide("prev")}
        >
          <img src={expandleft} />
        </button>
        <ImgBox ref={imgBoxRef}>
          {sliderCompartment.map((item, index) => (
            <div
              className="compartment"
              key={index}
              style={{
                transform: `translateX(${-slideWidth * curSlide}px)`,
                transition: "all 0.4s ease-in-out",
                backgroundImage: `url(${item})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
        </ImgBox>
        <button
          src={expandright}
          className="next-button"
          onClick={() => moveToSlide("next")}
        >
          <img src={expandright} />
        </button>
        <Dots>
          {sliderCompartment.map((_, index) => (
            <Dot key={index} active={curSlide === index} />
          ))}
        </Dots>
      </SliderContainer>
    </FirstSectionWrapper>
  );
};

const FirstSectionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 700px;
  background-color: #ece8d6;
`;

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 600px;

  .prev-button,
  .next-button {
    display: flex;
    position: absolute;
    top: 0;
    border: none;
    cursor: pointer;
    font-size: 50px;
    color: #4f4a36;
    width: 50px;
    height: 100%;
    z-index: 1;
    align-items: center;
    justify-content: center;
    padding: 100px;
    transition: all 0.3s ease-in-out;

    img {
      width: 80px;
    }
  }

  .prev-button {
    left: 0;
    &:hover {
      transform: translateX(-20px);
      transition: all 0.2s ease-in-out;
    }
  }

  .next-button {
    right: 0;
    &:hover {
      transform: translateX(20px);
      transition: all 0.2s ease-in-out;
    }
  }
`;

const ImgBox = styled.div`
  display: flex;
  width: 100%;
  height: 600px;
  overflow: hidden;
  align-items: center;

  .compartment {
    flex-shrink: 0;
    width: 100%;
    height: 600px;
    font-size: 40px;
    text-align: center;
  }
`;

const Dots = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  margin: 0 5px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "#4F4A36" : "#CDC8B6")};
`;

export default FirstSection;
