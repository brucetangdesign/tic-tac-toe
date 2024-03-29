import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick= {props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {

    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderSquares(i) {
    const numCols = 3;
    let squares = [];

    for(let j = 0; j < numCols ; j++) {
      squares.push(this.renderSquare(j + (i*3)));
    }

    return (
      squares
    )
  }

  renderRows(){
    const numRows = 3;
    let rows = [];

    for(let i = 0; i < numRows ; i++) {
      rows.push(<div class="board-row">{this.renderSquares(i)}</div>);
    }

    return (
      rows
    );
  }

  render() {
    return (
      <div>
        {this.renderRows()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: Array(2).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const position = calculatePosition(i);
    if(calculateWinner(squares) || squares[i]) {
      return;
    }

    console.log(position);

    squares[i] = this.state.xIsNext? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares:squares,
        position: position,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step %2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to Game start';
      let fontWeight = null;
console.log(history);
      if(move === history.length-1) {
        fontWeight = 'bold';
      }
      return (
        <li key={move}>
          <button className={fontWeight} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
          {(desc === 'Go to Game start') ? '' : <p>This is row: {history[move].position[0]}, col: {history[move].position[1]}</p>}
        </li>
      )
    });

    let status;

    if(winner) {
      status = 'Winner: ' + winner;
    }
    else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
      return squares[a];
    }
  }
  return null;
}

function calculatePosition(sqNum) {
  const rows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];

  const cols = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  let rowNum = null;
  let colNum = null;

  for (let i = 0; i < rows.length; i++) {
    for(let j = 0; j < rows[i].length; j ++) {
      if(sqNum === rows[i][j]){
        rowNum = i + 1;
        break;
      }
    }
  }

  for (let i = 0; i < cols.length; i++) {
    for(let j = 0; j < cols[i].length; j ++) {
      if(sqNum === cols[i][j]){
        colNum = i + 1;
        break;
      }
    }
  }

  return [rowNum, colNum];
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
