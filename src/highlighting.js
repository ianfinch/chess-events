/**
 * Clear any existing highlights
 */
const clear = () => {

    [
        "possible-move",
        "possible-capture",
        "check",
        "last-move-from",
        "last-move-to"
    ].forEach(className => {

        [...document.getElementsByClassName(className)].forEach(elem => {
            elem.classList.remove(className);
        });
    });
};

/**
 * Indicate that a king is in check
 */
const showCheck = player => {

    // Filter down our pieces to identify just the king
    const squares = [...document.getElementsByTagName("img")].filter(elem => {

        // Find which of the pieces is the player in check's king
        const attrs = [...elem.attributes].map(attr => {

            if (attr.nodeName === "data-piece") {
                return attr.nodeValue;
            }

            return null;

        }).filter(x => x);

        // Only retain this if it's the king
        if (attrs.includes(player + "K")) {
            return true;
        }

        // Otherwise we discard it
        return false;
    });

    // Assume that we will always have a king in play, so take the first of the
    // matching squares
    const kingSquare = squares[0].parentNode;

    // Now add the class to show it's in check
    kingSquare.classList.add("check");
};

/**
 * Highlight the squares a piece has moved from and to
 */
const highlightMove = move => {

    if (move.status === true) {

        clear();

        document.getElementsByClassName("square-" + move.from)[0].classList.add("last-move-from");
        document.getElementsByClassName("square-" + move.to)[0].classList.add("last-move-to");

        if (move.check) {
            showCheck(move.next);
        }
    }
};

/**
 * Show which moves the player can make
 */
const showPossibleMoves = data => {

    data.moves.forEach(move => {

        const target = "square-" + move.to;
        const elem = document.getElementsByClassName(target)[0];

        if (move.flags.includes("c") || move.flags.includes("e")) {
            elem.classList.add("possible-capture");
        } else {
            elem.classList.add("possible-move");
        }
    });
};

/**
 * Clear any displayed moves
 */
const hideMoves = () => {

    [
        "possible-move",
        "possible-capture"
    ].forEach(className => {

        [...document.getElementsByClassName(className)].forEach(elem => {
            elem.classList.remove(className);
        });
    });
};

/**
 * Initialise the hub so we can receive highlighting requests
 */
const init = hub => {

    const bus = hub.register("highlighting");
    bus.subscribe("hover-end", hideMoves);
    bus.subscribe("move-result", highlightMove);
    bus.subscribe("possible-moves", showPossibleMoves);
};

export default { init };
