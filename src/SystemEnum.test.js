import TextAlign from "./text/TextAlign.js";
import WordBreak from "./text/WordBreak.js";

// toCssValue...........................................................................................................

test("toCssValue LEFT", () => {
    expect(
        TextAlign.LEFT.toCssValue()
    ).toStrictEqual("left");
});

test("toCssValue BREAK_WORD", () => {
    expect(
        WordBreak.BREAK_WORD.toCssValue()
    ).toStrictEqual("break-word");
});
