import { FC, useState, useEffect, useRef, LegacyRef, MutableRefObject } from "react";
import "./process.scss";
import { ApplicationProcess } from "./Desktop";

type ProcessProps = {
    exitApp: (processID: number) => void;
    process: ApplicationProcess;
}

const Process: FC<ProcessProps> = (
    {

        exitApp,
        process,

    }
) => {
//TODO: define and checks bounds of window, research this top and bottom math
    const [MouseCoords, setMouseCoords] = useState({ x: 301, y: 301 });
    const [OldMouseCoords, setOldMouseCoords] = useState({ x: 300, y: 300 });
    const [BottomLeft, setBottomLeft] = useState({ bottom: 300, left: 300 })
    const [mouseDown, setMouseDown] = useState(false);
    const processRef = useRef(null);



    //TODO: FIND NEW WAY TO CALCULATE POSITION SO RESIZABLE WORKS BETTER
    const MousePosition = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (mouseDown) {
            setOldMouseCoords({ x: MouseCoords.x, y: MouseCoords.y });
            setMouseCoords({ x: event.screenX, y: event.screenY });
        }
    }



    
    useEffect(() => {
        let left = 0;
        let bottom = 0;

        left += (MouseCoords.x - OldMouseCoords.x);


        if ((MouseCoords.y - OldMouseCoords.y) < 0) {
            bottom -= ((MouseCoords.y - OldMouseCoords.y) - 0.05);
        }
        else if ((MouseCoords.y - OldMouseCoords.y) > 0) {
            bottom -= ((MouseCoords.y - OldMouseCoords.y) + 0.05);
        }

        setBottomLeft({
            bottom: BottomLeft.bottom + bottom,
            left: BottomLeft.left + left
        })
    }, [OldMouseCoords]);

    const handleExit = (event: React.MouseEvent) => {
        exitApp(process.pID);
    }

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        //start tracking where mouse position is
        setMouseCoords({ x: event.screenX, y: event.screenY });
        setMouseDown(true);
    }
    const handleMouseUp = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        //start tracking where mouse position is
        setMouseDown(false);
    }

    const maximize =(event: React.MouseEvent<HTMLButtonElement, MouseEvent>):void => {
        console.log(processRef.current)
        processRef.current.style.bottom= "32px";
        processRef.current.style.left= "0px";
        processRef.current.style.width = "100%";
        processRef.current.style.height= "calc(100% - 32px)";
    }

    const retrieveAppComponent= (appName:string):JSX.Element =>{
        switch(appName){
           case "Text Editor":
            return(
                <textarea className="runningApp"></textarea>
            )
            default:
                return(<div></div>)
        }
    }

    return (
        <div className="processWindow" style={{ bottom: BottomLeft.bottom, left: BottomLeft.left }} onMouseUp={handleMouseUp}
        ref={processRef} >
            <div className="upperBar" onMouseDown={handleMouseDown} onMouseMove={MousePosition} onMouseLeave={handleMouseUp}>
                <div className="title"><span unselectable="on">{`${process.name}`}</span></div>
                <div className="buttonsContainer">
                    <button className="exitButton" type="button" onClick={handleExit}>❌</button>
                    <button className="minimizeButton" type="button">➖</button>
                    <button className="maximizeButton" type="button" onClick={maximize}>
                        <div className="square"></div>
                    </button>
                </div>
            </div>
            {retrieveAppComponent(process.name)}
        </div>
    )
}

export { Process }
