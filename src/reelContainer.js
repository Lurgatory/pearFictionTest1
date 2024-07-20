import {
    Sprite,
    Container,
} from "pixi.js";
import { reelSet } from "./assets/constants";


export default async function createReelContainer(app, SYMBOL_SIZE, position, reelImageAssets, gameContainer, margin, REEL_WIDTH, reels) {
    const reelsContainer = new Container();
    reelsContainer.y = margin;
    reelsContainer.x = Math.round((app.screen.width - REEL_WIDTH * 5) / 2);
    // Create a 5x3 grid of reel symbols
    for (let i = 0; i < 5; i++) {
        const reelContainer = new Container();
        reelContainer.x = i * REEL_WIDTH;
        gameContainer.addChild(reelContainer);

        const reel = {
            container: reelContainer,
            symbolNames: [],
            symbols: [],
        };

        // Build the symbols
        for (let j = 0; j < 3; j++) {
            const symbolIndex = (position[i] + j) % reelSet[i].length;
            const symbolName = reelSet[i][symbolIndex];
            const symbol = new Sprite(reelImageAssets[symbolName]);
            symbol.y = j * SYMBOL_SIZE;
            symbol.scale.set(SYMBOL_SIZE / symbol.width);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            reel.symbolNames.push(symbolName);
            reel.symbols.push(symbol);
            reelContainer.addChild(symbol);
        }
        reels.push(reel);
    }
    return reelsContainer;
}