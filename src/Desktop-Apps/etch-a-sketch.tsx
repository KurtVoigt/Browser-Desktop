import "./etch-a-sketch.scss";
import { createElement, FC, useEffect, useRef, useState } from "react";
import { DropDownMenu, SlotInfo } from "./DropDownMenu";



const EtchASketch: FC = ({

}) => {

    enum RESIZE_OPTIONS {
        fourByFour = "4x4",
        eightByEight = "8x8",
        sixteenBySixteen = "16x16"
    };


    const [gridSquareDimension, setGridSquareDimension] = useState(4);
    const [colorMode, setColorMode] = useState(false);
    const [clear, setClear] = useState(false);
    const [sizeMenuOpen, setSizeMenuOpen] = useState(false);
    const gridRef = useRef<HTMLDivElement>(null);


    //used solely for rerendering
    function rerender(): void {
        setClear(!clear);
    }

    function handleSizeMenuClick(): void {
        setSizeMenuOpen(!sizeMenuOpen);
    }

    function changeColorMode(): void {
        setColorMode(!colorMode);
    }

    function populateGrid(dimension: number): JSX.Element[] {
        let arr: JSX.Element[] = [];
        for (let i = 0; i < (dimension * dimension); i++) {
            arr.push(<GridSquare colorMode={colorMode} clear={clear} key={i} />);
        }

        return arr;
    }

    function handleResizeOptionClick(option: string): void {
        let containerRef = gridRef;
        setSizeMenuOpen(false);
        switch(option){
            case RESIZE_OPTIONS.fourByFour:
                containerRef.current!.style.gridTemplateColumns = "repeat(4,1fr)";
                containerRef.current!.style.gridTemplateRows = "repeat(4,1fr)";
                setGridSquareDimension(4);
                return;
            case RESIZE_OPTIONS.eightByEight:
                containerRef.current!.style.gridTemplateColumns = "repeat(8,1fr)";
                containerRef.current!.style.gridTemplateRows = "repeat(8,1fr)";
                setGridSquareDimension(8);
                return;
            case RESIZE_OPTIONS.sixteenBySixteen:
                containerRef.current!.style.gridTemplateColumns = "repeat(16,1fr)";
                containerRef.current!.style.gridTemplateRows = "repeat(16,1fr)";
                setGridSquareDimension(16);
                return;
            default:
                containerRef.current!.style.gridTemplateColumns = "repeat(4,1fr)";
                containerRef.current!.style.gridTemplateRows = "repeat(4,1fr)";
                setGridSquareDimension(4);
                return;
        }
    }

    let sizeSlotInfo: SlotInfo = {
        slotName: "Resize",
        slotOptions: Object.values(RESIZE_OPTIONS),
    };

    return (

        <div className="etch-a-SketchContainer">
            <div className="optionsBar">
                <button type="button" className="clearButton" onClick={rerender}>Clear</button>
                <DropDownMenu slotInfo={sizeSlotInfo} menuOpen={sizeMenuOpen} handleSlotClick={handleSizeMenuClick}
                    handleSlotOptionClick={handleResizeOptionClick} />
                <button type="button" className="rainbowButton" onClick={changeColorMode}>Rainbow Mode</button>
            </div>
            <div className="gridContainer" ref={gridRef}>
                {populateGrid(gridSquareDimension).map((element) => {
                    return (
                        element
                    );
                })}
            </div>

        </div>

    );
}

type GridSquareProps = {
    colorMode: boolean;
    clear: boolean;

}

const GridSquare: FC<GridSquareProps> = ({
    colorMode,
    clear,

}) => {
    const sqaureRef = useRef<HTMLDivElement>(null);



    useEffect(() => {
        if (sqaureRef !== null) {
            sqaureRef.current!.style.backgroundColor = "rgb(143, 138, 138)";

        }
    }, [clear]);

    function draw(event: React.MouseEvent<HTMLDivElement>) {
        if (colorMode) {
            const randomColor = Math.floor(Math.random() * 16777215).toString(16);
            sqaureRef.current!.style.backgroundColor = "#" + randomColor;
        }
        else {
            sqaureRef.current!.style.backgroundColor = "rgb(22, 21, 21)";
        }

    }

    return (
        <div className="gridSquare" onMouseOver={draw} ref={sqaureRef}></div>
    );
}

export { EtchASketch };