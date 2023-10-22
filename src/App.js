import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={highlight ? `square winner-highlight` : 'square'} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (!xIsNext) {
      nextSquares[i] = 'O';
    } else {
      nextSquares[i] = 'X';
    }
    onPlay(nextSquares, i, nextSquares[i]);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner && winner.symbol) {
    status = 'Winner: ' + winner.symbol;
  } else if (!squares.includes(null)) {
    status = "The match ended in a draw"
  }
    else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const drawSquare = (index) => {
    return (
      <Square
        key={index}
        value={squares[index]}
        onSquareClick={() => handleClick(index)}
        highlight = {winner && winner.symbol && winner.moves.includes(index) ? true : false}
      />
    );
  };

  let board = [];
  for (let r = 0; r < 3; r++) {
    let squaresRow = [];
    for (let c = 0; c < 3; c++) {
      const sIndex = r * 3 + c;
      squaresRow = [...squaresRow, drawSquare(sIndex)]
    }
    board = [
      ...board, 
      <div className="board-row">
       {squaresRow}
      </div>
    ]
  }

  return (
    <>
      <div className={winner && winner.symbol ? "status winner-highlight" : (status === "The match ended in a draw" ? "status draw-highlight" : "status")}>{status}</div>
      {board}
      {/* <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div> */}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
  {
    squares: Array(9).fill(null),
    lastMove: {
      row: 0,
      col: 0,
    },
    playerSymbol: null,
  }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isDescending, setIsDescending] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, index, playerSymbol) {
    const nextHistory = [...history.slice(0, currentMove + 1), {
      squares: nextSquares,
      lastMove: {
        row: Math.floor(index / 3),
        col: Math.floor(index % 3),
      },
      playerSymbol: playerSymbol
    }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((historyMove, move) => {
    let description;
    if (move > 0) {
      description = `Go to move #${move} at location (row: ${historyMove.lastMove.row}, col: ${historyMove.lastMove.col}) by player ${historyMove.playerSymbol}`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {move === currentMove  ? `You are at move #${move} (row: ${historyMove.lastMove.row}, col: ${historyMove.lastMove.col})` : <button onClick={() => jumpTo(move)}>{description}</button>}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
      <button  className="sort-btn" onClick = {() => {
        setIsDescending(!isDescending)
        }}>
        {isDescending ?  "Ascending" : "Descending"}
      </button>
        <ol>{isDescending ? moves.reverse() : moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        symbol: squares[a],
        moves: lines[i]
      };
    }
  }
  return null;
}
