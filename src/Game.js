/* eslint-disable react/prop-types */
import React from 'react';
import { Board } from './board';
import Modal from './modal';
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

const cardColorsSample = [
    ['b', 'r', 'w', 'w', 'b'],
    ['b', 'r', 'w', 'b', 'w'],
    ['b', 'r', 'w', 'r', 'w'],
    ['b', 'r', 'w', 'k', 'w'],
    ['b', 'r', 'w', 'w', 'w'],
];

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            words: range(0, 24).map(i => `word${i}`),
            cardColors: cardColorsSample,
            cardIDs: [0, 1, 2, 3, 4].map(i => Array(5).fill(i)),
            history: [{
                squares: Array(25).fill(false),
            }],
            stepNumber: 0,
            modalShown: false,
        };
    }

    showModal = () => {
        this.setState({ modalShown: true });
    };

  hideModal = () => {
      this.setState({ modalShown: false });
  };

  handleClick(i) {
      const {
          history,
          xIsNext,
          stepNumber,
      } = this.state;
      const historySlice = history.slice(0, stepNumber + 1);
      const current = historySlice[historySlice.length - 1];
      const squares = current.squares.slice();
      // if (calculateWinner(squares) || squares[i]) {
      //   return;
      // }
      squares[i] = !squares[i];

      this.setState({
          xIsNext: !xIsNext,
          history: historySlice.concat([{
              squares,
              whoMoved: xIsNext ? 'X' : 'O',
              moveLocation: [Math.floor(i / 5), i % 5],
          }]),
          stepNumber: historySlice.length,
      });
  }

  // jumpTo(step) {
  //   this.setState({
  //     stepNumber: step,
  //     xIsNext: (step % 2) === 0,
  //   });
  // }

  render() {
      const {
          history,
          words,
          cardIDs,
          cardColors,
          stepNumber,
          modalShown,
      } = this.state;
      const current = history[stepNumber];
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
          <div>
              <div className="game">
                  <Board
                      words={words}
                      cardIDs={cardIDs}
                      squares={current.squares}
                      onClick={i => this.handleClick(i)}
                      cardColors={cardColors}
                  />

                  {/* <div className="game-info"> */}
                  {/* <div>{status}</div> */}
                  {/* <ol>{moves}</ol> */}
                  {/* </div> */}
              </div>
              <div>
                  <button type="button" onClick={this.showModal}>
          open
                  </button>

                  <Modal show={modalShown} handleClose={this.hideModal}>
                      <p>Modal</p>
                      <p>Data</p>
                  </Modal>
              </div>
          </div>
      );
  }
}

export default Game;
