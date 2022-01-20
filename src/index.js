import board from "./chessboard.js";
import engine from "./engine.js";
import highlighting from "./highlighting.js";
import hub from "@guzo/pubsubhub";
import modal from "@guzo/modal";
import pgn from "./pgn.js";
import players from "./players.js";

/**
 * Set up the components and the pub/sub ecosystem, after everything has loaded
 */
window.addEventListener("load", () => {

    hub.log(false);
    [ board, engine, highlighting, modal, pgn, players ].forEach(service => service.init(hub));

    const index = hub.register("index");
});
