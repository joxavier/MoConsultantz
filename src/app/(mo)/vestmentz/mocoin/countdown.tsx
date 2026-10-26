import { useEffect, useState } from 'react';
import { TimerContainer } from './timer/timerContainer';

interface CountdownProps {
    countdownDate: number;
}

const Countdown: React.FC<CountdownProps> = ({ countdownDate }) => {
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  let countDownDate = countdownDate;

    const updateTime = setInterval(() => {
      const now = new Date().getTime();
      const difference = countDownDate - now;
      const newDays = Math.floor(difference / (1000 * 60 * 60 * 24));
      const newHours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const newMinutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const newSeconds = Math.floor((difference % (1000 * 60)) / 1000);

      setDays(newDays);
      setHours(newHours);
      setMinutes(newMinutes);
      setSeconds(newSeconds);

      if (difference <= 0) {
        clearInterval(updateTime);
        setMessage('The Launch Has Started');
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }
    });

  return (
    <div>
      <TimerContainer days={days} hours={hours} minutes={minutes} seconds={seconds} />
    </div>
  );
};

export default Countdown;
