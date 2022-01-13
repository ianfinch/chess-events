/**
 * Create the HTML block we need, and insert it into the DOM
 */
const create = () => {

    const playersBlock = document.createElement("div");

    [ "w", "b" ].forEach((player, index) => {

        const block = document.createElement("div");
        block.classList.add("player");

        const icon = document.createElement("img");
        icon.setAttribute("src", "images/" + player + "K.svg");
        block.appendChild(icon);

        const name = document.createElement("span");
        name.textContent = "Player #" + (index + 1);
        block.appendChild(name);

        playersBlock.append(block);

        const taken = document.createElement("div");
        taken.setAttribute("id", "taken-by-" + player);
        playersBlock.append(taken);
    });

    document.getElementById("players").appendChild(playersBlock);
};

/**
 * When a move is made, highlight the next player to make a move
 */
const highlightNextPlayer = data => {

    // Remove old highlight
    [...document.getElementsByClassName("next")].forEach(elem => {
        elem.classList.remove("next");
    });

    // Highlight the current player
    const playerElems = document.getElementById("players").childNodes[0].childNodes;
    [...playerElems].forEach(elem => {

        if (elem.classList.contains("player")) {

            const img = [...elem.childNodes].filter(x => x.nodeName === "IMG")[0];
            const src = [...img.attributes].filter(x => x.nodeName === "src")[0];

            if (src.nodeValue === "images/" + data.next + "K.svg") {
                elem.classList.add("next");
            }
        }
    });

    // Update the captured pieces
    displayCapturedPieces(data.taken);
};

/**
 * Display the captured pieces
 */
const displayCapturedPieces = captured => {

    const pieces = {
        B: { player: "white", alt: "white bishop", src: "images/wB.svg", value: -3    },
        K: { player: "white", alt: "white king",   src: "images/wK.svg", value: -1000 },
        N: { player: "white", alt: "white knight", src: "images/wN.svg", value: -3    },
        P: { player: "white", alt: "white pawn",   src: "images/wP.svg", value: -1    },
        Q: { player: "white", alt: "white queen",  src: "images/wQ.svg", value: -9    },
        R: { player: "white", alt: "white rook",   src: "images/wR.svg", value: -5    },
        b: { player: "black", alt: "black bishop", src: "images/bB.svg", value: 3     },
        k: { player: "black", alt: "black king",   src: "images/bK.svg", value: 1000  },
        n: { player: "black", alt: "black knight", src: "images/bN.svg", value: 3     },
        p: { player: "black", alt: "black pawn",   src: "images/bP.svg", value: 1     },
        q: { player: "black", alt: "black queen",  src: "images/bQ.svg", value: 9     },
        r: { player: "black", alt: "black rook",   src: "images/bR.svg", value: 5     }
    };

    const createImage = piece => {

        const img = document.createElement("img");
        const alt = document.createAttribute("alt");
        const src = document.createAttribute("src");

        alt.value = piece.alt;
        src.value = piece.src;

        img.attributes.setNamedItem(alt);
        img.attributes.setNamedItem(src);

        return img;
    };

    const createBalance = value => {

        const span = document.createElement("span");
        span.textContent = "+" + value;
        return span;
    };

    let takenWhite = document.getElementById("taken-by-b");
    let takenBlack = document.getElementById("taken-by-w");

    // Clear the existing display
    takenWhite.replaceChildren();
    takenBlack.replaceChildren();

    // Add each captured piece
    let balance = 0;
    captured.forEach(taken => {

        if (pieces[taken.piece].player === "white") {
            for (let i = 0; i < taken.count; i++) {
                takenWhite.appendChild(createImage(pieces[taken.piece]));
                balance = balance + pieces[taken.piece].value;
            }
        } else {
            for (let i = 0; i < taken.count; i++) {
                takenBlack.appendChild(createImage(pieces[taken.piece]));
                balance = balance + pieces[taken.piece].value;
            }
        }
    });

    // Indicate whether either player is up on captured pieces
    if (balance < 0) {
        takenWhite.appendChild(createBalance(-1 * balance));

    } else if (balance > 0) {
        takenBlack.appendChild(createBalance(balance));
    }
};

/**
 * Initialise the players HTML and subscriptions
 */
const init = hub => {

    create();
    const bus = hub.register("players");
    bus.subscribe("move-result", highlightNextPlayer, 0);
};

export default { init };
