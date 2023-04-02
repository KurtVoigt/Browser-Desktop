import "./FileIcon.scss";
import { FC, Fragment, useEffect, useRef } from "react";
type FileIconProps = {
    fileName: string;
    openFile: (fileName: string) => void;
    deselectFiles:boolean;
}

const FileIcon: FC<FileIconProps> = ({
    fileName,
    deselectFiles,
    openFile
}) => {
    const iconRef = useRef<HTMLDivElement>(null);
    let className:string = "fileIconContainer";


    //need to find a less coupled way to do this
    //plugged into desktop click of desktop component
    //every time desktop is clicked will "deselect" files and put them to default style
    useEffect(()=>{
        iconRef.current!.className = "fileIconContainer";
    }, [deselectFiles]);

    const fileIconJSX: JSX.Element = (
        <div className={className}  key={fileName} ref={iconRef} onClick={handleIconClick} onDoubleClick={handleDoubleClick}>
            <div className='fileIcon'></div>
            <div className='fileName'>{fileName}</div>
        </div>
    );

    function handleIconClick(event: React.MouseEvent<HTMLDivElement>){
        event.stopPropagation();
        iconRef.current!.className = "fileIconContainer selected";
    }

    function handleDoubleClick(){
        openFile(fileName);
    }


    return (fileIconJSX);
}

export {FileIcon};