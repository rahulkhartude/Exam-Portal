import {useEffect,useState} from "react";

function Timer({duration,onTimeUp}){

const [time,setTime]=useState(duration);

useEffect(()=>{

const timer=setInterval(()=>{

setTime(prev=>{

if(prev<=1){
clearInterval(timer)
onTimeUp()
return 0
}

return prev-1

})

},1000)

return ()=>clearInterval(timer)

},[])

const minutes=Math.floor(time/60)
const seconds=time%60

return(

<div className="timer">

Time Left :
{minutes}:{seconds<10?"0"+seconds:seconds}

</div>

)

}

export default Timer