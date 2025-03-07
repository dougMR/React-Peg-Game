import { use } from "react";
import { useEffect, useState, useRef } from "react";
import React from "react";

function addDown(n) {
    // Used for building rows[]
    // Like factorial but with addition
    if (n === 0) {
        // stop subtracting when we reach zero
        return 0;
    } else {
        // Recursive case: n! = n + (n-1)!
        return n + addDown(n - 1);
    }
}
const copyObj = (obj) => {
    return JSON.parse(JSON.stringify(obj));
    // return structuredClone(obj);
};

const Board = ({
    numRows,
    randomStartSlotChecked,
    showTargetSlots,
    historicTurnIndex,
    // ^ index of currently displayed turn in boardHistory
    setHistoricTurnIndex,
    setnumTurnsTaken,
    setGameOver,
    setPegsRemaining,
    setShowMoveHint,
    showMoveHint,
}) => {
    // slots[] is the current board
    const [slots, setSlots] = useState([]);
    // slotUnit is sizing for css
    const [slotUnit, setSlotUnit] = useState(
        `calc(${5 / numRows} * var(--board-unit))`
    );
    // boardHistory is a record of slots from each turn
    const [boardHistory, setBoardHistory] = useState([]);

    // v Initialize board
    const buildSlots = (overwriteMove = true) => {
        console.log("buildSlots()");
        const initSlots = [];
        const numSlots = addDown(numRows);
        const emptyStartSlotIndex = randomStartSlotChecked
            ? Math.floor(Math.random() * numSlots)
            : 4;
        for (let elementIndex = 0; elementIndex < numSlots; elementIndex++) {
            const peg = elementIndex !== emptyStartSlotIndex;
            initSlots[elementIndex] = {
                index: elementIndex,
                peg,
                selected: false,
                target: false,
            };
        }
        // console.log("initSlots.length:", initSlots.length);
        addColumnsAndRowsToSlots(initSlots);
        setSlots(copyObj(initSlots));
        saveCurrentMove((initSlots), overwriteMove === true);
    };

    const addColumnsAndRowsToSlots = (slots) => {
        // console.log("addColumnsAndRowsToSlots()");
        // This makes changes directly to the slots provided in the argument

        // DMR 12/17/24 - ^ There were too many hoops previously.  This is more direct, and synchronous, fewer pitfalls (avoids useEffect).  In fact, this whole function could be folded into the buildSlots() function.

        // rows is an array of arrays, each representing a row containing indices of slots in that row
        const rows = [];
        for (let r = 0; r < numRows; r++) {
            rows[r] = [];
            const rowLength = r + 1;
            const firstIndex = addDown(r);
            for (
                let slotIndex = firstIndex;
                slotIndex < firstIndex + rowLength;
                slotIndex++
            ) {
                // this is easier overall than the deleted getColum(slot) and getRow(slot).  Better here to just add column / row to each slot when board is first created
                slots[slotIndex].myColumn = rows[r].length;
                slots[slotIndex].myRow = r;
                rows[r].push(slotIndex);
            }
        }
    };

    // ^ Initialize board

    const setSlotCssUnits = () => {
        // v This 'formula' is based on original css element sizes -> maybe 1 board-unit was 5 vmin?
        // it sets unit size based on number of rows
        // anyhow, this works now. v
        const relativeUnit = 5 / numRows;
        setSlotUnit(`calc(${relativeUnit} * var(--board-unit))`);
        // DMR ? 12/18/24 - in vanilla JS, I would directly change the css variable.  Is that kosher (or possible) in React?
        // document.documentElement.style.setProperty('--slot-unit', slotUnit);
    };

    useEffect(() => {
        console.log(
            "  ((((board) useEffect buildSlots triggered by component initial mount."
        );
        setSlotCssUnits();
        buildSlots();
    }, []);

    useEffect(() => {
        console.log(
            "  ((((board) useEffect buildSlots triggered by numRows change."
        );
        setSlotCssUnits();
        buildSlots(true);
    }, [numRows]);

    useEffect(() => {
        console.log(
            "  ((((board) useEffect historicTurnIndex changed to",
            historicTurnIndex,
            "."
        );
        if (historicTurnIndex >= 0) {
            // boardHistory[historicTurnIndex]) {
            // console.log("historicTurnIndex:", historicTurnIndex);
            setSlots(boardHistory[historicTurnIndex]);
        }
    }, [historicTurnIndex]);

    useEffect(() => {
        console.log("  ((((board) useEffect slots changed to", slots);
        // console.log("--boardHistory:", boardHistory);
        // for (const [index, element] of slots.entries()) {
        //     console.log("slots[",index,"]===boardHistory[0][",index,"]:", element===boardHistory[0][index]);
        // }

        if (slots.length === addDown(numRows)) {
            if (historicTurnIndex === boardHistory.length - 1) {
                checkGameOver();
            } else {
                setGameOver(false);
            }
        }
    }, [slots]);

    useEffect(() => {
        console.log("  ((((board) useEffect showMoveHint changed to", showMoveHint);
        if (showMoveHint) {
            showMoveHints();
        }
    }, [showMoveHint]);

    useEffect(() => {
        console.log("  ((((board) useEffect boardHistory changed to", boardHistory);
    }, [boardHistory]);

    // Move History ----------------------------
    const saveCurrentMove = (currentSlots, overwriteMove) => {
        // Update boardHistory with currentSlots
        console.log("  -- saveCurrentMove(overwriteMove:", overwriteMove === true, ")");
        console.log("currentSlots:", currentSlots);
        const currentMove = copyObj(currentSlots);
        console.log("currentSlots===currentMove:", currentSlots === currentMove);
        // console.log("boardHistory:", boardHistory);
        // console.log("boardHistory[0] === slots:", boardHistory[0] === slots);
        const newBoardHistory = copyObj(boardHistory);
        // console.log("newBoardHistory:", newBoardHistory);
        // trim boardHistory if historicTurnIndex is less than latest turn
        if (
            historicTurnIndex > 0 &&
            historicTurnIndex < newBoardHistory.length - 1
        )
            newBoardHistory.length = historicTurnIndex + 1;
        // overwrite current turn if overwriteMove is true
        if (overwriteMove === true && newBoardHistory.length > 0) {
            console.log("overwrite current move");
            newBoardHistory[newBoardHistory.length - 1] = currentMove;
        } else {
            console.log("add new move to history");
            newBoardHistory.push(currentMove);
        }
        console.log("newNewBoardHistory:", newBoardHistory);

        setnumTurnsTaken(newBoardHistory.length - 1);
        setHistoricTurnIndex(newBoardHistory.length - 1);
        console.log("SETTING BOARD HISTORY");
        setBoardHistory(newBoardHistory);
    };

    /*
    const showTurn = (turnIndex) => {
        // load board layout
        // console.log("showTurn(", turnIndex, ")");
        // console.log("turnIndex:", turnIndex);
        // console.log("historicTurnIndex:", historicTurnIndex);
        // console.log("boardHistory.length:", boardHistory.length);
        const slotsCopy = copyObj(boardHistory[turnIndex]);
        if (turnIndex === boardHistory.length - 1) {
            checkGameOver(slotsCopy);
        } else {
            setGameOver(false);
        }
        setSlots(slotsCopy);
    };
    */

    // ^ / Move History

    const checkGameOver = (slotsAr) => {
        console.log("checkGameOver()...");
        // console.log("slotsAr:", slotsAr);
        // console.log("slots:", slots);
        slotsAr = slotsAr || slots;
        // look at each slot, see if a move can be made from there
        let gameOver = true;
        let pegsLeft = 0;
        for (const slot of slotsAr) {
            if (slot.peg) {
                pegsLeft++;
                const fairTargets = getPegTargetSlots(slot, slotsAr);
                if (fairTargets.length > 0) {
                    gameOver = false;
                    console.log("NOT OVER");
                    // console.log("peg slot:", slot);
                    // console.log("fairTargets", fairTargets);
                    break;
                }
            }
        }
        if (gameOver) {
            console.log("GAME OVER", pegsLeft, "left");
            setPegsRemaining(pegsLeft);
            setGameOver(true);
            return true;
        } else {
            return false;
        }
    };

    const showMoveHints = () => {
        console.log("Board, showMoveHints()");
        // look at each slot, see if a move can be made from there
        const slotsCopy = [...slots];
        for (const slot of slotsCopy) {
            if (slot.peg) {
                const fairTargets = getPegTargetSlots(slot, slotsCopy);
                if (fairTargets.length > 0) {
                    slot.selected = true;
                    for (const target of fairTargets) {
                        target.target = true;
                        // console.log("target:", target);
                    }
                }
            }
        }
        setSlots(slotsCopy);
    };

    // v Select a Slot
    const selectSlot = (index) => {
        console.log("  -- selectSlot(", index, ")");
        const slotsCopy = copyObj(slots);
        const slot = slotsCopy[index];

        if (slot.peg) {
            // Clear targets
            for (const slot of slotsCopy) {
                slot.target = false;
            }
            // deselect all slots
            for (const s of slotsCopy) {
                // toggle .selected for clicked slot
                if (s === slot) {
                    if (setShowMoveHint) {
                        s.selected = true;
                    } else {
                        s.selected = !s.selected;
                    }
                } else {
                    s.selected = false;
                }
            }

            if (slot.selected) {
                const fairTargets = getPegTargetSlots(slot, slotsCopy);
                for (const s of slotsCopy) {
                    // hilight target slots
                    s.target =
                        fairTargets.find((target) => target === s) !==
                        undefined;
                }
            }
            setSlots(slotsCopy);
            setShowMoveHint(false);
        } else if (slot.target && !showMoveHint) {
            // move peg from selected slot to here
            const selectedSlot = slotsCopy.find((s) => s.selected);
            console.log("selectedSlot:", selectedSlot.index);
            if (selectedSlot) {
                selectedSlot.peg = false;
                slot.peg = true;
                getSlotBetween(selectedSlot, slot, slotsCopy).peg = false;
            }
            // Clear targets
            for (const slot of slotsCopy) {
                slot.target = false;
            }
            saveCurrentMove(slotsCopy);
            setSlots(slotsCopy);
            // checkGameOver(slotsCopy);
        }
    };
    // ^ / Select a Slot

    // v Utility stuff v
    const getSlotByRowColumn = (r, c, slotsAr) => {
        const slot = slotsAr.find(
            (slot) => slot.myColumn === c && slot.myRow === r
        );
        return slot;
    };

    const getSlotBetween = (slotA, slotB, slotsAr) => {
        // console.log("getSlotBetween(", slotA.index, slotB.index, ")");
        // console.log('slotA:',slotA);
        // console.log('slotB:',slotB);
        const c = (slotA.myColumn + slotB.myColumn) / 2;
        const r = (slotA.myRow + slotB.myRow) / 2;
        // console.log('c,r:',c,r);
        const slotBetween = getSlotByRowColumn(r, c, slotsAr);
        // console.log("slotBetween:", slotBetween);
        return slotBetween;
    };

    const getPegTargetSlots = (slot, slotsAr) => {
        // find slots 2 spaces away from slot in all directions
        // must have a peg between this slot and target slot
        // console.log("getPegTargetSlots()");
        // console.log("from slot:", slot);
        const targetSlots = [];
        if (slot.peg) {
            const sr = slot.myRow,
                sc = slot.myColumn;
            // console.log("sc,sr:", sc, sr);
            for (let r = sr - 2; r < sr + 3; r += 2) {
                for (let c = sc - 2; c < sc + 3; c += 2) {
                    // console.log("c,r:", c, r);
                    // Rule out above to right, self and below to left
                    if (
                        (r < sr && c > sc) ||
                        (r === sr && c === sc) ||
                        (r > sr && c < sc)
                    ) {
                        // console.log("no. continue.")
                        continue;
                    }
                    const potentialTarget = getSlotByRowColumn(r, c, slotsAr);
                    if (potentialTarget) {
                        // is there a peg between target and moving peg?

                        if (
                            !potentialTarget.peg &&
                            getSlotBetween(slot, potentialTarget, slotsAr).peg
                        ) {
                            // console.log("target:", potentialTarget);
                            targetSlots.push(potentialTarget);
                        } else {
                            // console.log("no. no peg between.");
                        }
                    } else {
                        // console.log("no. no potentialTarget.");
                    }
                }
            }
        }
        // console.log('targetSlots:',targetSlots);
        return targetSlots;
    };
    // ^ / Utility stuff ^
    return (
        <div className="board" style={{ "--slot-unit": slotUnit }}>
            {/* {console.log("SLOTS:", slots)} */}
            {slots.map((slot, index) => {
                return (
                    <React.Fragment key={index}>
                        <div
                            className={`slot${slot.peg ? " peg" : ""}${
                                slot.selected ? " selected" : ""
                            }${
                                slot.target && showTargetSlots ? " target" : ""
                            }`}
                            onPointerDown={() => {
                                selectSlot(index);
                            }}
                        ></div>
                        {[0, 2, 5, 9, 14, 20, 27, 35, 44, 54].includes(
                            index
                        ) ? (
                            <br />
                        ) : (
                            ""
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
export default Board;
