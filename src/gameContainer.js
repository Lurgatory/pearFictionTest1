import {
    Container,
} from "pixi.js";
import createBottomContainer  from './bottomContainer';
import createReelContainer from './reelContainer';

export default async function createGameContainer(app, reelImageAssets) {

    let position = [0, 0, 0, 0, 0];
    const REEL_WIDTH = app.screen.width /10;
    const SYMBOL_SIZE = REEL_WIDTH;
    const margin = (app.screen.height - SYMBOL_SIZE * 4) / 5;
    const reels = [];
    
    const gameContainer = new Container();
    gameContainer.y = margin;
    gameContainer.x = Math.round((app.screen.width - REEL_WIDTH * 5)/2);

    const reelContainer = await createReelContainer(app, SYMBOL_SIZE, position, reelImageAssets, gameContainer, margin, REEL_WIDTH, reels);
    gameContainer.addChild(reelContainer);

    const bottomContainer = await createBottomContainer(app, reels, SYMBOL_SIZE, position, reelImageAssets);
    bottomContainer.y = gameContainer.height;
    bottomContainer.x = gameContainer.width / 2;
    gameContainer.addChild(bottomContainer);
    return gameContainer;
}