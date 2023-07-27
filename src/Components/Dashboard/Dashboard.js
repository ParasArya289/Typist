import { useEffect, useState } from "react";
import { formatTime } from "../../Utils";
import "./Dashboard.css";

export const Dashboard = ({
  count = 0,
  wordCount = 0,
  totalWordsTyped,
  totalWords,
  incorrectWordCount = 0,
  incorrectWord = 0,
  startedTyping,
  finishedTyping,
  setStartedTyping,
  setFinishedTyping,
  restart,
  setRestart,
  userInputRef,
  setUserInput,
}) => {
  const [wpm, setWpm] = useState(0);
  const [timer, setTimer] = useState(1);
  const [startTime, setStartTime] = useState(0);
  const [startGame, setStartGame] = useState(false);

  const timeElapsedMinutes = timer / 60;
  const accuracy = (
    (Math.max(0, wordCount - incorrectWord) /
      totalWordsTyped.split(" ").length || 0) * 100
  ).toFixed(2);
  console.log(wordCount, incorrectWord);

  useEffect(() => {
    const interval = setInterval(() => {
      if (startedTyping) {
        setTimer((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, startedTyping]);

  useEffect(() => {
    if (startedTyping) {
      // setTimer(1);
    }
  }, [startedTyping]);

  useEffect(() => {
    if (restart) {
      setTimer(() => 1);
      setWpm(() => 0);
      setRestart(() => false);
      setUserInput(() => "");
      setFinishedTyping(() => false);
      setStartedTyping(() => false);
      userInputRef.current.disabled = false;
    }
  }, [restart]);

  return (
    <div className="dashboard">
      <div>
        <h4 className="wpm">
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
            (timer - 1) / (120 / 100)
          }%,var(--primary-color) 0)`,
          borderRadius: "50%",
          transition: "all 10s ease",
        }}
      >
        <h3>{formatTime(timer) || "0:00"}</h3>
      </div>
      <div>
        <h4>
          {accuracy}%
          <br />
          ACCURACY
        </h4>
      </div>
    </div>
  );
};
