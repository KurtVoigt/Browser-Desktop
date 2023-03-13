import './taskBar.scss'
import { StartButton } from './StartButton';
import { Clock } from './Clock';
import * as React from "react";

type taskBarProps = {
    children: React.ReactNode,
}

const TaskBar: React.FC<taskBarProps> = ({
    children
})=>{
    
    return(
        <div className="taskBar">
          {children}
        </div>
    )
}

export {TaskBar};