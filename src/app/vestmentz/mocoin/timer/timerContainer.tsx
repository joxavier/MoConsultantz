import React from 'react'
//import { useMediaQuery } from 'react-responsive';
import { NumberBox } from './NumberBox'

interface timeProps{
  days: number | string,
  hours:number | string ,
  minutes:number | string,
  seconds:number | string,
}

export const TimerContainer = ({days, hours, minutes ,seconds }: timeProps) => {

  let daysFlip = false;
  let hoursFlip = false;
  let minutesFlip = false;
  let secondsFlip = true;
//@ts-ignore
 if (seconds <=0 && minutes <=0 && hours <=0 && days <=0){
   daysFlip =  false;
   hoursFlip =  false;
   minutesFlip = false;
   secondsFlip = false;
 }

 if(seconds == 0){
   if( minutes !=0){
    seconds=59;
   }
   
   secondsFlip = false;
   minutesFlip = true;
 }
 if (minutes == 0 ){
    if( hours !=0){
      minutes=59;
    }
   
   minutesFlip = false;
   hoursFlip = true;
 }

 if( hours == 0){
   hoursFlip = false;
   if(days !=0){
     daysFlip = true;
   }
   
 }

 
//@ts-ignore
   if(days <10){
     days="0"+days
   }
//@ts-ignore
   if(hours <10){
     hours="0"+hours
   }
//@ts-ignore
   if(minutes <10){
     minutes="0"+minutes
   }
//@ts-ignore
   if(seconds < 10){
     seconds="0"+seconds
     
   }

   const isMediumScreenOrSmaller = false;//useMediaQuery({ width: 390 });
  
    return (
        
    <div className="rounded-xl">
      <div className={`flex gap-4 py-6 px-10  rounded-xl`}>
        <NumberBox num={days} unit="Day" flip={daysFlip} />
        {isMediumScreenOrSmaller && (
          <>
            <span className="hidden  md:text-7xl font-normal text-gray-50">:</span>
            <NumberBox num={hours} unit="Hours" flip={hoursFlip} />
            <span className="hidden  md:text-7xl font-normal text-gray-50">:</span>
            <NumberBox num={minutes} unit="Minutes" flip={minutesFlip} />
          </>
        )}
        {!isMediumScreenOrSmaller && (
          <>
            <span className="hidden  md:text-7xl font-normal text-gray-50">:</span>
            <NumberBox num={hours} unit="Hours" flip={hoursFlip} />
            <span className="hidden md:text-7xl font-normal text-gray-50">:</span>
            <NumberBox num={minutes} unit="Minutes" flip={minutesFlip} />
            <span className="hidden md:text-7xl font-normal text-gray-50">:</span>
            <NumberBox num={seconds} unit="Seconds" flip={secondsFlip} />
          </>
        )}
      </div>
    </div>






    )
}