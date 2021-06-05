import ListenerCollection from "../../event/ListenerCollection.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetMessenger from "./SpreadsheetMessenger.js";

/**
 * A wrapper around SpreadsheetMessenger that adds support for the basic CRUD operations and firing
 * the listeners upon success.
 */
export default class SpreadsheetMessengerCrud {

    constructor(url,
                messenger,
                unmarshall,
                listeners
    ) {
        Preconditions.requireFunction(url, "url");
        Preconditions.requireInstance(messenger, SpreadsheetMessenger, "messenger");
        Preconditions.requireFunction(unmarshall, "unmarshall");
        Preconditions.requireInstance(listeners, ListenerCollection, "listeners");

        this.url = url;
        this.messenger = messenger;
        this.unmarshall = unmarshall;
        this.listeners = listeners;
    }

    /**
     * Accepts an id and attemps to load the value, notifying all listeners on success.
     */
    get(id, success, failure) {
        Preconditions.requireNonNull(id, "id");

        this.send(
            id,
            {
                method: "GET",
            },
            success,
            failure,
        );
    }

    /**
     * Accepts an id & value and saves (POST) the value notifying the listeners on success.
     */
    post(id, value, success, failure) {
        Preconditions.requireNonNull(value, "value");

        this.send(
            id,
            {
                method: "POST",
                body: JSON.stringify(value.toJson()),
            },
            success,
            failure
        );
    }

    /**
     * Accepts an id and deletes (DELETE) the value notifying the listeners on success.
     */
    delete(id, success, failure) {
        Preconditions.requireNonNull(id, "id");

        this.send(
            id,
            {
                method: "DELETE",
            },
            success,
            failure
        );
    }

    /**
     * Shared method by all public methods: get, post, delete, preparing and calling the messenger.
     */
    send(id, parameters, success, failure) {
        this.messenger.send(
            this.url(id),
            parameters,
            (json) => {
                const value = null != json ? this.unmarshall(json) : null;
                success(id, value);
                this.listeners.fire(parameters.method, id, value);
            },
            (e) => {
                failure(e);
            },
        );
    }

    addListener(listener) {
        return this.listeners.add(listener);
    }

    toString() {
        return this.listeners.toString();
    }
}