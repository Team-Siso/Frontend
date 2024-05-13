import React from "react";

function Percent() {
  const num = [0, 25, 50, 75, 100];
  return (
    <div className="num">
      {num.map((el, index) => {
        return <span className={"percent" + index}>{el}%</span>;
      })}
    </div>
  );
}

export default Percent;
