import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import "./CustomCalender.css";
import { isSaturday, isSunday } from "date-fns";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function CustomCalender() {
  const formatMonthYear = (locale, date) => {
    return date.toLocaleString("en-US", { month: "long" });
  };
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

  //토요일, 일요일 색상 구분을 위한 함수
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      if (isSaturday(date)) return "saturday";
      if (isSunday(date)) return "sunday";
    }
  };
  return (
    <div>
      <div>
        <main>
          <Calendar
            locale="en-US" //월화수목금토일 영어로
            onChange={handleDateChange}
            value={value}
            formatDay={(locale, date) => moment(date).format("DD")}
            formatMonthYear={formatMonthYear}
            tileClassName={tileClassName}
          ></Calendar>
        </main>
      </div>
    </div>
  );
}

export default CustomCalender;
