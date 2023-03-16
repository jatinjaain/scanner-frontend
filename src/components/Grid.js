import React, { useEffect, useState } from 'react'
import "../grid.css"

const Grid = (props) => {

    let move = ""
    const rows = 20
    const columns = 60


    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)

        // cleanup this component
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [props.active])



    const handleKeyDown = (event) => {
        event.stopImmediatePropagation();
        // event.preventDefault();
        const key = event.key;
        console.log(key)
        let str = ""

        let activeCell = props.active

        if (key === "ArrowLeft") {
            if (props.active == 0) {
                console.log("calling left on first cell ------------")
                str = "left"
                props.setActive(prev => rows * columns - 1)
            }
            else {
                str = "left"
                props.setActive(prev => prev - 1)
            }
        }
        if (key === "ArrowRight") {
            if (props.active + 1 == rows * columns) {
                console.log("calling right on last cell ------------")
                str = "right"
                props.setActive(prev => prev * 0)
            }
            else {
                str = "right"
                props.setActive(prev => prev + 1)
            }
        }
        if (key === "ArrowDown") {
            if (Math.floor(props.active / columns) >= rows - 1) {
                console.log("calling down on last row ------------")
                str = "down"
                props.setActive(prev => prev % columns)
            }
            else {
                str = "down"
                props.setActive(prev => prev + columns)
            }
        }
        if (key === "ArrowUp") {
            if (Math.floor(props.active / columns) === 0) {
                console.log("calling up on first row ------------")
                str = "up"
                props.setActive(prev => prev + (columns * (rows - 1)))
            }
            else {
                str = "up"
                props.setActive(prev => prev - columns)
            }
        }
        console.log("str " + str)
        // console.log("move: " + move)
        if (str != "") {
            // setMove(str)
            move = str
            props.sendMove(move)
        }
    }


    const updateGrid = (alreadyFocused, alreadyCaptured) => {

        const cells = []

        for (var i = 0; i < rows * columns; i++) {
            // grid.push(0);
            cells.push(<div key={i} className='cell' id={`${i}`}></div>)
        }
        if (props.userState.alreadyFocused)
            props.userState.alreadyFocused.map((cell) => {
                const i = cell[0] * 60 + cell[1]
                cells[i] = <div key={i} className='cell' id={`${i}`}>F</div>
            })
        if (props.userState.alreadyCaptured)
            props.userState.alreadyCaptured.map((cell) => {
                const i = cell[0] * 60 + cell[1]
                cells[i] = <div key={i} className='cell' id={`${i}`}>C</div>
            })
        return cells;
    }



    return (
        <div>
            <h1>Focused and Captured areas on the slide</h1>

            <div className="container">
                <div className="grid">
                    {
                        updateGrid(props.alreadyFocused, props.alreadyCaptured)
                    }
                </div>
            </div>





            <h5>{"Curr Position: [" + Math.floor(props.active / 60) + "," + props.active % 60 + "]"}</h5>
            <span>FOCUSING ON: </span>
            <span>{"[" + props.userState.currFocus[0] + "," + props.userState.currFocus[1]}</span>
            <span>{"]  , "}</span>
            <span>CAPTURING: </span>
            <span>{"[" + props.userState.currCapture[0] + "," + props.userState.currCapture[1] + "]"}</span>

            <h3>Press direction keys to navigate</h3>
        </div>

    )
}

export default Grid