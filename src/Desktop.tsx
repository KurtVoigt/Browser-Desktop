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
import axios from 'axios';



type TextFileDataType = {
    content: string;
    name: string;
    user: string;
    id: string;
}

class ApplicationProcess {
    //might have to change this when it is possible to shut off app
    static GlobalID: number = 0;
    public name: string;
    public pID: number;
    public collapsed: boolean;
    public data: TextFileDataType | null;
    constructor(name: string, data?: TextFileDataType) {
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

type SavedAppsType = {
    _id: string,
    fileName: string,
}
type DesktopProps = {
    relog: () => void;
    token: string;
    userID: string;
}

enum FILE_REDUCER_ACTION_TYPE {
    fetch_success = 'FILES_FETCH_SUCCESS',
    fetch_init = 'FILES_FETCH_INIT',
    fetch_failure = 'FILES_FETCH_FAILURE',
    remove_GUI_Icon = 'REMOVE_GUI_ICON',
    add_GUI_Icon = 'ADD_GUI_ICON',
}
type FileAction = {
    type: FILE_REDUCER_ACTION_TYPE;
    payload: {
        data: any,
    }
}
type FileState = {
    isLoading: boolean,
    isError: boolean,
    data: SavedAppsType[]
}

const filesReducer = (state: FileState, action: FileAction): FileState => {
    switch (action.type) {
        case (FILE_REDUCER_ACTION_TYPE.fetch_init): {
            return {
                ...state,
                isLoading: true,
                isError: false
            }
        }
        case (FILE_REDUCER_ACTION_TYPE.fetch_failure): {
            return {
                ...state,
                isLoading: false,
                isError: true,
            }
        }
        case (FILE_REDUCER_ACTION_TYPE.fetch_success): {
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload.data
            }
        }
        case (FILE_REDUCER_ACTION_TYPE.remove_GUI_Icon): {
            let filtered = state.data;
            
            filtered = filtered.filter(entry => entry.fileName !== action.payload.data);
            
            return {
                ...state,
                data: filtered
            }
        }
        case(FILE_REDUCER_ACTION_TYPE.add_GUI_Icon):{
            return{
                ... state,
                data:[...state.data, action.payload.data]
            }
        }
    }
}


const Desktop: React.FC<DesktopProps> = ({
    relog,
    token,
    userID,

}) => {

    const defaultSavedApps: SavedAppsType[] = [];
    const [processes, dispatchProcesses] = React.useReducer(programsReducer, initialState);
    const [docs, dispatchDocs] = React.useReducer(filesReducer, { isLoading: false, isError: false, data: [] });
    const [startMenuOpen, setStartMenuOpen] = React.useState(false);
    const [installedApps, setInstalledApps] = React.useState(["Etch-A-Sketch", "Text Editor"]);
    const [savedApps, setSavedApps] = React.useState(defaultSavedApps);
    const [deselectIcons, setDeselectIcons] = React.useState(true);
    const desktopRef = React.useRef<HTMLDivElement>(null);
    let desktopHeight: number;
    let desktopWidth: number;


    //get all saved text files

    const handleDocFetch = React.useCallback(async function getUserDocs(): Promise<void> {

        dispatchDocs({
            type: FILE_REDUCER_ACTION_TYPE.fetch_init,
            payload: {
                data: null
            }
        })
        const docs = axios.get('/text-file',
            {
                params: {
                    userId: userID,
                    token: token,
                }
            })
            .then((response) => {
                let returnData: SavedAppsType[] = [];
                response.data.map((file: any) => {

                    let toPush: SavedAppsType = {
                        _id: file._id,
                        fileName: file.name
                    }
                    returnData.push(toPush);
                    return;
                });

                if (returnData.length > 0) {
                    dispatchDocs({
                        type: FILE_REDUCER_ACTION_TYPE.fetch_success,
                        payload:
                        {
                            data: returnData
                        }
                    });
                }

            }).catch((err) => {
                dispatchDocs({
                    type: FILE_REDUCER_ACTION_TYPE.fetch_failure,
                    payload:
                    {
                        data: null
                    }
                });
            })

    }, []);

    React.useEffect(() => {
        handleDocFetch();
    }, [handleDocFetch])

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

    const handleSave = (file: SavedAppsType): void => {
        dispatchDocs({
            type: FILE_REDUCER_ACTION_TYPE.add_GUI_Icon,
            payload:{data:file}
        })
    }

    const handleDelete = (file: string): void => {
 
        dispatchDocs({
            type: FILE_REDUCER_ACTION_TYPE.remove_GUI_Icon,
            payload:
            {
                data: file
            }
        })

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
                                key={process.pID} focused={focused} saveFile={handleSave} token={token} relog={relog} userID={userID} deleteFile={handleDelete} />
                        );
                    })
                }
            </React.Fragment>
        );
    }

    const handleIconClick = (fileId: string): void => {
        //build a new process from file
        let openedFile: ApplicationProcess | null = null;
        axios.get('/text-file/' + fileId,
            {
                params: {
                    token: token,
                }
            })
            .then((response) => {
                let newTextProcessData: TextFileDataType = {
                    content: response.data.content,
                    name: response.data.name,
                    user: response.data.user,
                    id: response.data._id,
                }
                openedFile = new ApplicationProcess(
                    installedApps[1], newTextProcessData
                );

                if (openedFile !== null) {
                    dispatchProcesses(
                        {
                            type: PROCESS_REDUCER_ACTION_TYPES.open_program,
                            payload: { process: openedFile }
                        }
                    )
                }

            })
            .catch((err) => {
                console.log(err);
            })




    }

    const buildIconGuis = (): JSX.Element => {

        return (
            <React.Fragment>
                {
                    docs.data.map((fileInfo) => {
                        return (
                            <FileIcon file={fileInfo} openFile={handleIconClick} key={fileInfo._id} deselectFiles={deselectIcons} />
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
export type { SavedAppsType }
