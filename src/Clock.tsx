import { useState, useEffect } from 'react';
import './Clock.scss'

  


function Clock(){
    const [date, setDate] = useState(new Date());
    
    function refreshClock() {
      setDate(new Date());
    }

    useEffect(() => {
      const timerId:number = setInterval(refreshClock, 10000);
      
      return function cleanup() {
        clearInterval(timerId);
      };
    }, []);
    return (
      <div className='clockContainer'>
        
        {`${date.getHours().toString()}:${date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes().toString()}`}
      </div>
    );
  }
  export {Clock};