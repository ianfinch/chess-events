const Chess = require("chess.js");
const engine = new Chess();

/**
 * Make a move
 *
 * Return null if move is not valid
 */
const move = (details, bus) => {

    const result = engine.move(details);

    if (!result) {
        bus.publish("move-result", { status: false, pgn: engine.pgn(), fen: engine.fen() });
    } else {
        bus.publish("move-result", { status: true, pgn: engine.pgn(), fen: engine.fen() });
    }
};

/**
 * Reset the board to the starting position
 */
const reset = () => {
    engine.reset();
};

/**
 * Initialise the engine
 */
const init = hub => {

    const bus = hub.register("engine");

    bus.subscribe("new-game", reset);
    bus.subscribe("validate-move", details => move(details, bus));
};

export default { init };
