
import { useEffect, useState } from "react"

function Timer({duration,onTimeUp}) {

    const [time, setTime] = useState(duration)

    useEffect(() => {
    const interval = setInterval(() => {
    setTime(prev => {
      if (prev == 1) {
        clearInterval(interval); // 🛑 stop timer
        onTimeUp();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [onTimeUp]);


    const minutes = Math.floor(time / 60)
    const seconds = time % 60

    return (

        <div className="bg-red-600 text-white px-4 py-2 rounded font-bold">

            ⏱ {minutes}:{seconds < 10 ? "0" + seconds : seconds}

        </div>

    )

}

export default Timer