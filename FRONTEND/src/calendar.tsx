import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import "./calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function Sample() {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div>
      <header>
        <h1>토글</h1>
      </header>
      <div>
        <main>
          <Calendar onChange={onChange} value={value} />
        </main>
      </div>
    </div>
  );
}

export default Sample;
