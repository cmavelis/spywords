import React from 'react';
import axios from 'axios';
import Game from './Game';
import SetupMenu from './components/SetupMenu';
import './GameContext.css';


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
                    .catch(error => this.setState({ error }));
            });
    };

    setSeed = (newSeed) => {
        this.setState({ randomSeed: newSeed.toLowerCase() });
    };

    handleInputChange = (e) => {
        const { value } = e.target;
        this.setSeed(value);
    };

     toggleHeaderHide = () => {
         this.setState(prevState => ({ headerIsHidden: !prevState.headerIsHidden }));
     };

     render() {
         const {
             randomSeed,
             headerIsHidden,
             wordFiles,
         } = this.state;

         return (
             <div>
                 {Object.entries(wordFiles).some(obj => obj[1].isLoading)
                     ? (
                         <p> Loading... </p>
                     )
                     : (
                         <div>
                             <SetupMenu
                                 randomSeed={randomSeed}
                                 headerIsHidden={headerIsHidden}
                                 toggleHeaderHide={this.toggleHeaderHide}
                                 handleInputChange={this.handleInputChange}
                                 showModal={this.showModal}
                             />
                             <Game
                                 randomSeed={randomSeed}
                                 wordFiles={wordFiles}
                                 setSeed={this.setSeed}
                             />
                         </div>
                     )
                 }
             </div>
         );
     }
}

export default GameLoader;
