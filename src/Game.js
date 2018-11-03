/* eslint-disable react/prop-types */
import _ from 'underscore';
import React from 'react';
import Board from './components/board';
import Modal from './components/modal';
import './Game.css';
import 'seedrandom';
// import Papa from 'papaparse';
//
// const wordFile = File('./words_simple.txt');

// const words = Papa.parse(wordFile);

// generate placeholder words
const wordList = _.range(0, 100).map(i => `word ${i}`);

const numberOfWords = wordList.length;

// random seed hard-coded for now
Math.seedrandom(100);

// select sample of words using seed, ignoring repeats
const wordsSelected = [];
let wordToAdd = '';
while (wordsSelected.length < 25) {
    wordToAdd = wordList[Math.floor(Math.random() * numberOfWords)];
    if (!wordsSelected.includes(wordToAdd)) wordsSelected.push(wordToAdd);
}

// hard-coded cardColors grid
// 9 for 1st team, 8 for 2nd team
const cardColorsSample = _.flatten([
    ['b', 'r', 'w', 'w', 'b'],
    ['b', 'r', 'w', 'b', 'b'],
    ['b', 'r', 'r', 'r', 'w'],
    ['b', 'r', 'w', 'k', 'w'],
    ['b', 'r', 'w', 'r', 'b'],
]);

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            words: wordsSelected,
            cardColors: cardColorsSample,
            cardIDs: [0, 1, 2, 3, 4].map(i => Array(5).fill(i)),
            history: [{
                squares: Array(25).fill(false),
            }],
            xIsNext: true,
            stepNumber: 0,
            modalShown: false,
            cardClicked: null,
        };
    }

    // componentDidMount() {
    //     const { cardColors, history } = this.state;
    //     this.setState({ startingCount: _.countBy(cardColors),
    // });
    //     }

    showModal = (cardID) => {
        this.setState({
            modalShown: true,
            cardClicked: cardID,
        });
    };

    hideModal = () => {
        this.setState({ modalShown: false });
    };

    handleCardToggle = () => {
        const {
            history,
            xIsNext,
            stepNumber,
            cardClicked,
            cardColors,
        } = this.state;
        const historySlice = history.slice(0, stepNumber + 1);
        const current = historySlice[historySlice.length - 1];
        const squares = current.squares.slice();
        // if (calculateWinner(squares) || squares[i]) {
        //   return;
        // }
        squares[cardClicked] = !squares[cardClicked];

        const counts = _.countBy(cardColors.filter((cc, i) => squares[i]));

        this.setState({
            xIsNext: !xIsNext,
            history: historySlice.concat([{
                squares,
                whoMoved: xIsNext ? 'X' : 'O',
                moveLocation: [Math.floor(cardClicked / 5), cardClicked % 5],
            }]),
            stepNumber: historySlice.length,
            counts,
        });

        this.hideModal();
    };

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
            // startingCount,
            stepNumber,
            modalShown,
            cardClicked,
            counts,
        } = this.state;
        const current = history[stepNumber];
        const squares = current.squares.slice();

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
                        onClick={this.showModal}
                        modalClick={this.handleCardToggle}
                        cardColors={cardColors}
                    />

                    {/* <div className="game-info"> */}
                    {/* <div>{status}</div> */}
                    {/* <ol>{moves}</ol> */}
                    {/* </div> */}
                    <div className="board-row">
                        <div className="card counter-red">
                            Red cards remaining:
                            {' '}
                            {counts && counts.r
                                ? _.countBy(cardColors).r - counts.r
                                : _.countBy(cardColors).r}
                        </div>
                        <div className="card counter-blue">
                            Blue cards remaining:
                            {' '}
                            {counts && counts.b
                                ? _.countBy(cardColors).b - counts.b
                                : _.countBy(cardColors).b}
                        </div>
                    </div>
                </div>
                <div>
                    <Modal
                        show={modalShown}
                        handleClose={this.hideModal}
                        handleCardToggle={this.handleCardToggle}
                        cardClicked={cardClicked}
                        wordClicked={words[cardClicked]}
                    >
                        <p>
                            {squares[cardClicked] ? 'Hide card?' : 'Reveal card?'}
                        </p>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Game;
