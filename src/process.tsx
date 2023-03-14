import { FC, useState, useEffect, useRef, LegacyRef, MutableRefObject } from "react";
import "./process.scss";
import { ApplicationProcess } from "./Desktop";

type ProcessProps = {
    exitApp: (processID: number) => void;
    process: ApplicationProcess;
    parentRef: React.RefObject<HTMLDivElement>;

}

const Process: FC<ProcessProps> = (
    {

        exitApp,
        process,
        parentRef,


    }
) => {
    //TODO: define and checks bounds of window, research this top and bottom math
    const processRef = useRef<HTMLDivElement>(null);
    const mouseDown = useRef(false);
    const pos1 = useRef(0);
    const pos2 = useRef(0);
    const pos3 = useRef(0);
    const pos4 = useRef(0);



    //TODO: FIND NEW WAY TO CALCULATE POSITION SO RESIZABLE WORKS BETTER
    const MousePosition = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (mouseDown.current) {
            event.preventDefault();
            pos1.current = (pos3.current - event.clientX);
            pos2.current = (pos4.current - event.clientY);
            pos3.current = event.clientX;
            pos4.current = event.clientY;

            //console.log(processRef.current!.offsetTop);


            let offsetTop: number = processRef.current!.offsetTop;
            let offsetLeft: number = processRef.current!.offsetLeft;
            //33 is height of taskbar
            let parentHeight: number = parentRef.current!.offsetHeight - 33;
            let parentWidth: number = parentRef.current!.offsetWidth;
           

            if (offsetTop - pos2.current <= 0 ||
                (offsetTop + processRef.current!.offsetHeight) - pos2.current >= parentHeight) 
            {
                ;
            }

            else {
                processRef.current!.style.top = `${offsetTop - pos2.current}px`;
            }

            if (offsetLeft - pos1.current <= 0 ||
                offsetLeft + processRef.current!.offsetWidth - pos1.current >=parentWidth) 
            {
                ;
            }
            else {
                processRef.current!.style.left = `${offsetLeft - pos1.current}px`;
            }

        }
    }






    const handleExit = (event: React.MouseEvent) => {
        exitApp(process.pID);
    }

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        //start tracking where mouse position is
        pos3.current = event.clientX;
        pos4.current = event.clientY;
        mouseDown.current = true;
    }
    const handleMouseUp = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        //start tracking where mouse position is
        mouseDown.current = false;
    }

    const maximize = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        console.log(processRef.current)
        processRef.current!.style.top = "0px";
        processRef.current!.style.left = "0px";
        processRef.current!.style.width = "100%";
        processRef.current!.style.height = "calc(100% - 32px)";
    }

    const retrieveAppComponent = (appName: string): JSX.Element => {
        switch (appName) {
            case "Text Editor":
                return (
                    <textarea className="runningApp"></textarea>
                )
            default:
                return (<div></div>)
        }
    }

    return (
        <div className="processWindow" onMouseUp={handleMouseUp}
            ref={processRef} >
            <div className="upperBar" onMouseDown={handleMouseDown} onMouseMove={MousePosition} onMouseLeave={handleMouseUp}>
                <div className="title"><span unselectable="on">{`${process.name}`}</span></div>
                <div className="buttonsContainer">
                    <button className="exitButton" type="button" onClick={handleExit} unselectable="on">❌</button>
                    <button className="minimizeButton" type="button" unselectable="on">➖</button>
                    <button className="maximizeButton" type="button" onClick={maximize} unselectable="on">
                        <div className="square"></div>
                    </button>
                </div>
            </div>
            {retrieveAppComponent(process.name)}
        </div>
    )
}

export { Process }
