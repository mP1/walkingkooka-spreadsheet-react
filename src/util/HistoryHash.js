export default class HistoryHash {

    /**
     * Tokenizes the pathname into components, no attempt is made to validate any individual token.
     */
    static tokenize(pathname) {
        return pathname && pathname.startsWith("/") ?
            split(pathname) :
            [];
    }

    static concat(tokens) {
        if (!tokens) {
            throw new Error("Missing tokens");
        }
        tokens.forEach(e => {
            if (!e) {
                throw new Error("Invalid tokens contains missing token " + tokens.join());
            }
        })
        return "/" + tokens.join("/");
    }
}

function split(pathname) {
    const components = pathname.split("/");
    components.shift();
    return components;
}