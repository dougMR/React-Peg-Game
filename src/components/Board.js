import { useEffect, useState, useRef } from "react";
import React from "react";
// import Slot from "./Slot.js";

function addDown(n) {
    // Like factorial but with addition
    if (n === 0) {
        // stop subtracting when we reach zero
        return 0;
    } else {
        // Recursive case: n! = n + (n-1)!
        return n + addDown(n - 1);
    }
}

const rows = [];

const Board = ({ numRows }) => {
    // const generateSlot = () => {
    //     return {
    //         peg: true,
    //         target: false,
    //         active: false,
    //     };
    // };
    const [slots, setSlots] = useState([]);
    const [slotUnit,setSlotUnit] = useState(`calc(${5/numRows} * var(--board-unit))`)
    const buildRowsFlag = useRef(true);
    const buildSlots = () => {
        // console.log('buildSlots()');
        const initSlots = [];
        for (
            let elementIndex = 0;
            elementIndex < addDown(numRows);
            elementIndex++
        ) {
            const peg = elementIndex !== 4; //Math.random() < 0.5;
            initSlots[elementIndex] = {
                index: elementIndex,
                peg,
                selected: false, //peg && Math.random() < 0.5,
                target: false,
            };
        }
        setSlots(initSlots);
    };

    const buildRows = () => {
        // rows is an array of arrays, each representing a row containing indices of slots in that row
        const slotsCopy = [...slots];
        // console.log('slots:',slots);
        for (let r = 0; r < numRows; r++) {
            rows[r] = [];
            const rowLength = r + 1;
            const firstIndex = addDown(r);
            // console.log("row", r, "first index: ", firstIndex);
            for (
                let slotIndex = firstIndex;
                slotIndex < firstIndex + rowLength;
                slotIndex++
            ) {
                // console.log('slotIndex',slotIndex);
                slotsCopy[slotIndex].myColumn = rows[r].length;
                slotsCopy[slotIndex].myRow = r;
                rows[r].push(slotIndex);
            }
            // console.log('rows[',r,']',rows[r])
        }
        setSlots(slotsCopy);
    };

    const setSlotCssUnits = (numRows) => {
        const relativeUnit = 5/numRows;
        setSlotUnit(`calc(${relativeUnit} * var(--board-unit))`)
        // console.log(document.querySelector('.board'));
        // document.querySelector(".board").style.setProperty("--slot-unit", `calc(${relativeUnit} * var(--board-unit))`);
        // const boardEl = document.documentElement.querySelector(".board");//.style.setProperty("--slot-unit", `calc(${relativeUnit} * var(--board-unit))`);
        // console.log('boardEl:',boardEl);
    }

    useEffect(() => {
        console.log("useEffect buildSlots");
        buildSlots();
    }, []);
    useEffect(() => {
        if (buildRowsFlag.current === true && slots.length > 0) {
            console.log("useEffect buildRows");
            console.log("slots:", slots);
            buildRows();
            console.log("rows:", rows);
            buildRowsFlag.current = false;
        }
    }, [slots]);

    const selectSlot = (index) => {
        // console.log('rows:',rows);
        const slotsCopy = [...slots];
        const slot = slotsCopy[index];
        // Clear targets
        if (slot.peg) {
            for (const slot of slotsCopy) {
                slot.target = false;
            }
            for (const s of slotsCopy) {
                // deselect all slots
                // toggle selected for clicked slot
                s.selected = s === slot ? !slot.selected : false;
            }
            if(slot.selected)hilightPegTargetSlots(slot);
            setSlots(slotsCopy);
        } else if (slot.target) {
            // move peg from selected slot to here
            const selectedSlot = slots.find((s) => s.selected);
            if (selectedSlot) {
                selectedSlot.peg = false;
                slot.peg = true;
                getSlotBetween(selectedSlot, slot).peg = false;
            }
            for (const slot of slotsCopy) {
                slot.target = false;
            }
            setSlots(slotsCopy);
        }
    };

    // const getSlotRow = (slotIndex) => {
    //     return rows.find((r) => r.some((slot) => slot.index === slotIndex));
    // };
    // const getSlotColumn = (slotIndex) => {
    //     return getSlotRow(slotIndex).indexOf(slotIndex);
    // };

    const getSlotByRowColumn = (r, c) => {
        // console.log('getSlotByRowColumn(',r,c,')')
        // const row = rows[r];
        // console.log('rows[',r,']:',row);
        // if (!rows[r]) return null;
        const slot = slots.find(
            (slot) => slot.myColumn === c && slot.myRow === r
        );
        // console.log('slotIndex:',slotIndex);
        return slot;
    };
    const getSlotBetween = (slotA, slotB) => {
        console.log("getSlotBetween()");
        console.log(slotB);
        const c = (slotA.myColumn + slotB.myColumn) / 2;
        const r = (slotA.myRow + slotB.myRow) / 2;
        const slotBetween = getSlotByRowColumn(r, c);
        return slotBetween;
    };
    const getPegTargetSlots = (slot) => {
        // find slots 2 spaces away from slot in all directions
        // console.log('getPegTargetSlots(',slot,')')
        const targetSlots = [];
        if (slot.peg) {
            const sr = slot.myRow,
                sc = slot.myColumn;
            for (let r = sr - 2; r < sr + 3; r += 2) {
                // console.log('r:',r);
                for (let c = sc - 2; c < sc + 3; c += 2) {
                    // Rule out above to right, self and below to left
                    // console.log('c:',c);
                    if (
                        (r < sr && c > sc) ||
                        (r === sr && c === sc) ||
                        (r > sr && c < sc)
                    ) {
                        continue;
                    }
                    // console.log('not ruled out')
                    const potentialTarget = getSlotByRowColumn(r, c);
                    // console.log('potentialTarget:',potentialTarget)

                    if (potentialTarget) {
                        // is there a peg between target and moving peg?
                        if (
                            !potentialTarget.peg &&
                            getSlotBetween(slot, potentialTarget).peg
                        ) {
                            targetSlots.push(potentialTarget);
                        }
                    }
                }
            }
        }
        return targetSlots;
    };

    const hilightPegTargetSlots = (fromSlot) => {
        const fairTargets = getPegTargetSlots(fromSlot);
        console.log("targetSlots: ", fairTargets);
        for (const slot of slots) {
            slot.target =
                fairTargets.find((target) => target === slot) !== undefined;
        }
    };

    return (
        <div className="board" style={{"--slot-unit":slotUnit}}>
            {slots.map((slot, index) => {
                return (
                    <React.Fragment key={index}>
                        <div
                            className={`slot${slot.peg ? " peg" : ""}${
                                slot.selected ? " selected" : ""
                            }${slot.target ? " target" : ""}`}
                            onPointerDown={() => {
                                selectSlot(index);
                            }}
                        ></div>
                        {[0, 2, 5, 9,14,20,27].includes(index) ? <br /> : ""}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
export default Board;
