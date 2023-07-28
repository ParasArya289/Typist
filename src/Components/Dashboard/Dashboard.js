import { useEffect, useMemo, useState } from "react";
import { formatTime } from "../../Utils";
import "./Dashboard.css";
import { motion } from "framer-motion";

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
  const [startTime, setStartTime] = useState();
  const [startGame, setStartGame] = useState(false);
  const [cycle, setCycle] = useState(0);

  const timeElapsedMinutes = timer / 60;
  const accuracy = (
    (Math.max(0, wordCount - incorrectWord) /
      totalWordsTyped.split(" ").length || 0) * 100
  ).toFixed(2);

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
      userInputRef.current.focus();
    }
  }, [restart]);

  // const freeStyle =
  //   timer === 1 ? 0 : (timer - 1) % 60 === 0 ? 100 : ((timer - 1) % 60) * 1.66;
  // || (timer - 1) / (120 / 100)

  const { freeStyle } = useMemo(() => {
    let freeStyle = 0;
    if (timer === 1) {
      setCycle(() => 0);
      freeStyle = 0;
    } else if ((timer - 1) % 60 === 0) {
      setCycle(() => 1);
      freeStyle = 100;
    } else {
      freeStyle = ((timer - 1) % 60) * 1.66;
    }
    return { freeStyle };
  }, [timer, cycle]);

  console.log(freeStyle, cycle);

  // const gradientKeyframes = {
  //   "0%": {
  //     backgroundImage: `conic-gradient(var(--accent-color) 0%, var(--primary-color) 0%)`,
  //   },
  //   "100%": {
  //     backgroundImage: `conic-gradient(${
  //       cycle ? "var(--primary-color)" : "var(--accent-color)"
  //     } ${freeStyle}%,
  //         ${
  //           cycle ? "var(--accent-color)" : "var(--primary-color)"
  //         } ${freeStyle}%)`,
  //   },
  // };

  return (
    <div className="dashboard">
      <div>
        <h4 className="wpm">
          {(wordCount / timeElapsedMinutes || 0).toFixed(2) || 0}
          <br />
          WPM
        </h4>
      </div>
      <motion.div
        // animate={{ backgroundImage: gradientKeyframes }}
        transition={{ duration: 1, delay: 0.2 }}
        key={freeStyle}
        className="timer"
        style={{
          minWidth: "80px",
          backgroundImage: `conic-gradient(
            ${
              cycle
                ? `var(--primary-color) ${freeStyle}%,
            var(--accent-color) ${0}%`
                : `var(--accent-color) ${freeStyle}%,
            var(--primary-color) ${0}%`
            }
            
    )`,
          borderRadius: "50%",
        }}
      >
        <h3>{formatTime(timer) || "0:00"}</h3>
      </motion.div>
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
