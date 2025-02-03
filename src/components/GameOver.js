import React from "react";

const GameOver = ({ numTurnsTaken, pegsRemaining, forceUpdate }) => {
    return (
        <div className="game-over">
            <h2>GAME OVER</h2>
            <p>Pegs Left: {pegsRemaining}</p>
            <p>Turns taken: {numTurnsTaken}</p>
            <div>
                <button onPointerDown={forceUpdate}>Play Again</button>
            </div>
        </div>
    );
};

export default GameOver;
