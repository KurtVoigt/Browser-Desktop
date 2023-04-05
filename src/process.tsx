import { FC, useState, useEffect, useRef, LegacyRef, MutableRefObject } from "react";
import "./process.scss";
import { ApplicationProcess } from "./Desktop";
import { TextEditor } from "./Desktop-Apps/TextEditor";
import { EtchASketch } from "./Desktop-Apps/etch-a-sketch";

type ProcessProps = {
    exitApp: (processID: number) => void;
    process: ApplicationProcess;
    parentRef: React.RefObject<HTMLDivElement>;
    focused:boolean;
    focusThis:(processID:number)=>void;
    saveFile ?: (fileName:string)=>void;
    collapseThis:(processID:number)=>void;
    relog: ()=>void;
    token:string;

}

const Process: FC<ProcessProps> = (
    {

        exitApp,
        process,
        parentRef,
        focused,
        focusThis,
        collapseThis,
        saveFile,
        token,
        relog


    }
) => {
    const processRef = useRef<HTMLDivElement>(null);
    const mouseDown = useRef(false);
    const pos1 = useRef(0);
    const pos2 = useRef(0);
    const pos3 = useRef(0);
    const pos4 = useRef(0);
    //true = maximize icon, false = minimize icon
    const [sizeModeIcon, setSizeModeIcon] = useState(true);
    //get around optional type checking, better way?
    let sureSaveFile:(fileName:string)=>void;
    if(saveFile){
        sureSaveFile = saveFile as (fileName:string)=>void;
    }



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
                (offsetTop + processRef.current!.offsetHeight) - pos2.current >= parentHeight) {
                ;
            }

            else {
                processRef.current!.style.top = `${offsetTop - pos2.current}px`;
            }

            if (offsetLeft - pos1.current <= 0 ||
                offsetLeft + processRef.current!.offsetWidth - pos1.current >= parentWidth) {
                ;
            }
            else {
                processRef.current!.style.left = `${offsetLeft - pos1.current}px`;
            }

        }
    }






    const handleExit = () => {
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

        if (sizeModeIcon) {
            processRef.current!.style.top = "0px";
            processRef.current!.style.left = "0px";
            processRef.current!.style.width = "100%";
            processRef.current!.style.height = "calc(100% - 32px)";
        }
        else{
            processRef.current!.style.top = "40%";
            processRef.current!.style.left = "40%";
            processRef.current!.style.width = "30%";
            processRef.current!.style.height = "30%";
        }
        setSizeModeIcon(!sizeModeIcon);

    }

    const retrieveAppComponent = (appName: string): JSX.Element => {
        switch (appName) {
            case "Text Editor":
                return (
                    <TextEditor exit={handleExit} saveFile={sureSaveFile} token={token} relog={relog}/>
                );
            case "Etch-A-Sketch":
                return (
                    <EtchASketch />
                )

            default:
                return (<div></div>);
        }
    }

    const determineAndGetSizeModeIcon = (): JSX.Element => {
        if (sizeModeIcon) {
            return (<div className="square" />);
        }
        else {
            return (<>
                <div className="doubleSquareLower" />
                <div className="doubleSquareUpper" />
            </>);
        }

    }
    const handleWindowClick = () =>{
        focusThis(process.pID);
    }

    const handleCollapseClick = () =>{
        collapseThis(process.pID);
    }


    let classname:string;

    if(process.collapsed){
        classname = "processWindow collapsed"
    }
    else if(focused){
        classname = "processWindow focused";
    }
    else{
        classname = "processWindow";
    }

 
    return (
        <div className={classname} onMouseUp={handleMouseUp} onMouseDown={handleWindowClick}
            ref={processRef} >
            <div className="upperBar" onMouseDown={handleMouseDown} onMouseMove={MousePosition} onMouseLeave={handleMouseUp}>
                <div className="title"><span unselectable="on">{`${process.name}`}</span></div>
                <div className="buttonsContainer">
                    <button className="exitButton" type="button" onClick={handleExit} unselectable="on" title="Close">X</button>
                    <button className="collapseButton" type="button" unselectable="on" title="Collapse" onClick={handleCollapseClick}>
                        <div className="collapseLine"></div>
                    </button>
                    <button className="maximizeButton" type="button" onClick={maximize} unselectable="on" title="Minimize/Maximize">
                        {determineAndGetSizeModeIcon()}
                    </button>
                </div>
            </div>
            {retrieveAppComponent(process.name)}
        </div>
    )
}

export { Process }
