import _ from 'underscore';
import React from 'react';
import Board from './components/Board';
import CardCounter from './components/CardCounter';
import Header from './components/Header';
import Modal from './components/Modal';
import './Game.css';
import 'seedrandom';


const getWordList = (fileName) => {
    // populate wordList from adjacent file
    let wordsReceived = '';
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                wordsReceived = xhr.responseText;
            }
        }
    };
    xhr.open('GET', fileName, false);
    xhr.send(null);

    const wordList = wordsReceived.split(/\r?\n/);
    const listLength = wordList.length - 1;
    return [wordList, listLength];
};

const wordFiles = {
    cardsClassic: {
        filename: 'words_classic.csv',
        wordList: [],
        listLength: 0,
    },
    cardsSimple: {
        filename: 'words_simple.csv',
        wordList: [],
        listLength: 0,
    },
    seedAdjectives: {
        filename: 'seed_adjectives.csv',
        wordList: [],
        listLength: 0,
    },
    seedNouns: {
        filename: 'seed_nouns.csv',
        wordList: [],
        listLength: 0,
    },
};

const getWords = () => {
    Object.keys(wordFiles)
        .forEach((key) => {
            const [wordList, listLength] = getWordList(wordFiles[key].filename);
            wordFiles[key].wordList = wordList;
            wordFiles[key].listLength = listLength;
        });
};

const promiseGetWords = new Promise((succeed, fail) => {
    succeed(getWords());
});

// hard-coded cardColors grid
// 9 for 1st team, 8 for 2nd team
// 1 death, 7 neutral
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
            words: Array(25).fill(''),
            cardColors: cardColorsSample,
            cardIDs: [0, 1, 2, 3, 4].map(i => Array(5).fill(i)),
            cardShownStatus: Array(25).fill(false),
            modalShown: false,
            cardClicked: null,
            randomSeed: '1',
            counts: _.countBy(cardColorsSample),
            headerIsHidden: false,
            leaderMode: false,
            cardLeaderMarks: Array(25).fill(false),
        };
    }

    // seedNewWords should go in the constructor I think
    componentDidMount() {
        const { randomSeed } = this.state;
        if (randomSeed === '1') {
            Math.seedrandom(Date.now());
            const randomAdjective = this.getRandomWord(wordFiles.seedAdjectives);
            const randomNoun = this.getRandomWord(wordFiles.seedNouns);
            this.setState(
                { randomSeed: `${randomAdjective} ${randomNoun}` },
            );
        }
        promiseGetWords.then(this.seedNewGame)
            .catch(err => console.log(`There was an error:${err}`));
    }

    componentDidUpdate() {

    }

    showModal = (cardID) => {
        this.setState({
            modalShown: true,
            cardClicked: cardID,
        });
    };

    hideModal = () => {
        this.setState({ modalShown: false, cardClicked: undefined });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value.toLowerCase() });
    };

    getRandomWord = (wordObject) => {
        const { wordList, listLength } = wordObject;
        return wordList[Math.floor(Math.random() * listLength)];
    };

    seedNewGame = () => {
        let { randomSeed } = this.state;
        const { wordList, listLength } = wordFiles.cardsClassic;
        const today = new Date();
        const todayValue = today.getUTCFullYear().toString()
            + today.getUTCMonth() + today.getUTCDate();
        if (randomSeed !== 'test') {
            randomSeed = todayValue + randomSeed;
        }
        Math.seedrandom(randomSeed);
        // select sample of words using seed, ignoring repeats
        const wordsSelected = [];
        let wordToAdd = '';
        while (wordsSelected.length < 25) {
            wordToAdd = wordList[Math.floor(Math.random() * listLength)];
            if (!wordsSelected.includes(wordToAdd)) wordsSelected.push(wordToAdd);
        }

        let redHasMore;

        // uses odd/even to determine who goes first
        if (typeof Number(randomSeed) === 'number' && _.isFinite(randomSeed)) {
            redHasMore = (Number(randomSeed) % 2);
        } else {
            Math.seedrandom(randomSeed);
            redHasMore = 1 * (Math.random() > 0.5);
        }

        const redArray = Array(8 + redHasMore).fill('r');
        const blueArray = Array(9 - redHasMore).fill('b');
        const whiteArray = Array(7).fill('w');
        const blackArray = ['k'];

        const fullArray = redArray.concat(blueArray, whiteArray, blackArray);
        // apply random seed before shuffling the Array
        Math.seedrandom(randomSeed);
        const newCardColors = _.shuffle(fullArray);
        this.setState({
            cardColors: newCardColors,
            words: wordsSelected,
            leaderMode: false,
        });
        this.updateBoard(newCardColors);
    };

    toggleHeaderHide = () => {
        const { headerIsHidden } = this.state;
        this.setState({
            headerIsHidden: !headerIsHidden,
        });
    };

    updateBoard = () => {
        // change revealed status of clicked card
        // if LEADER, mark instead of reveal, since all will be revealed

        // update state
        this.setState((prevState) => {
            const prevClick = prevState.cardClicked;
            let updateArray;
            if (!_.isNaN(prevClick)) {
                if (prevState.leaderMode) {
                    updateArray = prevState.cardLeaderMarks;
                    updateArray[prevClick] = !updateArray[prevClick];
                    return { cardLeaderMarks: updateArray };
                }
                updateArray = prevState.cardShownStatus;
                updateArray[prevClick] = !updateArray[prevClick];
                return { cardShownStatus: updateArray };
            }
            return prevState;
        });
        this.setState(prevState => (
            { counts: _.countBy(prevState.cardColors.filter((cc, i) => !prevState.cardShownStatus[i])) }
        ));
    };

    handleCardToggle = () => {
        this.setState((prevState) => {
            if (prevState.cardClicked === 'leader_mode') {
                return {
                    leaderMode: true,
                    cardShownStatus: Array(25)
                        .fill(true),
                };
            }
            return {
                prevState,
            };
        });
        this.updateBoard();
        this.hideModal();
    };

    render() {
        const {
            cardShownStatus,
            words,
            cardIDs,
            cardColors,
            modalShown,
            cardClicked,
            counts,
            randomSeed,
            headerIsHidden,
            cardLeaderMarks,
        } = this.state;

        return (
            <div>
                <div className="game">
                    <Header
                        randomSeed={randomSeed}
                        headerIsHidden={headerIsHidden}
                        toggleHeaderHide={this.toggleHeaderHide}
                        handleInputChange={this.handleInputChange}
                        seedNewGame={this.seedNewGame}
                        showModal={this.showModal}
                    />
                    <Board
                        words={words}
                        cardIDs={cardIDs}
                        squares={cardShownStatus}
                        onClick={this.showModal}
                        modalClick={this.handleCardToggle}
                        cardColors={cardColors}
                        cardLeaderMarks={cardLeaderMarks}
                    />
                    <CardCounter
                        counts={counts}
                    />
                </div>
                <div>
                    <Modal
                        show={modalShown}
                        handleClose={this.hideModal}
                        handleCardToggle={this.handleCardToggle}
                        cardClicked={cardClicked}
                        wordClicked={words[cardClicked]}
                    >
                        {cardClicked === 'leader_mode'
                            ? (
                                <p>
                                    Turn on leader mode?
                                </p>
                            )
                            : (
                                <p>
                                    {cardShownStatus[cardClicked] ? 'Hide card?' : 'Reveal card?'}
                                </p>
                            )
                        }
                    </Modal>
                </div>
            </div>
        );
    }
}


export default Game;
