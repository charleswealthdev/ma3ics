import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const TaskZone = () => {
  // Set the deadline date (February 28, 2024)
  const deadlineDate = new Date("2024-02-28T00:00:00Z");

  // Calculate the remaining time in seconds
  const initialRemainingTime = Math.max(0, Math.floor((deadlineDate.getTime() - Date.now()) / 1000));

  const [remainingTime, setRemainingTime] = useState(initialRemainingTime);

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemainingTime = Math.max(0, Math.floor((deadlineDate.getTime() - Date.now()) / 1000));
      setRemainingTime(newRemainingTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [deadlineDate]);

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Fill form!</h2>
          {/* Add your custom component/content here */}
        </div>
      );
    }

    const days = Math.floor(remainingTime / 86400);
    const hours = Math.floor((remainingTime % 86400) / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    return (
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800 mb-4">Countdown</p>
        <div className="text-1.6xl text-blue-600">
          {days > 0 && <span>{days}d </span>}
          {hours > 0 && <span>{hours}h </span>}
          {minutes > 0 && <span>{minutes}m </span>}
          {seconds}s
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center ">
      <div className="bg-white shadow-lg  p-9 w-full max-w-md">
        <div className="mt-5">
          <CountdownCircleTimer
            isPlaying
            duration={remainingTime}
            colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
            onComplete={() => [true, 0]}
          >
            {renderTime}
          </CountdownCircleTimer>
        </div>
      </div>
    </div>
  );
};

export default TaskZone;
