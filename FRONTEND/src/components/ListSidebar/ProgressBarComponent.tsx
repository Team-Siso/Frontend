import React, { useState, useEffect, useRef } from "react";
import "./ProgressBarComponent.css";

import Circle from "./Circle";
import Percent from "./Percent";
const ProgressBarComponent = () => {
  const circle = useRef(null);
  const box = useRef(null);
  const [con, setCon] = useState(null);
  const [cir, setCir] = useState(null);
  let h1 = useRef(null);
  const [num, setNum] = useState(null);

  useEffect(() => {
    const conWidth = box.current.getBoundingClientRect().width;
    setCon(conWidth);
    const circleWidth = circle.current.getBoundingClientRect().width;
    setCir(circleWidth);
  }, []);

  let isDragging = null;
  let originX = null;
  let originLeft = null;
  let result;

  const drag = (e) => {
    isDragging = true;
    originX = e.clientX;
    originLeft = circle.current.offsetWidth;
  };
  const move = (e) => {
    if (isDragging) {
      const diffX = e.clientX - originX;
      const endX = con - cir;
      //circle.current.style.left = `${Math.min(Math.max(0, originLeft + diffX),endX)}px`;
      circle.current.style.width = `${Math.min(Math.max(0, originLeft + diffX), endX)}px`;
    }
  };
  const stop = (e) => {
    isDragging = false;
  };

  const getPercent = (e) => {
    const totalWidth = box.current.offsetWidth;
    const circlePosition = circle.current.offsetWidth; // 이는 드래그에 따라 너비가 증가한다고 가정한 것입니다
    const percentage = (circlePosition / totalWidth) * 100;
    setNum(percentage.toFixed(0)); // 정수 퍼센트 값 보장
    h1.current.innerText = percentage.toFixed(0) + "%";
  };

  const init = (e) => {
    let endX = con - cir;
    circle.current.style.width = `${Math.min(
      Math.max(0, e.clientX - e.currentTarget.offsetLeft),
      endX
    )}px`;
  };

  return (
    <div className="container">
      {/* <div className="percent">
        <h1 ref={h1}>0%</h1>
      </div> */}
      <div>
        <span
          className="bar"
          onMouseMove={(e) => {
            move(e);
            getPercent(e);
          }}
          ref={box}
          onMouseUp={(e) => {
            stop(e);
            init(e);
          }}
          onMouseLeave={(e) => {
            stop(e);
          }}
        >
          <Circle num={num} />
          <span
            className="progress"
            onMouseDown={(e) => {
              drag(e);
            }}
            ref={circle}
          ></span>

          <Percent />
        </span>
      </div>
    </div>
  );
};
export default ProgressBarComponent;
