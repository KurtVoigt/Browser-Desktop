import './Desktop.scss';
import { TaskBar } from './taskBar';
import * as React from 'react';
import { StartButton } from './StartButton';
import { Clock } from './Clock';
import { StartMenu } from './StartMenu';
import { Process } from './process';
import Draggable from 'react-draggable';
import App from './App';


//checked open up the start menu!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
//Next, open up a draggable div!, and menu choices on hover

class ApplicationProcess {
    public name: string;
    static GlobalID: number = 0;
    public pID: number;
    constructor(name: string) {
        this.name = name;
        this.pID = ++ApplicationProcess.GlobalID;
    }
    //Open()/Close()?
}





//STATE FOR RUNNING WINDOWS
enum PROCESS_REDUCER_ACTION_TYPES {
    open_program = "OPEN_PROGRAM",
    close_program = "CLOSE_PROGRAM",
    start_drag = "START_DRAG",
    end_drag = "END_DRAG",
}

interface ProcessAction {
    type: PROCESS_REDUCER_ACTION_TYPES;
    payload: {
        process: ApplicationProcess | number;
    };

}



type ProcessState = {
    openProcesses: ApplicationProcess[];
    
}

const initialState: ProcessState = {
    openProcesses: [],
}



//TODO: figure out a way to just pass in number instead of whole process
const programsReducer = (state: ProcessState, action: ProcessAction): ProcessState => {

    switch (action.type) {
        case (PROCESS_REDUCER_ACTION_TYPES.open_program):
            if (typeof action.payload.process !== "number") {
                let newProcess = action.payload.process as ApplicationProcess;
                let newState = [...state.openProcesses, newProcess];
                return { ...state, openProcesses: newState };
            }
            else {
                return state;
            }

        //state.openProcesses.push(action.payload.process);

        case (PROCESS_REDUCER_ACTION_TYPES.close_program):
            if (typeof action.payload.process === "number") {
                return {
                    openProcesses: state.openProcesses.filter((program) => {
                        return (program.pID !== action.payload.process);
                    })
                };
            }
            else {
                return state;
            }

        case(PROCESS_REDUCER_ACTION_TYPES.end_drag):
            


        default:
            console.log("error in process reducer");
            return state;


    }
}

//STATE/HOOKS FOR 



const Desktop: React.FC = ({

}) => {



    const [processes, dispatchProcesses] = React.useReducer(programsReducer, initialState);
    const [startMenuOpen, setStartMenuOpen] = React.useState(false);
    const [installedApps, setInstalledApps] = React.useState(["Etch-A-Sketch", "Text Editor"]);
    const desktopRef = React.useRef<HTMLDivElement>(null)
    let desktopHeight: number;
    let desktopWidth: number;
    


    //updates ref on render so that process can access height/width for dragging purposes.
    React.useEffect ( () => {
        
        if(desktopRef.current){
            
             desktopHeight = desktopRef.current.offsetHeight;
             desktopWidth  = desktopRef.current.offsetWidth;
            
        }
        
        
        
    }, [desktopRef]);



    const handleStartButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setStartMenuOpen(!startMenuOpen);

    }
    const handleDesktopClick = () => {
        setStartMenuOpen(false);

    }

    const handleStartMenuClick = (event: React.MouseEvent<Element, MouseEvent>) => {
        let ele = event.target as HTMLDivElement;
        switch (ele.innerText) {
            case "app 1":
                dispatchProcesses(
                    {
                        type: PROCESS_REDUCER_ACTION_TYPES.open_program,
                        payload: { process: new ApplicationProcess("Text Editor") }
                    }

                );
                return;

            case "app 2":
                dispatchProcesses(
                    {
                        type: PROCESS_REDUCER_ACTION_TYPES.open_program,
                        payload: { process: new ApplicationProcess("app 2") }
                    }

                );
                return;

            case "app 3":
                dispatchProcesses(
                    {
                        type: PROCESS_REDUCER_ACTION_TYPES.open_program,
                        payload: { process: new ApplicationProcess("app 3") }
                    }

                );
                return;

            case "app 4":
                dispatchProcesses(
                    {
                        type: PROCESS_REDUCER_ACTION_TYPES.open_program,
                        payload: { process: new ApplicationProcess("app 4") }
                    }

                );
                return;
        }
    }

    const handleCloseApp = (processID: number) => {


        dispatchProcesses({
            type: PROCESS_REDUCER_ACTION_TYPES.close_program,
            payload: {
                process: processID,
            }
        })
    }

    //return jsx :)
    const buildAppGuis = (processes: ApplicationProcess[]): JSX.Element => {
        return (
            <React.Fragment>
                {
                    processes.map((process) => {
                        return (
                            <Process exitApp={handleCloseApp} process={process} parentRef={desktopRef} key={process.pID}/>
                        );
                    })
                }
            </React.Fragment>
        );
    }

    
    return (
        <div className='desktopContainer'>
            <div className='desktop' onClick={handleDesktopClick} ref={desktopRef}>
                <StartMenu visible={startMenuOpen} onProgramSelect={handleStartMenuClick} installedApps={installedApps}/>
                <TaskBar>
                    <StartButton onClick={handleStartButtonClick} startMenuOpen={startMenuOpen}></StartButton>
                    <Clock />
                </TaskBar>
                                                    
                {buildAppGuis(processes.openProcesses)}
                
            </div>
        </div>
    );
}


export { Desktop, ApplicationProcess, }
