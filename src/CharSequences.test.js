import Character from "./Character.js";
import CharSequences from "./CharSequences.js";


// toCssValue...........................................................................................................

function testEscape(title, text, escaped) {
    test("Escape " + title, () => {
        expect(
            CharSequences.escape(text)
        ).toStrictEqual(escaped);
    });
}

testEscape("null", null, "null");
testEscape("empty string", "", "");
testEscape("nul char", "\0", "\\0");
testEscape("tab", "\t", "\\t");
testEscape("CR", "\r", "\\r");
testEscape("NL", "\n", "\\n");
testEscape("QUOTE", "'", "\\'");
testEscape("DBL QUOTE", "\"", "\\\"");
testEscape("space", " ", " ");
testEscape("1", "1", "1");
testEscape("A", "A", "A");
testEscape("a", "a", "a");
testEscape("escaping not required", "abc123", "abc123");
testEscape("includes tab", "abc\t123", "abc\\t123");
testEscape("includes quote and double quote", "'abc\"123", "\\'abc\\\"123");
testEscape("Character", Character.fromJson("a"), "a");