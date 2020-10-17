import {fromJson, TextStyle} from "./TextStyle";

const BACKGROUND_COLOR = "background-color";
const BACKGROUND_COLOR_VALUE = "#123";
const BACKGROUND_COLOR_VALUE2 = "#456";

const COLOR = "color";
const COLOR_VALUE = "#789";

test("create without text fails", () => {
    expect(() => new TextStyle(null)).toThrow("Styles missing");
});

test("create with non string fails", () => {
    expect(() => new TextStyle(1.5)).toThrow("Styles expected object got 1.5");
});

test("EMPTY", () => {
    const textStyle = TextStyle.EMPTY;
    checkJson(textStyle, {});
});

test("create", () => {
    const textStyle = TextStyle.EMPTY;
    checkJson(textStyle, {});
});

test("get unknown property", () => {
    const empty = TextStyle.EMPTY;
    expect(empty.get(BACKGROUND_COLOR)).toBe(undefined);
});

test("set new property", () => {
    const empty = TextStyle.EMPTY;

    const withBackgroundColor = empty.set(BACKGROUND_COLOR, BACKGROUND_COLOR_VALUE);
    expect(withBackgroundColor).not.toBe(empty);

    checkJson(withBackgroundColor, {"background-color": BACKGROUND_COLOR_VALUE});
    checkJson(empty, {});
});

test("set same property", () => {
    const empty = TextStyle.EMPTY;

    const withBackgroundColor = empty.set(BACKGROUND_COLOR, BACKGROUND_COLOR_VALUE);
    expect(withBackgroundColor).not.toBe(empty);
    expect(withBackgroundColor).toBe(withBackgroundColor.set(BACKGROUND_COLOR, BACKGROUND_COLOR_VALUE));

    checkJson(withBackgroundColor, {"background-color": BACKGROUND_COLOR_VALUE});
    checkJson(empty, {});
});

test("set several properties", () => {
    const empty = TextStyle.EMPTY;

    const several = empty.set(BACKGROUND_COLOR, BACKGROUND_COLOR_VALUE)
        .set(COLOR, COLOR_VALUE);
    expect(several).not.toBe(empty);

    checkJson(several, {"background-color": BACKGROUND_COLOR_VALUE, "color": COLOR_VALUE});
    checkJson(empty, {});
});

test("replace existing property", () => {
    const empty = TextStyle.EMPTY;

    const withBackgroundColor1 = empty.set(BACKGROUND_COLOR, BACKGROUND_COLOR_VALUE);
    expect(withBackgroundColor1).not.toBe(empty);

    const withBackgroundColor2 = empty.set(BACKGROUND_COLOR, BACKGROUND_COLOR_VALUE2);
    expect(withBackgroundColor2).not.toBe(withBackgroundColor1);

    checkJson(withBackgroundColor2, {"background-color": BACKGROUND_COLOR_VALUE2});
    checkJson(withBackgroundColor1, {"background-color": BACKGROUND_COLOR_VALUE});
    checkJson(empty, {});
});

test("remove unknown", () => {
    const empty = TextStyle.EMPTY;

    const same = empty.remove(BACKGROUND_COLOR);
    expect(same).toStrictEqual(empty);

    checkJson(same, {});
    checkJson(empty, {});
});

test("remove unknown non empty", () => {
    const empty = TextStyle.EMPTY;

    const removed = empty.set(BACKGROUND_COLOR, BACKGROUND_COLOR_VALUE);
    const after = removed.remove(COLOR);
    expect(removed).toStrictEqual(after);

    checkJson(removed, {"background-color": BACKGROUND_COLOR_VALUE});
    checkJson(empty, {});
});

test("remove existing", () => {
    const empty = TextStyle.EMPTY;

    const withBackgroundColor = empty.set(BACKGROUND_COLOR, BACKGROUND_COLOR_VALUE);
    const removed = withBackgroundColor.remove(BACKGROUND_COLOR);

    checkJson(removed, {});
    checkJson(withBackgroundColor, {"background-color": BACKGROUND_COLOR_VALUE});
    checkJson(empty, {});
});

test("remove existing leaving one style", () => {
    const empty = TextStyle.EMPTY;

    const removed = empty.set(BACKGROUND_COLOR, BACKGROUND_COLOR_VALUE)
        .set(COLOR, COLOR_VALUE)
        .remove(BACKGROUND_COLOR);

    checkJson(removed, {"color": COLOR_VALUE});
    checkJson(empty, {});
});

// helpers..............................................................................................................

// checks toJson and toString
function checkJson(textStyle, json) {
    expect(textStyle.toJson()).toStrictEqual(json);
    expect(textStyle.toString()).toBe(JSON.stringify(json));
    expect(fromJson(textStyle.toJson())).toStrictEqual(textStyle);
}
