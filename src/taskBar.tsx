import './taskBar.scss'
import { StartButton } from './StartButton';
import { Clock } from './Clock';
import * as React from "react";
import { ApplicationProcess } from './Desktop';
import { AppBarEntry } from './appBarEntry';

type taskBarProps = {
    children: React.ReactNode,
    openProcesses: ApplicationProcess[],
    focusNewProcess: (processId:number) => void,
    focusedProcess:number | null,
}

const TaskBar: React.FC<taskBarProps> = ({
    children, 
    openProcesses,
    focusNewProcess,
    focusedProcess
})=>{

    
    function createSlots(p: ApplicationProcess[]):JSX.Element{
        return(
            <React.Fragment>
                {
                    p.map((process) => {
                        let focused = false;
                        if(focusedProcess !== null){
                            if(process.pID === focusedProcess){
                                focused = true;
                            }
                        }
                        return(
                            <AppBarEntry name={process.name} id={process.pID} onClick={focusNewProcess} focused = {focused} key={process.pID}/>
                        );
                    })
                }
            </React.Fragment>
        )
    }
    return(
        <div className="taskBar">
          {children}
          <div className='appBarStorage'>
            {createSlots(openProcesses)}
          </div>
        </div>
        
    )
}

export {TaskBar};