import ListenerCollection from "../../event/ListenerCollection.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetMessenger from "./SpreadsheetMessenger.js";

/**
 * A wrapper around SpreadsheetMessenger that adds support for the basic CRUD operations and firing
 * the listeners upon success. The url function receives the method and id and must return the target url for the
 * operation.
 */
export default class SpreadsheetMessengerCrud {

    static toQueryString(parameters) {
        Preconditions.requireObject(parameters, "parameters");

        return parameters ?
            "?" +
            (Object.keys(parameters)
                    .map(key => key + '=' + parameters[key])
                    .join('&')
            ) :
            "";
    }

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
    get(id, queryParameters, success, failure) {
        Preconditions.requireNonNull(id, "id");
        Preconditions.requireObject(queryParameters, "queryParameters");

        this.send(
            this.url("GET", id, queryParameters),
            {
                method: "GET",
            },
            id,
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
            this.url("POST", id, {}),
            {
                method: "POST",
                body: value.toJson ? JSON.stringify(value.toJson()) : value.toString(),
            },
            id,
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
            this.url("DELETE", id, {}),
            {
                method: "DELETE",
            },
            id,
            success,
            failure
        );
    }

    /**
     * Shared method by all public methods: get, post, delete, preparing and calling the messenger.
     */
    send(url, parameters, id, success, failure) {
        const method = parameters.method;

        this.messenger.send(
            url,
            parameters,
            (json) => {
                const value = null != json ? this.unmarshall(json) : null;
                success(id, value);
                this.listeners.fire(method, id, value);
            },
            failure,
        );
    }

    addListener(listener) {
        return this.listeners.add(listener);
    }

    toString() {
        return this.listeners.toString();
    }
}