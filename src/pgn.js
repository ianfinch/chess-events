/**
 * Create the HTML block we need, and insert it into the DOM
 */
const create = () => {

    const pgnBlock = document.createElement("div");
    document.getElementById("pgn").appendChild(pgnBlock);
};

/**
 * Format pgn output
 */
const formatPgn = text => {

    let result = "";

    // Display any headers
    const headers = text.match(/\[[^\]]*\]/g);
    if (headers) {
        text.match(/\[[^\]]*\]/g).forEach(header => {
            result += "<div>" + header + "</div>";
        });
        text = text.replace(/^.*\]/s, "");
    }

    // Separate out the moves
    let moves = text
                .split(/([0-9][0-9]*\.)/)
                .map(x => x.split(/( |{|})/));
    moves = [].concat.apply([], moves)
                .map(x => x.trim())
                .filter(x => x);

    // Add the moves to the result
    let moveNumber = "";
    let white = true;
    let addingComment = false;
    let pending = "";
    moves.forEach(move => {

        if (pending) {
            result += pending;
            pending = "";
        }

        if (move === "}") {
            result += "</div>";
            addingComment = false;

            if (!white) {
                pending = "<div><span></span><span>...</span>";
            }
        }

        else if (move === "{") {
            result += '<div class="comment">';
            addingComment = true;
        }

        else if (addingComment) {
            result += move + " ";
        }

        else if (move.match(/[0-9][0-9]*\./)) {
            moveNumber = move;
            result += "<div><span>" + move + "</span><span>";
        }

        else if (white) {
            result += move + "</span><span>";
            white = false;
        }

        else {
            result += move + "</span></div>";
            white = true;
        }
    });

    return result;
};

/**
 * Display the game's moves
 */
const displayPgn = data => {
    const textArea = document.getElementById("pgn").getElementsByTagName("div")[0];
    textArea.innerHTML = formatPgn(data.pgn);
};

/**
 * Initialise the PGN area
 */
const init = hub => {

    create();
    const bus = hub.register("pgn");
    bus.subscribe("move-result", displayPgn);
};

export default { init };
