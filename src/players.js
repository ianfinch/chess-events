/**
 * Create the HTML block we need, and insert it into the DOM
 */
const create = () => {

    const playersBlock = document.createElement("div");

    const whiteBlock = document.createElement("div");

    const whiteIcon = document.createElement("img");
    whiteIcon.setAttribute("src", "images/wK.svg");
    whiteBlock.appendChild(whiteIcon);

    const whiteName = document.createElement("span");
    whiteName.textContent = "Player #1";
    whiteBlock.appendChild(whiteName);

    playersBlock.append(whiteBlock);

    const blackBlock = document.createElement("div");

    const blackIcon = document.createElement("img");
    blackIcon.setAttribute("src", "images/bK.svg");
    blackBlock.appendChild(blackIcon);

    const blackName = document.createElement("span");
    blackName.textContent = "Player #2";
    blackBlock.appendChild(blackName);

    playersBlock.append(blackBlock);

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

        const img = [...elem.childNodes].filter(x => x.nodeName === "IMG")[0];
        const src = [...img.attributes].filter(x => x.nodeName === "src")[0];

        if (src.nodeValue === "images/" + data.next + "K.svg") {
            elem.classList.add("next");
        }

    });
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
