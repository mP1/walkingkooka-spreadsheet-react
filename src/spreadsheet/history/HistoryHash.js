export default class HistoryHash {

    /**
     * Tokenizes the pathname into components, no attempt is made to validate any individual token.
     */
    static tokenize(pathname) {
        return pathname && pathname.startsWith("/") ?
            split(pathname) :
            [];
    }
    static join(tokens) {
        if (!tokens) {
            throw new Error("Missing tokens");
        }
        var s = "";
        for(var i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            // stop joining if a undefined/null token is found.
            if (!token && token !== "") {
                break;
            }
            s = s + "/" + token;
        }

        return s === "" ? "/" : s;
    }
}

function split(pathname) {
    const components = pathname.split("/");
    components.shift();
    return components;
}