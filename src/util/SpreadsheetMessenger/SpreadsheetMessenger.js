import timeoutPromise from "./FetchTimeoutPromise";

// default timeout if timeout property in parameters is missing
const DEFAULT_TIMEOUT = 30 * 1000;

/**
 * The preferred way to make requests to a server. This class supports talking to a real server using fetch(HTTP) or a webworker using messages.
 */
export default class SpreadsheetMessenger {

    constructor(webworker, handlers) {
        this.webworker = webworker;
        this.handlers = handlers;

        this.onMessage.bind();
    }

    /**
     * To enable offline mode pass the webworker, to make calls to a real server using fetch pass null.
     */
    setWebWorker(webWorkerMode) {
        this.webWorkerMode = webWorkerMode;

        if(webWorkerMode) {
            this.addMessagingSupport();
        } else {
            this.removeMessagingSupport();
        }
    }

    addMessagingSupport() {
        this.webworker.addEventListener('message', this.onMessage);
    }

    removeMessagingSupport() {
        this.webworker.removeEventListener('message', this.onMessage);
    }

    send(url, parameters) {
        if (this.offline) {
            this.postMessage(url, parameters);
        } else {
            this.doFetch(url, parameters);
        }
    }

    /**
     * Constructs a request and posts a message to the webworker. Eventually that webworker will post a response back.
     */
    postMessage(url, parameters) {
        this.webworker.postMessage({
            version: "HTTP/1.0",
            method: parameters.methods,
            url: url,
            headers: parameters.headers,
            body: parameters.body,
        });
    }

    doFetch(url, parameters) {
        log("doFetch: " + url + " " + JSON.stringify(parameters));

        let responseBuilder = {};

        timeoutPromise(parameters.timeout || DEFAULT_TIMEOUT,
            fetch(url, parameters)
                .then(response => {
                    const statusCode = response.status;
                    const statusText = response.statusText;
                    switch (statusCode / 100) {
                        case 1:
                            throw new Error("1xx " + statusCode + "=" + statusText);
                        case 2:
                            responseBuilder.statusCode = statusCode;
                            responseBuilder.statusText = statusText;
                            responseBuilder.headers = response.headers;

                            return response.json()
                        case 3:
                            throw new Error("Redirect " + statusCode + "=" + statusText);
                        case 4:
                            throw new Error("Bad request " + statusCode + "=" + statusText);
                        case 5:
                            throw new Error("Server error " + statusCode + "=" + statusText);

                    }
                })
                .then(json => {
                    responseBuilder.json = json;
                    this.dispatch(responseBuilder);
                })
                .catch((e) => {
                    error("fetch failed, using " + url + " with " + JSON.stringify(parameters) + "\n" + e);
                }));
    }

    /**
     * Receives a message back from the webworker and passing the actual JSON response to dispatch for actual processing.
     */
    onMessage(response) {
        this.dispatch(response.data);
    }

    /**
     * Examines the "X-Content-Type-Name" header and dispatches to the required handler.
     */
    dispatch(response) {
        log("dispatching response: " + JSON.stringify(response));

        const body = response.json;
        const typeName = response.headers.get("X-Content-Type-Name");
        if(typeName) {
            const handler = this.handlers[typeName];
            if(handler) {
                handler(body);
            } else {
                error("response contains unknown X-Content-TypeName\n" + JSON.stringify(response));
            }
        } else {
            error("response headers missing header X-Content-TypeName\n" + JSON.stringify(response));
        }

    }
}

function error(string) {
    alert(string);
}

function log(string) {
    console.log(string);
}