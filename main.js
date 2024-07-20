import {
    Application,
    Assets,
} from 'pixi.js';
import createGameContainer from './src/gameContainer';

(async () => {
    // Create a new PixiJS application
    const app = new Application();
    // Initialize the application with some options
    await app.init({
        resizeTo: window,
        backgroundAlpha: 0.5,
        backgroundColor: '1099bb',
        antialias: true,
    });

    globalThis.__PIXI_APP__ = app;
    app.canvas.style.position = 'absolute';
    // Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.canvas);
    
    // Create a bundle which contains all the images
    Assets.addBundle('reelImages', {
        hv1: '/images/hv1_symbol.png',
        hv2: '/images/hv2_symbol.png',
        hv3: '/images/hv3_symbol.png',
        hv4: '/images/hv4_symbol.png',
        lv1: '/images/lv1_symbol.png',
        lv2: '/images/lv2_symbol.png',
        lv3: '/images/lv3_symbol.png',
        lv4: '/images/lv4_symbol.png',
    });

    const reelImageAssets = await Assets.loadBundle('reelImages');

    const gameContainer = await createGameContainer(app, reelImageAssets);

    app.stage.addChild(gameContainer);
})();