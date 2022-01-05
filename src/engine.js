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
 * Make a list of captured pieces
 */
const getCapturedPieces = fen => {

    const countPieces = (result, item) => {
        if (!result[item]) {
            result[item] = 0;
        }
        result[item] = result[item] + 1;
        return result;
    };

    const countMissingPieces = pieces => {
        const fullSet = { B: 2, K: 1, N: 2, P: 8, Q: 1, R: 2, b: 2, k: 1, n: 2, p: 8, q: 1, r: 2 };

        return Object.keys(fullSet).reduce((result, key) => {
            const taken = fullSet[key] - (pieces[key] || 0);
            if (taken) {
                result.push({ piece: key, count: taken });
            }
            return result;
        }, []);
    };

    const tally = fen.split(" ")[0]
                     .replace(/[0-9/]/g, "")
                     .split("")
                     .reduce(countPieces, {});

    return countMissingPieces(tally);
};

/**
 * Make a move
 *
 * Return null if move is not valid
 */
const move = (details, bus) => {

    const result = engine.move(details);
    const fen = engine.fen();
    const payload = {
        from: details.from,
        to: details.to,
        taken: getCapturedPieces(fen),
        check: engine.in_check(),
        gameOver: gameIsOver(),
        next: engine.turn(),
        fen,
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
const reset = bus => {

    return () => {

        engine.reset();
        bus.publish("move-result", {
            from: null,
            to: null,
            taken: [],
            check: false,
            gameOver: false,
            next: engine.turn(),
            fen: engine.fen(),
            pgn: engine.pgn(),
            status: true
        });
    };
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
    bus.subscribe("new-game", reset(bus), 0);
    bus.subscribe("validate-move", details => move(details, bus));
};

export default { init };
