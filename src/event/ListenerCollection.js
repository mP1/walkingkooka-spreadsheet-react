import Preconditions from "../Preconditions.js";

/**
 * A verify simple collection that supports attaching more than one listener which are all fired when the #fire
 * method is called.
 */
export default class ListenerCollection {

    /**
     * Adds a new listener, the function returned may be used to remove the listener from all future event fires.
     */
    add(listener) {
        Preconditions.requireFunction(listener, "listener");

        const listeners = this.listeners;
        listeners.push(listener);

        return () => {
            const index = listeners.indexOf(listener);
            if(-1 !== index){
                listeners.splice(index, 1);
            }
        };
    }

    /**
     * Fires all currently registered listeners giving them the supplied params.
     * Note if any individual listener fired error, that is caught and logged and the remaining listeners fired.
     */
    fire() {
        this.listeners.forEach(
            l => {
                try {
                    l.apply(this, arguments);
                } catch(e) {
                    console.log("fired listener " + (l.name && "") + " threw error", e);
                }
            }
        );
    }

    listeners = [];

    toString() {
        return this.listeners.toString();
    }
}
