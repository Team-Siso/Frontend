import React, { useEffect, useRef } from "react";

function Circle({ num }) {
  const circle = [0, 25, 50, 75, 100];
  return (
    <div className="circles">
      {circle.map((el, index) => {
        console.log(num);
        return <span className={num >= el && "on"}></span>;
      })}
    </div>
  );
}

export default Circle;
