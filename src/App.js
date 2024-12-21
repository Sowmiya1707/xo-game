import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');  // Connect to the backend

function App() {
    const [board, setBoard] = useState(Array(9).fill(null)); // 3x3 board
    const [isXNext, setIsXNext] = useState(true); // Player turn

    const handleClick = (index) => {
        if (board[index] || calculateWinner(board)) return;  // Ignore if cell is filled or game is won

        const newBoard = board.slice();
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);

        // Emit the move to the server
        socket.emit('makeMove', { index, value: newBoard[index] });
    };

    useEffect(() => {
        socket.on('updateGame', (data) => {
            const newBoard = board.slice();
            newBoard[data.index] = data.value;
            setBoard(newBoard);
        });
    }, [board]);

    const calculateWinner = (board) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    };

    const winner = calculateWinner(board);
    let status = winner ? `Player ${winner} wins!` : `Next player: ${isXNext ? 'X' : 'O'}`;

    return (
        <div className="game">
            <h2>{status}</h2>
            <div className="board">
                {board.map((cell, index) => (
                    <div key={index} className="cell" onClick={() => handleClick(index)}>
                        {cell}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
