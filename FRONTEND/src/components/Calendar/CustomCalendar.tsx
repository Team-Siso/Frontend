import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment"; //오늘 날짜
import "./CustomCalendar.css";
import { isSaturday, isSunday } from "date-fns";
import Toggle from "../Toggle";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function CustomCalendar() {
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

  // 월 클릭 이벤트 핸들러
  const handleMonthClick = (event) => {
    // 이벤트 전파를 막음
    event.stopPropagation();
  };
  const handleToggleChange = (value: boolean, setting: string) => {
    console.log(`${setting} is now ${value ? "enabled" : "disabled"}.`);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "10px",
        marginRight: "10px",
      }}>
        <Toggle
          id="monthly-weekly-toggle"
          label=""
          onToggle={(value) => handleToggleChange(value, "monthly-weekly-Change")}
        />
      </div>
      <main style={{ flex: 1 }}>
        <Calendar
          locale="en-US"
          onChange={handleDateChange}
          value={value}
          formatDay={(locale, date) => moment(date).format("DD")}
          formatMonthYear={formatMonthYear}
          tileClassName={tileClassName}
          showNeighboringMonth={false}
          onClickMonth={handleMonthClick}
          tileContent={({ date, view }) => <div className="date-tile">{date.getDate()}</div>}
        />
      </main>
    </div>
  );
}

export default CustomCalendar;
