import './Desktop.scss';
import { TaskBar } from './taskBar';
import * as React from 'react';
import { StartButton } from './StartButton';
import { Clock } from './Clock';
import { StartMenu } from './StartMenu';
import { Process } from './process';
import { AppBarEntry } from './appBarEntry';
import Draggable from 'react-draggable';
import App from './App';
import { FileIcon } from './FileIcon';



class ApplicationProcess {
    //might have to change this when it is possible to shut off app
    static GlobalID: number = 0;
    public name: string;
    public pID: number;
    public collapsed: boolean;
    public data: any;
    constructor(name: string, data?: any) {
        this.name = name;
        this.pID = ++ApplicationProcess.GlobalID;
        this.collapsed = false;
        if (data) {
            this.data = data;
        }
        else {
            this.data = null;
        }
    }


}





//STATE FOR RUNNING WINDOWS
enum PROCESS_REDUCER_ACTION_TYPES {
    open_program = "OPEN_PROGRAM_ACTION",
    close_program = "CLOSE_PROGRAM_ACTION",
    start_drag = "START_DRAG_ACTION",
    end_drag = "END_DRAG_ACTION",
    focus_process = "FOCUS_PROCESS_ACTION",
    collapse_process = "COLLAPSE_PROCESS_ACTION",
    collapsed_process_id = -1,
}

interface ProcessAction {
    type: PROCESS_REDUCER_ACTION_TYPES;
    payload: {
        process: ApplicationProcess | number;
    };

}



type ProcessState = {
    openProcesses: ApplicationProcess[];
    focusedProcess: number | null;

}

const initialState: ProcessState = {
    openProcesses: [],
    focusedProcess: null
}



//TODO: figure out a way to just pass in number instead of whole process
const programsReducer = (state: ProcessState, action: ProcessAction): ProcessState => {

    switch (action.type) {
        case (PROCESS_REDUCER_ACTION_TYPES.open_program):
            if (typeof action.payload.process !== "number") {
                let newProcess = action.payload.process as ApplicationProcess;
                let newState = [...state.openProcesses, newProcess];
                return { ...state, focusedProcess: newProcess.pID, openProcesses: newState };
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
                    }),
                    focusedProcess: null,
                };
            }
            else {
                return state;
            }


        case (PROCESS_REDUCER_ACTION_TYPES.focus_process):
            if (typeof action.payload.process === "number") {
                //magic value
                if (action.payload.process === -1) {
                    return { ...state, focusedProcess: null };
                }
                else {
                    state.openProcesses.find((p) => {
                        return p.pID === action.payload.process;
                    })!.collapsed = false;
                    return { ...state, focusedProcess: action.payload.process };

                }
            }
            else {
                return state;
            }

        case (PROCESS_REDUCER_ACTION_TYPES.collapse_process):

            if (typeof action.payload.process === "number") {
                state.openProcesses.find((p) => {
                    return p.pID === action.payload.process;
                })!.collapsed = true;
            }

            return state;


        default:
            console.log("error in process reducer");
            return state;


    }
}

//STATE/HOOKS FOR 

type DesktopProps = {
    relog: ()=>void;
    token:string;
}

const Desktop: React.FC<DesktopProps> = ({
    relog,
    token
}) => {


    const savedAppsDefault: Array<string> = [];
    const [processes, dispatchProcesses] = React.useReducer(programsReducer, initialState);
    const [startMenuOpen, setStartMenuOpen] = React.useState(false);
    const [installedApps, setInstalledApps] = React.useState(["Etch-A-Sketch", "Text Editor"]);
    const [savedApps, setSavedApps] = React.useState(savedAppsDefault);
    const [deselectIcons, setDeselectIcons]= React.useState(true);
    const desktopRef = React.useRef<HTMLDivElement>(null);
    let desktopHeight: number;
    let desktopWidth: number;



    //updates ref on render so that process can access height/width for dragging purposes.
    React.useEffect(() => {

        if (desktopRef.current) {

            desktopHeight = desktopRef.current.offsetHeight;
            desktopWidth = desktopRef.current.offsetWidth;

        }



    }, [desktopRef]);



    const handleStartButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setStartMenuOpen(!startMenuOpen);

    }
    const handleDesktopClick = () => {
        setStartMenuOpen(false);
        setDeselectIcons(!deselectIcons);

    }

    const handleStartMenuClick = (event: React.MouseEvent<Element, MouseEvent>) => {
        let ele = event.target as HTMLDivElement;
        switch (ele.innerText) {
            case installedApps[0]:
                dispatchProcesses(
                    {
                        type: PROCESS_REDUCER_ACTION_TYPES.open_program,
                        payload: { process: new ApplicationProcess(installedApps[0]) }
                    }

                );
                return;

            case installedApps[1]:
                dispatchProcesses(
                    {
                        type: PROCESS_REDUCER_ACTION_TYPES.open_program,
                        payload: { process: new ApplicationProcess(installedApps[1]) }
                    }

                );
                return;

            default:
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

    const handleAppBarEntryClick = (processID: number) => {
        dispatchProcesses({
            type: PROCESS_REDUCER_ACTION_TYPES.focus_process,
            payload: { process: processID }
        });
    }

    const handleCollapseClick = (processID: number) => {
        dispatchProcesses(
            {
                type: PROCESS_REDUCER_ACTION_TYPES.collapse_process,
                payload: { process: processID }
            }
        );
        dispatchProcesses(
            {
                type: PROCESS_REDUCER_ACTION_TYPES.focus_process,
                payload: { process: -1 }
            }
        )
    }

    const handleSave = (name: string): void => {
        console.log("called");
        setSavedApps([...savedApps, name]);
    }

    //"opens" all currently running apps
    const buildAppGuis = (openProcesses: ApplicationProcess[]): JSX.Element => {
        return (
            <React.Fragment>
                {
                    openProcesses.map((process) => {
                        let focused = false;
                        if (processes.focusedProcess !== null) {
                            if (processes.focusedProcess === process.pID) {
                                focused = true;
                            }
                        }
                        return (
                            <Process exitApp={handleCloseApp} process={process}
                                parentRef={desktopRef} focusThis={handleAppBarEntryClick}
                                collapseThis={handleCollapseClick}
                                key={process.pID} focused={focused} saveFile={handleSave} token={token} relog={relog} />
                        );
                    })
                }
            </React.Fragment>
        );
    }

    const handleIconClick = ():void=>{

    }
     
    const buildIconGuis = (): JSX.Element => {
        return (
            <React.Fragment>
                {
                    savedApps.map((fileName) => {
                        return (
                            <FileIcon fileName={fileName} openFile={handleIconClick} key={fileName} deselectFiles= {deselectIcons}/>
                        )
                    })
                }
            </React.Fragment>);
    }


    return (
        <div className='desktopContainer'>
            <div className='desktop' onClick={handleDesktopClick} ref={desktopRef}>
                <StartMenu visible={startMenuOpen} onProgramSelect={handleStartMenuClick} installedApps={installedApps} />
                <TaskBar openProcesses={processes.openProcesses} focusNewProcess={handleAppBarEntryClick} focusedProcess={processes.focusedProcess}>
                    <StartButton onClick={handleStartButtonClick} startMenuOpen={startMenuOpen}></StartButton>
                    <Clock />
                </TaskBar>
                {buildIconGuis()}
                {buildAppGuis(processes.openProcesses)}

            </div>
        </div>
    );
}


export { Desktop, ApplicationProcess, }
