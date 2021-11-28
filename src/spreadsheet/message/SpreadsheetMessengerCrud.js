import HttpMethod from "../../net/HttpMethod.js";
import ListenerCollection from "../../event/ListenerCollection.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetMessenger from "./SpreadsheetMessenger.js";

/**
 * A wrapper around SpreadsheetMessenger that adds support for the basic CRUD operations and firing
 * the listeners upon success. The url function receives the method and id and must return the target url for the
 * operation.
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
    get(id, queryParameters, failure) {
        Preconditions.requireNonNull(id, "id");
        Preconditions.requireObject(queryParameters, "queryParameters");

        this.send(
            this.url(HttpMethod.GET, id, queryParameters),
            {
                method: HttpMethod.GET.toString(),
            },
            id,
            null,
            failure,
        );
    }

    /**
     * Accepts an id & value and saves (POST) the value notifying the listeners on success.
     */
    post(id, value, failure) {
        Preconditions.requireNonNull(value, "value");

        this.send(
            this.url(HttpMethod.POST, id, {}),
            {
                method: HttpMethod.POST.toString(),
                body: value.toJson ? JSON.stringify(value.toJson()) : value.toString(),
            },
            id,
            value,
            failure
        );
    }

    /**
     * Accepts an id & value and patches (PATCH) the value notifying the listeners on success.
     */
    patch(id, value, failure) {
        Preconditions.requireNonNull(value, "value");

        this.send(
            this.url(HttpMethod.PATCH, id, {}),
            {
                method: HttpMethod.PATCH.toString(),
                body: value.toJson ? JSON.stringify(value.toJson()) : value.toString(),
            },
            id,
            value,
            failure
        );
    }
    
    /**
     * Accepts an id and deletes (DELETE) the value notifying the listeners on success.
     */
    delete(id, failure) {
        Preconditions.requireNonNull(id, "id");

        this.send(
            this.url(HttpMethod.DELETE, id, {}),
            {
                method: HttpMethod.DELETE.toString(),
            },
            id,
            null,
            failure
        );
    }

    /**
     * Shared method by all public methods: get, post, delete, preparing and calling the messenger.
     */
    send(url, parameters, id, requestValue, failure) {
        const method = parameters.method;

        this.messenger.send(
            url,
            parameters,
            (json) => this.fireResponse(method, id, url, requestValue, json),
            failure,
        );
    }

    fireResponse(method, id, url, requestValue, responseJson) {
        const responseValue = null != responseJson ? this.unmarshall(responseJson) : null;
        this.listeners.fire(method, id, url, requestValue, responseValue);
    }

    addListener(listener) {
        return this.listeners.add(listener);
    }

    toString() {
        return this.listeners.toString();
    }
}