export default class HistoryHash {

    /**
     * Parses the components within the given pathname without verifying whether they are actually valid.
     */
    static parse(pathname) {
        return (pathname && pathname.startsWith("/") && parse0(pathname)) || {};
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

function parse0(pathname) {
    // turn empty string tokens into undefined
    // eslint-disable-next-line no-unused-vars
    const [slash, spreadsheetId, spreadsheetName, cellReference, action] = pathname.split("/")
        .map(s => s === "" ? undefined : s);
    return {
        spreadsheetId: spreadsheetId,
        spreadsheetName: spreadsheetName,
        cellReference: cellReference,
        action: action,
    }
}