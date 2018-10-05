import React, { Component } from 'react';
import logo from './logo.svg';
import './Game.css';

function range(start, end, step = 1) {

  // Test that the first 3 arguments are finite numbers.
  // Using Array.prototype.every() and Number.isFinite().
  const allNumbers = [start, end, step].every(Number.isFinite);

  // Throw an error if any of the first 3 arguments is not a finite number.
  if (!allNumbers) {
    throw new TypeError('range() expects only finite numbers as arguments.');
  }

  // Ensure the step is always a positive number.
  if (step <= 0) {
    throw new Error('step must be a number greater than 0.');
  }

  // When the start number is greater than the end number,
  // modify the step for decrementing instead of incrementing.
  if (start > end) {
    step = -step;
  }

  // Determine the length of the array to be returned.
  // The length is incremented by 1 after Math.floor().
  // This ensures that the end number is listed if it falls within the range.
  const length = Math.floor(Math.abs((end - start) / step)) + 1;

  // Fill up a new array with the range numbers
  // using Array.from() with a mapping function.
  // Finally, return the new array.
  return Array.from(Array(length), (x, index) => start + index * step);

}

function Card(props) {
  return (
    <button className="card" >
        {/*<button className="card" onClick={props.onClick}>*/}
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderCard(i) {
    return(
      <Card
        value={this.props.words[i]}
        key={i}
        // onClick={() => this.props.onClick(i)}
       />
    );
  }

  render() {
    return (
      <div>
          {this.props.cardIDs.map((row, i) =>
              <div className="board-row" key={i}>
                {row.map((card, j) => this.renderCard(i*5 + j))}
              </div>)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        words: range(0, 24).map(i => 'word' + i),
      cardIDs: [0, 1, 2, 3, 4].map(i => Array(5).fill(i)),
      history: [{
        revealed: Array(5).fill(Array(5).fill(null)),
      }],
      stepNumber: 0,
    };
  }

  // handleClick(i) {
  //   const history = this.state.history.slice(0, this.state.stepNumber + 1);
  //   const current = history[history.length - 1];
  //   const squares = current.squares.slice();
  //   if (calculateWinner(squares) || squares[i]) {
  //     return;
  //   }
  //   squares[i] = this.state.xIsNext ? 'X' : 'O';
  //
  //   this.setState({
  //     xIsNext: !this.state.xIsNext,
  //     history: history.concat([{
  //       squares: squares,
  //       whoMoved: this.state.xIsNext ? 'X' : 'O',
  //       moveLocation: [Math.floor(i/3), i%3],
  //     }]),
  //     stepNumber: history.length,
  //   });
  // }

  // jumpTo(step) {
  //   this.setState({
  //     stepNumber: step,
  //     xIsNext: (step % 2) === 0,
  //   });
  // }

  render() {
    const history = this.state.history;
    const current = history[0];
    const words = this.state.words;
    const cardIDs = this.state.cardIDs;
    // const winner = calculateWinner(current.squares);

    // const moves = history.map((step, move) => {
    //   const desc = move ?
    //      'Go to move #'+ move + ': ' + step.whoMoved + ' to (r,c) ' + step.moveLocation :
    //      'Go to game start';
    //   return (
    //     <li key={move}>
    //        {this.state.stepNumber == move ? (
    //         <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
    //         ):
    //        (<button onClick={() => this.jumpTo(move)}>{desc}</button>)
    //        }
    //     </li>
    //   );
    // });

    // let status;
    // if (winner) {
    //   status = 'Winner: ' + winner;
    // } else {
    //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            words={words}
            cardIDs={cardIDs}
            // onClick={(i) => this.handleClick(i)}
            />

        </div>
        {/*<div className="game-info">*/}
          {/*<div>{status}</div>*/}
          {/*<ol>{moves}</ol>*/}
        {/*</div>*/}
      </div>
    );
  }
}

export default Game;
