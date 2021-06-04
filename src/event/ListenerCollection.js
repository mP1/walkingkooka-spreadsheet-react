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

        this.listeners.push(listener);
        return () => {
            return this.listeners.splice(this.listeners.findIndex(listener), 1);
        }
    }

    /**
     * Fires all currently registered listeners giving them the supplied value.
     */
    fire(value) {
        this.listeners.forEach(l => l(value));
    }

    listeners = [];

    toString() {
        return this.listeners.toString();
    }
}
