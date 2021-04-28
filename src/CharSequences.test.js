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

function testQuoteAndEscape(title, text, expected) {
    test("Quote and escape " + title, () => {
        expect(
            CharSequences.quoteAndEscape(text)
        ).toStrictEqual(expected);
    });
}

testQuoteAndEscape("null", null, "null");
testQuoteAndEscape("empty string", "", "\"\"");
testQuoteAndEscape("nul char", "\0", "\"\\0\"");
testQuoteAndEscape("tab", "\t", "\"\\t\"");
testQuoteAndEscape("CR", "\r", "\"\\r\"");
testQuoteAndEscape("NL", "\n", "\"\\n\"");
testQuoteAndEscape("QUOTE", "'", "\"\\'\"");
testQuoteAndEscape("DBL QUOTE", "\"", "\"\\\"\"");
testQuoteAndEscape("space", " ", "\" \"");
testQuoteAndEscape("1", "1", "\"1\"");
testQuoteAndEscape("A", "A", "\"A\"");
testQuoteAndEscape("a", "a", "\"a\"");
testQuoteAndEscape("escaping not required", "abc123", "\"abc123\"");
testQuoteAndEscape("includes tab", "abc\t123", "\"abc\\t123\"");
testQuoteAndEscape("includes single-quote", "abc\'123", "\"abc\\\'123\"");
testQuoteAndEscape("includes double-quote", "abc\"123", "\"abc\\\"123\"");
testQuoteAndEscape("Character 1", Character.fromJson("1"), "'1'");
testQuoteAndEscape("Character a", Character.fromJson("a"), "'a'");
testQuoteAndEscape("Character single-quote", Character.fromJson("\'"), "'\\\''");
testQuoteAndEscape("Character double-quote", Character.fromJson("\""), "'\\\"'");