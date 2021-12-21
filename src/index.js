import hub from "@guzo/pubsubhub";
import modal from "@guzo/modal";

/**
 * Set up the components and the pub/sub ecosystem, after everything has loaded
 */
window.addEventListener("load", () => {

    hub.log(true);
    modal.init(hub);
    const index = hub.register("index");

    index.subscribe("modal-closed", result => {
        if (result.ref === "alert-1") {
            index.publish("options", {
                header: "Select One",
                options: [ "Option #1", "Option #2", "Option #3" ],
                ref: "options-1"
            });
        } else {
            console.info(result);
        }
    });

    index.publish("alert", { header: "Important", msg: "Test message", ref: "alert-1" });
});
