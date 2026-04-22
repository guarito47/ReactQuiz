import { useEffect } from "react";

function Timer({ dispatch, secondsRemaining }) {
  const min = Math.floor(secondsRemaining / 60);
  const sec = secondsRemaining % 60;

  useEffect(
    function () {
      const id = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);

      /*cleanUp function to dont have the problem that this function keeps running even
      //when timer is unmounted, we stop that process using clearInterval, 
      // that receives the id of the process*/
      return () => clearInterval(id);
    },
    [dispatch],
  );

  return (
    <div className="timer">
      {min < 10 && "0"}
      {min}:{sec < 10 && "0"}
      {sec}
    </div>
  );
}

export default Timer;
