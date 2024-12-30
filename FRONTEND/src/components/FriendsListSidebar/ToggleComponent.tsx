import { useState } from "react";

const ToggleComponent = () => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };
  return (
    <div className="inline-block w-[180px] h-[60px] relative">
      <input type="checkbox" checked={isOn} onClick={handleToggle} />
      <span className="absolute rounded-s "></span>
      <label htmlFor="toggle" className="switch"></label>
    </div>
  );
};

export default ToggleComponent;
