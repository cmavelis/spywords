import React from 'react';
import axios from 'axios';
import Game from './Game';
import SetupMenu from './components/SetupMenu';


// const loadedGame = (props) => {
//     const { wordFiles } = props;
//     if (!Object.entries(wordFiles).some(obj => obj[1].isLoading) {
//         return (
//             <Game />
//         )
//     }
// }

class GameLoader extends React.Component {
    constructor(props) {
        super(props);
        this.setSeed = this.setSeed.bind(this);
        this.state = {
            randomSeed: '',
            headerIsHidden: false,
            leaderMode: false,
            wordFiles: {
                cardsClassic: {
                    fileName: 'words_classic.csv',
                    isLoading: true,
                },
                cardsSimple: {
                    fileName: 'words_simple.csv',
                    isLoading: true,
                },
                cardsBaby: {
                    fileName: 'words_baby.csv',
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
                        this.setState(prevState => ({
                            wordFiles: {
                                ...prevState.wordFiles,
                                [objTitle]:
                                    wordData,
                            },
                        }));
                    });
                // .catch(error => this.setState({ error }));
            });
    };

    handleInputChange = (e) => {
        const { value } = e.target;
        this.setSeed(value);
    };

    setSeed = (newSeed) => {
        this.setState({ randomSeed: newSeed.toLowerCase() });
    };

    getRandomWord = (wordObject) => {
        const { wordList, listLength } = wordObject;
        return wordList[Math.floor(Math.random() * listLength)];
    };

    generateNewSeed = () => {
        const { wordFiles } = this.state;
        Math.seedrandom(Date.now());
        const randomAdjective = this.getRandomWord(wordFiles.seedAdjectives);
        const randomNoun = this.getRandomWord(wordFiles.seedNouns);
        const newSeed = `${randomAdjective} ${randomNoun}`;
        this.setSeed(newSeed);
        this.toggleLeaderMode(false);
    };

     toggleHeaderHide = () => {
         this.setState(prevState => ({ headerIsHidden: !prevState.headerIsHidden }));
     };

     toggleLeaderMode = (force = null) => {
         if (force !== null) {
             this.setState({ leaderMode: force });
         } else {
             this.setState(prevState => ({ leaderMode: !prevState.leaderMode }));
         }
     };

    getWordFileByQueryParam = () => {
        const { wordFiles } = this.state;
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('mode') === 'baby' ? wordFiles.cardsBaby : wordFiles.cardsClassic;
    };

    render() {
        const {
            randomSeed,
            headerIsHidden,
            wordFiles,
            leaderMode,
        } = this.state;

        return (
            <div>
                {Object.entries(wordFiles).some(obj => obj[1].isLoading)
                    ? (
                        <div className="card counter card-color-blank"> Loading... </div>
                    )
                    : (
                        <div>
                            <div className="game">
                                <SetupMenu
                                    randomSeed={randomSeed}
                                    headerIsHidden={headerIsHidden}
                                    toggleHeaderHide={this.toggleHeaderHide}
                                    toggleLeaderMode={this.toggleLeaderMode}
                                    handleInputChange={this.handleInputChange}
                                    showModal={this.showModal}
                                    generateNewSeed={this.generateNewSeed}
                                />
                            </div>
                            <Game
                                randomSeed={randomSeed}
                                wordFile={this.getWordFileByQueryParam()}
                                generateNewSeed={this.generateNewSeed}
                                leaderMode={leaderMode}
                                toggleLeaderMode={this.toggleLeaderMode}
                            />
                        </div>
                    )
                }
            </div>
        );
    }
}

export default GameLoader;
