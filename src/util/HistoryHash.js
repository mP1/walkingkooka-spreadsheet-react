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
    const components = pathname.split("/")
        .map(s => s === "" ? undefined : s);
    const target = components[3];

    // 0 holds leading slash
    var result = {
        spreadsheetId: components[1],
        spreadsheetName: components[2],
        target: target,
    }

    switch(target) {
        case "cell":
            result = Object.assign(result, {
                cellReference: components[4],
                action: components[5],
            });
            break;
        case "name":
            result = Object.assign(result, {
                action: components[4], // only option is edit
            });
            break;
        default:
            break;
    }

    return result;
}