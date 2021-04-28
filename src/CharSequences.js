/**
 * A variety of general purpose text functions
 */
import Character from "./Character.js";

function escapeText(text) {
    var s = "";

    const length = text.length;
    for(var i = 0; i < length; i++) {
        const c = text.charAt(i);

        let toString = "";
        switch(c) {
            case '\0':
                toString = "\\0";
                break;
            case '\n':
                toString = "\\n";
                break;
            case '\r':
                toString = "\\r";
                break;
            case '\t':
                toString = "\\t";
                break;
            case '\'':
                toString = "\\'";
                break;
            case '"':
                toString = "\\\"";
                break;
            default:
                const code = c.charCodeAt(0);
                toString = code < 32 ?
                    ("\\u0000" + code).substring(0, 6) :
                    c;
                break;
        }

        s = s + toString;
    }
    return s;
}

export default class CharSequences {

    /**
     * Escapes the given text
     */
    static escape(text) {
        return null == text ?
            "null" :
            escapeText(text.toString());
    }

    static quoteAndEscape(text) {
        return null == text ?
            "null" :
            text instanceof Character ?
                '\'' + escapeText(text.toString()) + '\'' :
                '"' + escapeText(text.toString()) + '"';
    }
}
