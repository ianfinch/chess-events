const Chess = require("chess.js");
const engine = new Chess();

/**
 * Check whether the game is over
 */
const gameIsOver = () => {

    const winner = engine.turn() === "w" ? "black" : "white";

    if (engine.in_checkmate()) {
        return {
            result: "checkmate",
            winner
        };
    }

    if (engine.in_draw()) {

        if (engine.insufficient_material()) {
            return {
                result: "draw due to insufficient material",
                winner
            };
        }

        if (engine.in_threefold_repetition()) {
            return {
                result: "repeated moves",
                winner
            };
        }

        return {
            result: "draw due to the fifty move rule",
            winner
        };
    }

    if (engine.in_stalemate()) {
        return {
            result: "stalemate",
            winner
        };
    }

    return false;
};

/**
 * Make a move
 *
 * Return null if move is not valid
 */
const move = (details, bus) => {

    const result = engine.move(details);
    const payload = {
        from: details.from,
        to: details.to,
        check: engine.in_check(),
        gameOver: gameIsOver(),
        next: engine.turn(),
        fen: engine.fen(),
        pgn: engine.pgn()
    };

    if (!result) {
        payload.status = false;
    } else {
        payload.status = true;
    }

    bus.publish("move-result", payload);
};

/**
 * Reset the board to the starting position
 */
const reset = () => {
    engine.reset();
};

/**
 * Find the possible moves for a given piece
 */
const findPossibleMoves = bus => {

    return ({ square, piece }) => {

        const moves = engine.moves({ square, verbose: true });
        if (moves.length) {
            bus.publish("possible-moves", { moves });
        }
    }
};

/**
 * Initialise the engine
 */
const init = hub => {

    const bus = hub.register("engine");
    bus.subscribe("hover-over", findPossibleMoves(bus));
    bus.subscribe("new-game", reset);
    bus.subscribe("validate-move", details => move(details, bus));
};

export default { init };
