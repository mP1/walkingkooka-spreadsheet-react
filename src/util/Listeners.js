function check(listener) {
    if (!listener) {
        throw new Error("Missing listener");
    }
    if (typeof listener != 'function') {
        throw new Error("Expected function listener got " + listener);
    }
}

/**
 * A collection of listeners.
 */
export default class Listeners {

    add(listener) {
        check(listener);
        this.listeners.push(listener);
    }

    remove(listener) {
        check(listener);
        const index = this.listeners.indexOf(listener);
        if (-1 !== index) {
            this.listeners.splice(index, 1);
        }
    }

    dispatch(value) {
        if (!value) {
            throw new Error("Event value missing");
        }
        this.listeners.forEach(l => l(value));
    }

    listeners = [];

    toString() {
        return this.listeners.toString();
    }
}

