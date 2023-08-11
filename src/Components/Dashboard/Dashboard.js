import { useEffect, useMemo, useState } from "react";
import { formatTime } from "../../Utils";
import "./Dashboard.css";
import {
  animate,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";

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

  const controls = useAnimation();

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


  // || (timer - 1) / (120 / 100)

  const { freeStyle } = useMemo(() => {
    let freeStyle = 0;
    if (timer === 1) {
      freeStyle = 0;
      setCycle(() => 0);
    } else if ((timer - 1) % 60 === 0) {
      setCycle(() => 1);
      freeStyle = 100;
    } else {
      freeStyle = ((timer) % 60) * 1.6666666667;
    }
    return { freeStyle };
  }, [timer, cycle]);


  useEffect(() => {
    controls.start({
      backgroundImage: cycle
        ? `conic-gradient(
                   var(--primary-color) ${freeStyle || 100}%,
              var(--accent-color) ${0}%)`
        : `conic-gradient(
                var(--accent-color) ${freeStyle}%,
           var(--primary-color) ${0}%)`,
      transition: { duration: 1, delay: 0, type: "linear" },
    });
  }, [timer, cycle, controls]);

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
        animate={controls}
        // transition={{ duration: 1, delay: 0, type: "linear" }}
        className="timer"
        style={{
          minWidth: "80px",
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
