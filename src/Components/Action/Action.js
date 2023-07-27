import { useState } from "react";

export const Action = ({ finishedTyping, startedTyping }) => {
  const [restart, setRestart] = useState(false);
  return (
    <>{finishedTyping || (startedTyping && <button>{"Restart"}</button>)}</>
  );
};
