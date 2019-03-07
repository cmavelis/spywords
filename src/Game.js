import _ from 'underscore';
import axios from 'axios';
import React from 'react';
import Board from './components/Board';
import CardCounter from './components/CardCounter';
import Header from './components/Header';
import Modal from './components/Modal';
import './Game.css';
import 'seedrandom';


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
            randomSeed: null,
            counts: _.countBy(cardColorsSample),
            headerIsHidden: false,
            leaderMode: false,
            cardLeaderMarks: Array(25).fill(false),
            wordFiles: {
                cardsClassic: {
                    fileName: 'words_classic.csv',
                    isLoading: true,
                },
                cardsSimple: {
                    fileName: 'words_simple.csv',
                    isLoading: true,
                },
                seedAdjectives: {
                    fileName: 'seed_adjectives.csv',
                    isLoading: true,
                },
                seedNouns: {
                    fileName: 'seed_nouns.csv',
                    isLoading: true,
                },
            },
        };
    }

    componentDidMount() {
        this.getWordData();
    }

    componentDidUpdate() {
        const { wordFiles, randomSeed } = this.state;

        if (!randomSeed) { if (!Object.entries(wordFiles).some(([objName, content]) => content.isLoading)) {
            Math.seedrandom(Date.now());
            const randomAdjective = this.getRandomWord(wordFiles.seedAdjectives);
            const randomNoun = this.getRandomWord(wordFiles.seedNouns);
            const newSeed = `${randomAdjective} ${randomNoun}`;
            this.setState(
                { randomSeed: newSeed },
            );
            this.seedNewGame(newSeed)
            }
        }
    }

    getWordData = () => {
        const { wordFiles } = this.state;
        Object.entries(wordFiles)
            .forEach(([objTitle, objContent]) => {
                const { fileName } = objContent;
                axios.get(fileName)
                    .then((wordsReceived) => {
                        const wordList = wordsReceived.data.split(/\r?\n/);
                        const listLength = wordList.length - 1;
                        return {
                            wordList,
                            listLength,
                            isLoading: false,
                        };
                    })
                    .then((wordData) => {
                        this.setState((prevState) => ({
                            wordFiles: {
                                ...prevState.wordFiles,
                                [objTitle]:
                                    wordData,
                            },
                        }))
                    })
                    .catch(error => this.setState({ error, isLoading: false }));
            });
        this.setState({
            isLoading: false,
        });
    };

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
        const newSeed = value.toLowerCase();
        this.setState({ [name]: newSeed });
        this.seedNewGame(newSeed);
    };

    getRandomWord = (wordObject) => {
        const { wordList, listLength } = wordObject;
        return wordList[Math.floor(Math.random() * listLength)];
    };

    seedNewGame = (newSeed) => {
        let randomSeed = newSeed;
        const { wordFiles } = this.state;
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
            {
                counts: _.countBy(prevState.cardColors.filter(
                    (cc, i) => !prevState.cardShownStatus[i],
                )),
            }
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
