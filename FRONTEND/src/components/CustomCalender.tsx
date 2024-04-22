import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment"; //오늘 날짜
import "./CustomCalender.css";
import { isSaturday, isSunday } from "date-fns";
import Toggle from "./Toggle";

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

  // 월 클릭 이벤트 핸들러
  const handleMonthClick = (event) => {
    // 이벤트 전파를 막음
    event.stopPropagation();
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
            showNeighboringMonth={false} //  이전, 이후 달의 날짜는 보이지 않도록 설정
            onClickMonth={handleMonthClick}
            tileContent={({ date, view }) => <div className="date-tile">{date.getDate()}</div>}
          ></Calendar>
          <div className="calendar-navigation">
            <button>←</button>
            <button>→</button>
            <Toggle /> {/* 여기에 토글 컴포넌트 추가 */}
          </div>
        </main>
      </div>
    </div>
  );
}

export default CustomCalender;
