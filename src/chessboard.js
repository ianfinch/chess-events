//import highlighting from "./highlighting.js";

/**
 * Handle moving pieces, using the engine for validation
 */
const pieceMoved = board => {

    return (source, target, piece, newPos, oldPos, orientation) => {

        // First check that we are still on the board
        if (target === "offboard") {
            return "snapback";
        }

        // Do we need to promote a pawn?
        let checkForPromotion = null;
        if ((piece === "wP" && target.match(/8$/)) ||
            (piece === "bP" && target.match(/1$/))) {

            board.hub.publish("options", {
                                    header: "Promote pawn to ...",
                                    options: ["Queen", "Rook", "Knight", "Bishop"],
                                    metadata: { ref: "select-promotion", from: source, to: target }
                              });

        // If there's no promotion, just publish the move
        } else {

            // Use a timeout to allow this handler to complete before
            // publishing the message, otherwise this piece drop may display
            // after any consequences of move validation
            //
            // Need to work out how to do this properly
            setTimeout(() => board.hub.publish("validate-move", { from: source, to: target }), 50);
        }

        return true;
    };
};

/**
 * Set up our chess board
 */
const initChessBoard = () => {

    // Initialise the settings for our board
    const board = {
        widget: null,
        hub: null,
        hooks: {
            onDrop: null
        },
        settings: {
            showMoves: true
        }
    };

    // Create the board GUI
    board.widget = Chessboard("the-board", {
        draggable: true,
        dropOffBoard: "snapback",
        onDrop: pieceMoved(board),
//        onMouseoverSquare: highlighting.showMovesForPiece(board),
//        onMouseoutSquare: highlighting.hideMovesForPiece(board),
        pieceTheme: "images/{piece}.svg",
        position: "start"
    });

    // Return our board
    return board;
};

/**
 * Set up our pub/sub event handlers
 */
const setupHandlers = (board, hub) => {

    board.hub = hub.register("board");

    /**
     * Handle different actions to take from a modal dialogue
     */
    board.hub.subscribe("modal-closed", response => {

        // Handle selection of a pawn promotion
        if (response.metadata.ref === "select-promotion") {
            board.hub.publish("validate-move", {
                from: response.metadata.from,
                to: response.metadata.to,
                promotion: response.result.substr(0, 1).toLowerCase()
            });
        }
    });

    /**
     * Handle the result of move
     */
    board.hub.subscribe("move-result", response => {

        // Make sure the display matches the current state
        board.widget.position(response.fen, false);
    });
};

/**
 * Run our initialisations
 */
const init = hub => {

    const board = initChessBoard();
    setupHandlers(board, hub);
};

export default { init };
