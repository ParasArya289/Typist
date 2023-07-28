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
      freeStyle = 0;
      setCycle(() => 0);
    } else if ((timer - 1) % 60 === 0) {
      setCycle(() => 1);
      freeStyle = 100;
    } else {
      freeStyle = ((timer - 1) % 60) * 1.66;
    }
    return { freeStyle };
  }, [timer, cycle]);

  console.log(freeStyle, cycle);

  // const count = useMotionValue(0);
  // const rounded = useTransform(count, (latest) => Math.round(latest));

  // useEffect(() => {
  //   const controls = animate(freeStyle - 1, freeStyle);

  //   return controls.stop;
  // }, []);

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
