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

    constructor() {
        this.onMessage.bind();
    }

    /**
     * To enable offline mode pass the webworker, to make calls to a real server using fetch pass null.
     */
    setWebWorker(webworker) {
        if(webworker) {
            this.webworker = webworker;
            this.addMessagingSupport();
        } else {
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

    send(url, parameters, response, error) {
        if (!url) {
            throw new Error("Missing url");
        }
        if (typeof url !== "string") {
            throw new Error("Expected String url got " + url);
        }
        if (!parameters) {
            throw new Error("Missing parameters");
        }
        if (typeof parameters !== "object") {
            throw new Error("Expected object parameters got " + parameters);
        }
        if (!response) {
            throw new Error("Missing response");
        }
        if (typeof response !== "function") {
            throw new Error("Expected function response got " + response);
        }
        if (!error) {
            throw new Error("Missing error");
        }
        if (error && typeof error !== "function") {
            throw new Error("Expected function error got " + error);
        }
        const transactionIdHeader = transactionId++;
        const headers = Object.assign({
            "Accept-Charset": "UTF-8",
            "Content-Type": "application/json",
            "X-Transaction-ID": "" + transactionIdHeader,
        }, parameters.headers);

        const parametersWithDefaults = Object.assign({},
            parameters,
            {
                headers: headers
            });

        if (this.webworker) {
            this.postMessage(url, parametersWithDefaults, transactionIdHeader, response, error);
        } else {
            this.browserFetch(url, parametersWithDefaults, response, error);
        }
    }

    /**
     * Constructs a request and posts a message to the webworker. Eventually that webworker will post a response back.
     */
    postMessage(url, parameters, transactionIdHeader, response, error) {
        transactionIdToHandlers[transactionIdHeader] = {
            response: response,
            error: error,
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
    browserFetch(url, parameters, response, error) {
        console.log("browserFetch \"" + url + "\"", parameters);

        let responseBuilder = {};

        timeoutPromise(parameters.timeout || DEFAULT_TIMEOUT,
            fetch(url, parameters)
                .then(response => {
                    const statusCode = response.status;
                    const statusText = response.statusText;
                    switch (Math.floor(statusCode / 100)) {
                        case 1:
                            throw new Error("1xx " + statusCode + "=" + statusText);
                        case 2:
                            if(204 === statusCode) {
                                const components = statusText.split(" ");
                                if(components.length < 3) {
                                    throw new Error(statusCode + "=" + statusText);
                                }
                                // eslint-disable-next-line no-unused-vars
                                const [method, type, actualMessage] = components; // lgtm [js/unused-local-variable]
                                throw new Error("Unknown " + type + " in " + url);
                            }
                            responseBuilder.statusCode = statusCode;
                            responseBuilder.statusText = statusText;
                            responseBuilder.headers = response.headers;

                            return response.json();
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
                    console.log("response " + responseBuilder.statusCode + " " + responseBuilder.statusText, json)
                    response(json);
                })
                .catch((e) => {
                    error("fetch failed, using " + url + " with " + JSON.stringify(parameters) + "\n" + e);
                }));
    }

    /**
     * Receives a message back from the webworker, uses the transaction id header to locate the previously saved handlers and then dispatches.
     */
    // TODO add timeout support & cleanup
    onMessage(response) {
        const body = response.data;

        const transactionId = response.headers.get(TRANSACTION_ID_HEADER);
        if(transactionId) {
            const handlers = this.transactionIdToHandlers[transactionId];
            if(handlers) {
                delete this.transactionIdToHandlers[transactionId];

                handlers.response(body);
            } else {
                error("missing handler for " + TRANSACTION_ID_HEADER + "e\n" + JSON.stringify(response));
            }
        } else {
            error("response missing " + TRANSACTION_ID_HEADER + "e\n" + JSON.stringify(response));
        }
    }
}

function error(string) {
    alert(string);
}