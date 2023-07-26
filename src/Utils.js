export const formatTime = (timeInSec) => {
  let sec = 0;
  let min = 0;
  let formattedString = "0:00";
  if (timeInSec > 1) {
    min = Math.trunc(timeInSec / 60);
    sec = timeInSec % 60;
    console.log(sec);

    const formattedMins = min < 10 ? `${min}` : min;
    const formattedSeconds = sec < 10 ? `0${sec}` : sec;
    formattedString = `${formattedMins}:${formattedSeconds}`;
  }

  return formattedString;
};
