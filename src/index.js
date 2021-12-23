import board from "./chessboard.js";
import engine from "./engine.js";
import hub from "@guzo/pubsubhub";
import modal from "@guzo/modal";

/**
 * Set up the components and the pub/sub ecosystem, after everything has loaded
 */
window.addEventListener("load", () => {

    hub.log(true);
    [ board, engine, modal ].forEach(service => service.init(hub));

    const index = hub.register("index");
});
