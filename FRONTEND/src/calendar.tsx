import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import "./calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function Sample() {
  const [value, onChange] = useState<Value>(new Date());
  const [nowDate, setNowDate] = useState("날짜");
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleCalendar = () => {
    setIsOpen(!isOpen);
  };

  const handleDateChange = (selectedDate) => {
    onChange(selectedDate);
    setIsOpen(false);
    setNowDate(moment(selectedDate).format("YYYY년 MM월 DD일"));
  };
  return (
    <div>
      <header>
        <h1>토글</h1>
      </header>
      <div>
        <main>
          {/* <Calendar onChange={onChange} value={value} /> */}
          <Calendar
            onChange={handleDateChange}
            value={value}
            formatDay={(locale, date) => moment(date).format("DD")}
          ></Calendar>
        </main>
      </div>
    </div>
  );
}

export default Sample;
