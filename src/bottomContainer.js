import {
    Assets,
    Text,
    Sprite,
    Container,
} from "pixi.js";
import { reelSet, payLines, payTable } from "./assets/constants";

export default async function createBottomContainer(app, reels, SYMBOL_SIZE, position, reelImageAssets) {
    const bottomContainer = new Container();
    bottomContainer.width = app.screen.width;
    let winCounts = 0;
    let loseCounts = 0;

    const positionText = new Text({
        text: `Position: ${position.join(', ')}`,
        style: {
            fontFamily: 'Arial',
            fontSize: app.screen.width / 60,
            fill: 'black',
            stroke: '#000000',
        },
    });
    positionText.anchor.set(0.5);
    positionText.x = app.screen.width > app.screen.height ? bottomContainer.x - app.screen.width / 5 : bottomContainer.x - app.screen.width / 10;
    positionText.y = bottomContainer.y + 50;
    bottomContainer.addChild(positionText);

    const texture = await Assets.load('images/spin_button.png');
    const spinButton = new Sprite(texture);
    spinButton.anchor.set(0.5);
    spinButton.x = bottomContainer.x;
    spinButton.y = positionText.y + spinButton.height / 2 - 10;
    spinButton.scale.set(SYMBOL_SIZE / spinButton.width * 0.8);
    spinButton.interactive = true;
    spinButton.buttonMode = true;
    spinButton.on('pointerdown', onSpinButtonPressed);
    bottomContainer.addChild(spinButton);

    const winsText = new Text({
        text: 'Total Wins: 0',
        style: {
            fontFamily: 'Arial',
            fontSize: 30,
            fill: 'black',
            stroke: '#000000',
        },
    });
    winsText.anchor.set(0.5);
    winsText.x = spinButton.x;
    winsText.y = spinButton.y + spinButton.height / 2 + 20;
    bottomContainer.addChild(winsText);

    const winsDetail = new Text({
        text: '',
        style: {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'black',
            stroke: '#000000',
        },
    });
    winsDetail.anchor.x = 0.5;
    winsDetail.x = winsText.x;
    winsDetail.y = winsText.y + 20;
    bottomContainer.addChild(winsDetail);

    const welcomeText = new Text({
        text: 'PearFiction Slot Game!!',
        style: {
            fontFamily: 'Arial',
            fontSize: app.screen.width / 60,
            fill: 'black',
            stroke: '#000000',
        },
    });
    welcomeText.anchor.set(0, 0.5);
    welcomeText.x = app.screen.width > app.screen.height ? bottomContainer.x + app.screen.width / 15 : bottomContainer.x + app.screen.width / 35;
    welcomeText.y = positionText.y;
    bottomContainer.addChild(welcomeText);



    function onSpinButtonPressed() {
        position = position.map(() => Math.floor(Math.random() * 20));
        positionText.text = `Position: ${position.join(', ')}`;
        updateReels();
        calculateWins();
    }

    function updateReels() {
        for (let i = 0; i < 5; i++) {
            const reel = reels[i];
            reel.symbols.forEach((symbol, j) => {
                const newIndex = (position[i] + j) % reelSet[i].length;
                const symbolName = reelSet[i][newIndex];
                reel.symbolNames[j] = symbolName;
                symbol.texture = reelImageAssets[symbolName];
            });
        }
    }

    function calculateWins() {
        let totalWins = 0;
        let winDetails = [];

        payLines.forEach((line, i) => {
            let symbolCounts = {};
            line.forEach(([reelIndex, symbolIndex]) => {
                const symbolName = reels[reelIndex].symbolNames[symbolIndex];
                symbolCounts[symbolName] = (symbolCounts[symbolName] || 0) + 1;
            });
            const win = Object.values(symbolCounts).some((count) => count >= 3);
            if (win) {
                totalWins++;
                winDetails.push({ line: i, symbolCounts });
            };
        });

        if (totalWins > 0) {
            winCounts++;
            loseCounts = 0;
        } else {
            loseCounts++;
            winCounts = 0;
        }

        welcomeTextAnimation(winCounts, loseCounts);

        winsText.text = `Total Wins: ${totalWins}`;

        winsDetail.text = winDetails.map(detail => {
            const symbolCounts = Object.entries(detail.symbolCounts)
                .filter(([symbol, count]) => count >= 3)
                .map(([symbol, count]) => `${symbol} x${count}`)
                .join(', ');
            const payment = Object.entries(detail.symbolCounts)
                .filter(([symbol, count]) => count >= 3)
                .map(([symbol, count]) => payTable[symbol][count]);

            return `- payline ${detail.line + 1}, ${symbolCounts}, ${payment}`;
        }).join('\n');
    }

    function welcomeTextAnimation(winCount, loseCount) {
        if (winCount === 1) {
            welcomeText.text = 'Congratulations!! You won!!';
        } else if (winCount === 2) {
            welcomeText.text = 'You are on a roll!!';
        } else if (winCount === 3) {
            welcomeText.text = 'You are amazing!!';
        } else if (winCount === 4) {
            welcomeText.text = 'You are a God of Gamble!!';
        } else if (winCount >= 5) {
            welcomeText.text = 'Damn!! Win Again!? Bet you can\'t do it again!!';
        } else if (loseCount === 1) {
            welcomeText.text = 'Better luck next time!!';
        } else if (loseCount === 2) {
            welcomeText.text = 'Don\'t give up!!';
        } else if (loseCount === 3) {
            welcomeText.text = 'You are so close!!';
        } else if (loseCount >= 4) {
            welcomeText.text = 'You are a fighter!!';
        } else {
            welcomeText.text = 'PearFiction Slot Game!!';
        }
    }

    return bottomContainer;
}