import { useEffect, useState } from "react";
import { formatTime } from "../../Utils";
import "./Dashboard.css";

export const Dashboard = ({
  count = 0,
  wordCount = 0,
  totalWordsTyped,
  totalWords,
}) => {
  const [wpm, setWpm] = useState(0);
  const [timer, setTimer] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [startGame, setStartGame] = useState(false);

  const timeElapsedMinutes = timer / 60;
  const accuracy =(( wordCount/ totalWords.length) * 100).toFixed(2);
  console.log(wordCount,totalWords)

  useEffect(() => {
    const interval = setInterval(() => {
      if (startTime) {
        setTimer((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    if (startGame) {
      setStartTime(new Date());
    } else {
      setStartTime(null);
      setTimer(0);
      setWpm(0);
    }
  }, [startGame]);
  console.log(formatTime(700));

  return (
    <div className="dashboard">
      <div>
        <h4>
          {(wordCount / timeElapsedMinutes || 0).toFixed(2) || 0}
          <br />
          WPM
        </h4>
      </div>
      <div
        className="timer"
        style={{
          minWidth: "80px",
          backgroundImage: `conic-gradient(var(--accent-color),${
            timer / (120 / 100)
          }%,var(--primary-color) 0)`,
          borderRadius: "50%",
          transition: "all 10s ease",
        }}
      >
        <h3>{formatTime(timer) || "0:00"}</h3>
      </div>
      <div>
        <h4>
          {accuracy}
          <br />
          ACCURACY
        </h4>
      </div>
      <button onClick={() => setStartGame((prev) => !prev)}>
        {startGame ? "cancel" : "start"}
      </button>
    </div>
  );
};
