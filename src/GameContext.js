import Header from './components/Header';
import Game from './Game.js';
import './GameContext.css';
import React from 'react';
import axios from 'axios';


// const loadedGame = (props) => {
//     const { wordFiles } = props;
//     if (!Object.entries(wordFiles).some(obj => obj[1].isLoading) {
//         return (
//             <Game />
//         )
//     }
// }

class GameContext extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            randomSeed: null,
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
                    })
                    .catch(error => this.setState({ error, }));
            });
    };

    render() {
        const {
            cardShownStatus,
            words,
            cardColors,
            modalShown,
            cardClicked,
            counts,
            randomSeed,
            headerIsHidden,
            cardLeaderMarks,
            wordFiles,
        } = this.state;

        return (
            <div>
                {/*<Header*/}
                    {/*randomSeed={randomSeed}*/}
                    {/*headerIsHidden={headerIsHidden}*/}
                    {/*toggleHeaderHide={this.toggleHeaderHide}*/}
                    {/*handleInputChange={this.handleInputChange}*/}
                    {/*showModal={this.showModal}*/}
                {/*/>*/}
                {wordFiles.cardsClassic.isLoading
                    ?
                    (
                        <p>Loading Classic...</p>
                    ) :
                    (
                        <p>Classic loaded</p>
                    )
                }
                {wordFiles.cardsSimple.isLoading
                    ?
                    (
                        <p>Loading...</p>
                    ) :
                    (
                        <p>Simple loaded</p>
                    )
                }
                {wordFiles.seedAdjectives.isLoading
                    ?
                    (
                        <p>Loading...</p>
                    ) :
                    (
                        <p>Adj loaded</p>
                    )
                }
                {wordFiles.seedNouns.isLoading
                    ?
                    (
                        <p>Loading...</p>
                    ) :
                    (
                        <p>Nouns loaded</p>
                    )
                }
                {/*{Object.entries(wordFiles).some(obj => obj[1].isLoading)*/}
                    {/*? (*/}
                        {/*<p> Loading... </p>*/}
                    {/*)*/}
                    {/*: (*/}
                        {/*<Game*/}
                            {/*children={}*/}
                        {/*/>*/}
                    {/*)*/}

                {/*}*/}

            </div>
        )
    }

}

export default GameContext;
