import TextStyle from "./TextStyle";
import PixelLength from "./PixelLength";

const BACKGROUND_COLOR = "background-color";
const BACKGROUND_COLOR_VALUE = "#123";
const BACKGROUND_COLOR_VALUE2 = "#456";

const COLOR = "color";
const COLOR_VALUE = "#789";

test("create without text fails", () => {
    expect(() => new TextStyle(null)).toThrow("Missing styles");
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

// width................................................................................................................

test("width missing", () => {
    expect(TextStyle.EMPTY.width()).toBeUndefined();
});

test("width pixel value", () => {
    expect(TextStyle.fromJson({
        "width": "123px"
    }).width()).toStrictEqual(new PixelLength(123.0));
});

// height................................................................................................................

test("height missing", () => {
    expect(TextStyle.EMPTY.height()).toBeUndefined();
});

test("height pixel value", () => {
    expect(TextStyle.fromJson({
        "height": "123px"
    }).height()).toStrictEqual(new PixelLength(123.0));
});

// merge................................................................................................................

test("merge TextStyle missing", () => {
    expect(() => TextStyle.EMPTY.merge()).toThrow("Missing style");
});

test("merge invalid fails", () => {
    expect(() => TextStyle.EMPTY.merge("!invalid")).toThrow("Expected TextStyle style got !invalid");
});

test("merge with empty", () => {
    const style = TextStyle.fromJson({
        "width": "10px",
    });

    const after = style.merge(TextStyle.EMPTY);
    expect(style === after).toStrictEqual(true);
});

test("merge empty with non empty", () => {
    const style = TextStyle.fromJson({
        "width": "10px",
    });

    const after = TextStyle.EMPTY.merge(style);
    expect(style === after).toStrictEqual(true);
});

test("merge non empty", () => {
    const width = TextStyle.fromJson({
        "width": "10px",
    });
    const height = TextStyle.fromJson({
        "height": "20px",
    });
    expect(width.merge(height)).toStrictEqual(TextStyle.fromJson({
        "width": "10px",
        "height": "20px",
    }));
});

test("merge replace", () => {
    const width = TextStyle.fromJson({
        "width": "10px",
        "height": "5px",
    });
    const height = TextStyle.fromJson({
        "height": "20px",
    });
    expect(width.merge(height)).toStrictEqual(TextStyle.fromJson({
        "width": "10px",
        "height": "20px",
    }));
});

// isEmpty..............................................................................................................

test("isEmpty EMPTY", () => {
    expect(TextStyle.EMPTY
        .isEmpty())
        .toEqual(true);
});

test("isEmpty not empty", () => {
    expect(TextStyle.EMPTY
        .set(BACKGROUND_COLOR, BACKGROUND_COLOR_VALUE)
        .isEmpty())
        .toEqual(false);
});

// toCss................................................................................................................

test("toCss EMPTY", () => {
    expect(TextStyle.EMPTY.toCss())
        .toEqual({});
});

test("toCss width", () => {
    expect(TextStyle.EMPTY
        .set("width", "10px")
        .toCss())
        .toEqual({
            width: "10px",
        });
});

test("toCss width, height", () => {
    expect(TextStyle.EMPTY
        .set("width", "10px")
        .set("height", "20px")
        .toCss())
        .toEqual({
            width: "10px",
            height: "20px",
        });
});

test("toCss margin-left", () => {
    expect(TextStyle.EMPTY
        .set("margin-left", "10px")
        .toCss())
        .toEqual({
            marginLeft: "10px",
        });
});

test("toCss border-left-width", () => {
    expect(TextStyle.EMPTY
        .set("border-left-width", "10px")
        .toCss())
        .toEqual({
            borderLeftWidth: "10px",
        });
});

test("toCss mixed property names", () => {
    expect(TextStyle.EMPTY
        .set("border-left-width", "10px")
        .set("color", "#123456")
        .toCss())
        .toEqual({
            borderLeftWidth: "10px",
            color: "#123456",
        });
});

test("toCss border-xxx-width, margin-xxx, padding-xxx none", () => {
    expect(TextStyle.EMPTY
        .set("border-left-width", "none")
        .set("border-top-width", "none")
        .set("border-right-width", "none")
        .set("border-bottom-width", "none")
        .set("margin-left", "none")
        .set("margin-top", "none")
        .set("margin-right", "none")
        .set("margin-bottom", "none")
        .set("padding-left", "none")
        .set("padding-top", "none")
        .set("padding-right", "none")
        .set("padding-bottom", "none")
        .toCss())
        .toEqual({
            borderLeftWidth: "0",
            borderTopWidth: "0",
            borderRightWidth: "0",
            borderBottomWidth: "0",
            marginLeft: "0",
            marginTop: "0",
            marginRight: "0",
            marginBottom: "0",
            paddingLeft: "0",
            paddingTop: "0",
            paddingRight: "0",
            paddingBottom: "0",
        });
});

test("toCss border-xxx-width, margin-xxx, padding-xxx none/mixed", () => {
    expect(TextStyle.EMPTY
        .set("border-left-width", "none")
        .set("border-top-width", "1px")
        .set("border-right-width", "2px")
        .set("border-bottom-width", "3px")
        .set("margin-left", "3px")
        .set("margin-top", "2px")
        .set("margin-right", "1px")
        .set("margin-bottom", "none")
        .set("padding-left", "1px")
        .set("padding-top", "none")
        .set("padding-right", "2px")
        .set("padding-bottom", "none")
        .toCss())
        .toEqual({
            borderLeftWidth: "0",
            borderTopWidth: "1px",
            borderRightWidth: "2px",
            borderBottomWidth: "3px",
            marginLeft: "3px",
            marginTop: "2px",
            marginRight: "1px",
            marginBottom: "0",
            paddingLeft: "1px",
            paddingTop: "0",
            paddingRight: "2px",
            paddingBottom: "0",
        });
});

// toString.............................................................................................................

test("toString", () => {
    expect(TextStyle.EMPTY
        .set(BACKGROUND_COLOR, BACKGROUND_COLOR_VALUE)
        .toString())
        .toEqual(JSON.stringify({
            "background-color": BACKGROUND_COLOR_VALUE
        }));
});

test("toString several properties", () => {
    expect(TextStyle.EMPTY
        .set(BACKGROUND_COLOR, BACKGROUND_COLOR_VALUE)
        .set(COLOR, COLOR_VALUE)
        .toString())
        .toEqual(JSON.stringify({
            "background-color": BACKGROUND_COLOR_VALUE,
            "color": COLOR_VALUE
        }));
});

// helpers..............................................................................................................

// checks toJson and toString
function checkJson(textStyle, json) {
    expect(textStyle.toJson()).toStrictEqual(json);
    expect(textStyle.toString()).toBe(JSON.stringify(json));
    expect(TextStyle.fromJson(textStyle.toJson())).toStrictEqual(textStyle);
}
