import Preconditions from "../../Preconditions.js";
import timeoutPromise from "./FetchTimeoutPromise.js";

// default timeout if timeout property in parameters is missing
const DEFAULT_TIMEOUT = 30 * 1000;

/**
 * Request/response fetch/message header
 */
const TRANSACTION_ID_HEADER = "X-Transaction-ID";

/**
 * Allocates a new unique id for each request/message and is used by WebWorkers to match responses to request.
 */
var transactionId = 0;

/**
 * Hash of transaction ids holding the response/error
 */
var transactionIdToHandlers = {};

/**
 * The preferred way to make requests to a server. This class supports talking to a real server using fetch(HTTP) or a webworker using messages.
 */
export default class SpreadsheetMessenger {

    constructor(error) {
        this.onMessage.bind();
        this.error = error;
    }

    /**
     * To enable offline mode pass the webworker, to make calls to a real server using fetch pass null.
     */
    setWebWorker(webworker) {
        if(webworker){
            this.webworker = webworker;
            this.addMessagingSupport();
        }else {
            this.removeMessagingSupport();
            this.webworker = webworker;
        }
    }

    addMessagingSupport() {
        this.webworker.addEventListener('message', this.onMessage);
    }

    removeMessagingSupport() {
        this.webworker && this.webworker.removeEventListener('message', this.onMessage);
    }

    send(url, parameters, success, failure) {
        Preconditions.requireNonEmptyText(url, "url");
        Preconditions.requireObject(parameters, "parameters");
        Preconditions.requireFunction(success, "success");
        Preconditions.requireFunction(failure, "failure");

        const transactionIdHeader = transactionId++;
        const headers = Object.assign({
            "Accept": "application/json",
            "Accept-Charset": "UTF-8",
            "Content-Type": "application/json;charset=UTF-8",
            "X-Transaction-ID": "" + transactionIdHeader,
        }, parameters.headers);

        const parametersWithDefaults = Object.assign({},
            parameters,
            {
                headers: headers
            });

        if(this.webworker){
            this.postMessage(url, parametersWithDefaults, transactionIdHeader, success, failure);
        }else {
            this.browserFetch(url, parametersWithDefaults, success, failure);
        }
    }

    /**
     * Constructs a request and posts a message to the webworker. Eventually that webworker will post a response back.
     */
    postMessage(url, parameters, transactionIdHeader, success, failure) {
        transactionIdToHandlers[transactionIdHeader] = {
            success: success,
            failure: failure,
        };

        this.webworker.postMessage({
            version: "HTTP/1.0",
            method: parameters.methods,
            url: url,
            headers: parameters.headers,
            body: parameters.body,
        });
    }

    /**
     * Uses the browser's fetch object to make a request to a server.
     */
    browserFetch(url, parameters, success, failure) {
        console.log("browserFetch \"" + url + "\"", parameters);

        let response = {};

        timeoutPromise(parameters.timeout || DEFAULT_TIMEOUT,
            fetch(url, parameters)
                .then(resp => {
                    const statusCode = resp.status;
                    const statusText = resp.statusText;
                    switch(Math.floor(statusCode / 100)) {
                        case 1:
                            throw new Error("1xx " + statusCode + "=" + statusText);
                        case 2:
                            response.statusCode = statusCode;
                            response.statusText = statusText;
                            response.headers = resp.headers;
                            return 204 === statusCode ?
                                Promise.resolve(null) :
                                resp.json();
                        case 3:
                            throw new Error("Redirect " + statusCode + "=" + statusText);
                        case 4:
                            throw new Error("Bad request " + statusCode + "=" + statusText);
                        case 5:
                            throw new Error("Server error " + statusCode + "=" + statusText);
                        default:
                            throw new Error("Misc error: " + statusCode + "=" + statusText);
                    }
                })
                .then(json => {
                    console.log("response " + response.statusCode + " " + response.statusText, json)
                    success(json);
                })
                .catch((e) => {
                    failure("fetch failed, using " + url + " with " + JSON.stringify(parameters) + "\n" + e, e);
                }));
    }

    /**
     * Receives a message back from the webworker, uses the transaction id header to locate the previously saved handlers and then dispatches.
     */
    // TODO add timeout support & cleanup
    onMessage(response) {
        const body = response.data;

        const transactionId = response.headers.get(TRANSACTION_ID_HEADER);
        if(transactionId){
            const handlers = this.transactionIdToHandlers[transactionId];
            if(handlers){
                delete this.transactionIdToHandlers[transactionId];

                handlers.success(body);
            }else {
                this.error("missing handler for " + TRANSACTION_ID_HEADER + "\n" + JSON.stringify(response));
            }
        }else {
            this.error("response missing " + TRANSACTION_ID_HEADER + "\n" + JSON.stringify(response));
        }
    }
}