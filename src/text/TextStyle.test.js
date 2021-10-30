import BorderStyle from "./BorderStyle.js";
import BorderCollapse from "./BorderCollapse.js";
import Color from "../color/Color.js";
import Direction from "./Direction.js";
import FontFamily from "./FontFamily.js";
import FontKerning from "./FontKerning.js";
import FontSize from "./FontSize.js";
import FontStretch from "./FontStretch.js";
import FontStyle from "./FontStyle.js";
import FontVariant from "./FontVariant.js";
import FontWeight from "./FontWeight.js";
import HangingPunctuation from "./HangingPunctuation.js";
import Hyphens from "./Hyphens.js";
import lengthFromJson from "./LengthFromJson.js";
import ListStylePosition from "./ListStylePosition.js";
import ListStyleType from "./ListStyleType.js";
import NoneLength from "./NoneLength.js";
import OutlineStyle from "./OutlineStyle.js";
import Overflow from "./Overflow.js";
import PixelLength from "./PixelLength";
import TextAlign from "./TextAlign.js";
import TextDecorationLine from "./TextDecorationLine.js";
import TextDecorationStyle from "./TextDecorationStyle.js";
import TextJustify from "./TextJustify.js";
import TextStyle from "./TextStyle";
import TextTransform from "./TextTransform.js";
import TextWhitespace from "./TextWhitespace.js";
import TextWrapping from "./TextWrapping.js";
import VerticalAlign from "./VerticalAlign.js";
import Visibility from "./Visibility.js";
import WordBreak from "./WordBreak.js";
import WordWrap from "./WordWrap.js";
import WritingMode from "./WritingMode.js";

const COLOR1 = Color.parse("#123456");
const COLOR2 = Color.parse("#456789");
const COLOR3 = Color.parse("#abcdef");

const NONE = NoneLength.INSTANCE;
const PIXELS10 = lengthFromJson("10px");
const PIXELS20 = lengthFromJson("20px");
const PIXELS30 = lengthFromJson("30px");

function textStyle() {
    return TextStyle.fromJson({
        "background-color": COLOR1.toJson(),
        "color": COLOR3.toJson(),
    });
}

// properties...........................................................................................................

test("properties()", () => {
    const missing = TextStyle.properties()
        .concat("Unknown123")
        .filter(property => {
            var filter = false;

            try {
                TextStyle.EMPTY.get(property)
            } catch(e) {
                filter = true;
            }

            return filter;
        });

    expect(missing).toStrictEqual(["Unknown123"]);
});

test("isProperty() false", () => {
    expect(TextStyle.isProperty("UnknownProperty")).toBeFalse();
});

test("isProperty() true", () => {
    TextStyle.properties()
        .forEach(p => {
            expect(TextStyle.isProperty(p)).toBeTrue();
        });
});

// create...............................................................................................................

test("create without text fails", () => {
    expect(() => new TextStyle(null)).toThrow("Missing properties");
});

test("create with non string fails", () => {
    expect(() => new TextStyle(1.5)).toThrow("Expected object properties got 1.5");
});

test("EMPTY", () => {
    const textStyle = TextStyle.EMPTY;
    checkJson(textStyle, {});
});

test("create", () => {
    const textStyle = TextStyle.EMPTY;
    checkJson(textStyle, {});
});

// get..................................................................................................................

test("get property present without defaults", () => {
    const property = TextStyle.COLOR;
    const value = COLOR1;

    const style = new TextStyle({"color": value});
    expect(style.get(property)).toEqual(value);
})

test("get property missing", () => {
    const style = new TextStyle({});
    expect(style.get(TextStyle.COLOR)).toBeUndefined();
})

// set..................................................................................................................

test("set property null fails", () => {
    expect(() => TextStyle.EMPTY.set(null, "1234")).toThrow("Missing property");
})

test("set value null fail", () => {
    expect(() => TextStyle.EMPTY.set(TextStyle.COLOR, null)).toThrow("Property \"color\" missing value");
})

test("set invalid value fail", () => {
    expect(() => TextStyle.EMPTY.set(TextStyle.COLOR, 123)).toThrow("Expected Color property \"color\" got 123");
});

test("set property same", () => {
    const value = COLOR1;
    const style = new TextStyle({"color": value});
    expect(style).toEqual(style.set(TextStyle.COLOR, value));
})

test("set property replace different value", () => {
    const value = COLOR1;
    const style = new TextStyle({"color": value});

    const differentPropertyValue = COLOR2;
    const differentMetadata = style.set(TextStyle.COLOR, differentPropertyValue);

    expect(style).not.toEqual(differentMetadata);

    checkJson(style, {
        "color": value.toJson()
    });
    checkJson(differentMetadata,
        {
            "color": differentPropertyValue.toJson()
        });
})

test("set property different", () => {
    const value = COLOR1;
    const style = new TextStyle({"background-color": value});

    const value2 = COLOR2;
    const style2 = style.set(TextStyle.COLOR, value2);

    expect(style).not.toEqual(style2);

    checkJson(style,
        {
            "background-color": value.toJson()
        });
    checkJson(style2,
        {
            "background-color": value.toJson(),
            "color": value2.toJson()
        });
});

// remove...............................................................................................................

test("remove property missing fails", () => {
    expect(() => TextStyle.EMPTY.remove()).toThrow("Missing property");
});

test("remove property invalid fails", () => {
    expect(() => TextStyle.EMPTY.remove(123)).toThrow("Expected string property got 123");
});

test("remove property unknown fails", () => {
    expect(() => TextStyle.EMPTY.remove("!unknown")).toThrow("Unknown property \"!unknown\"");
});

test("remove absent property", () => {
    const style = TextStyle.EMPTY;
    expect(style).toEqual(style.remove(TextStyle.COLOR));
});

test("remove absent property #2", () => {
    const style = TextStyle.EMPTY
        .set(TextStyle.COLOR, COLOR1);
    expect(style).toEqual(style.remove(TextStyle.BACKGROUND_COLOR));
});

test("remove property", () => {
    const value = COLOR1;
    const style = TextStyle.EMPTY.set(TextStyle.COLOR, value);
    const removed = style.remove(TextStyle.COLOR);

    expect(style).not.toEqual(removed);

    checkJson(style, {
        "color": value.toJson(),
    });
    checkJson(removed,
        {});
});

test("remove property #2", () => {
    const withColor = TextStyle.EMPTY
        .set(TextStyle.COLOR, COLOR1);

    const style = withColor.set(TextStyle.BACKGROUND_COLOR, COLOR2);
    const removed = style.remove(TextStyle.BACKGROUND_COLOR);

    expect(style).not.toEqual(removed);
    expect(withColor).toEqual(removed);
});

getSetRemovePropertyTest(TextStyle.BACKGROUND_COLOR, COLOR1);

getSetRemovePropertyTest(TextStyle.BORDER_BOTTOM_COLOR, COLOR1);
getSetRemovePropertyTest(TextStyle.BORDER_BOTTOM_STYLE, BorderStyle.DASHED);
getSetRemovePropertyTest(TextStyle.BORDER_BOTTOM_WIDTH, PIXELS10);

getSetRemovePropertyTest(TextStyle.BORDER_COLLAPSE, BorderCollapse.COLLAPSE);

getSetRemovePropertyTest(TextStyle.BORDER_LEFT_COLOR, COLOR1);
getSetRemovePropertyTest(TextStyle.BORDER_LEFT_STYLE, BorderStyle.DASHED);
getSetRemovePropertyTest(TextStyle.BORDER_LEFT_WIDTH, PIXELS10);

getSetRemovePropertyTest(TextStyle.BORDER_RIGHT_COLOR, COLOR1);
getSetRemovePropertyTest(TextStyle.BORDER_RIGHT_STYLE, BorderStyle.DASHED);
getSetRemovePropertyTest(TextStyle.BORDER_RIGHT_WIDTH, PIXELS10);

getSetRemovePropertyTest(TextStyle.BORDER_SPACING, PIXELS10);

getSetRemovePropertyTest(TextStyle.BORDER_TOP_COLOR, COLOR1);
getSetRemovePropertyTest(TextStyle.BORDER_TOP_STYLE, BorderStyle.DASHED);
getSetRemovePropertyTest(TextStyle.BORDER_TOP_WIDTH, PIXELS10);

getSetRemovePropertyTest(TextStyle.COLOR, COLOR1);

getSetRemovePropertyTest(TextStyle.DIRECTION, Direction.RTL);

getSetRemovePropertyTest(TextStyle.FONT_FAMILY, new FontFamily("Helvetica"));
getSetRemovePropertyTest(TextStyle.FONT_KERNING, FontKerning.AUTO);
getSetRemovePropertyTest(TextStyle.FONT_SIZE, new FontSize(1));
getSetRemovePropertyTest(TextStyle.FONT_STRETCH, FontStretch.CONDENSED);
getSetRemovePropertyTest(TextStyle.FONT_STYLE, FontStyle.ITALIC);
getSetRemovePropertyTest(TextStyle.FONT_VARIANT, FontVariant.INITIAL);
getSetRemovePropertyTest(TextStyle.FONT_WEIGHT, new FontWeight(10));

getSetRemovePropertyTest(TextStyle.HANGING_PUNCTUATION, HangingPunctuation.ALLOW_END);
getSetRemovePropertyTest(TextStyle.HEIGHT, PIXELS10);
getSetRemovePropertyTest(TextStyle.HYPHENS, Hyphens.AUTO);
getSetRemovePropertyTest(TextStyle.LETTER_SPACING, PIXELS10);
getSetRemovePropertyTest(TextStyle.LINE_HEIGHT, PIXELS10);

getSetRemovePropertyTest(TextStyle.LIST_STYLE_POSITION, ListStylePosition.INSIDE);
getSetRemovePropertyTest(TextStyle.LIST_STYLE_TYPE, ListStyleType.ARMENIAN);

getSetRemovePropertyTest(TextStyle.MARGIN_BOTTOM, PIXELS10);
getSetRemovePropertyTest(TextStyle.MARGIN_LEFT, PIXELS10);
getSetRemovePropertyTest(TextStyle.MARGIN_RIGHT, PIXELS10);
getSetRemovePropertyTest(TextStyle.MARGIN_TOP, PIXELS10);

getSetRemovePropertyTest(TextStyle.MAX_HEIGHT, PIXELS10);
getSetRemovePropertyTest(TextStyle.MAX_WIDTH, PIXELS10);
getSetRemovePropertyTest(TextStyle.MIN_HEIGHT, PIXELS10);
getSetRemovePropertyTest(TextStyle.MIN_WIDTH, PIXELS10);

getSetRemovePropertyTest(TextStyle.OPACITY, "1");

getSetRemovePropertyTest(TextStyle.OUTLINE_COLOR, COLOR1);
getSetRemovePropertyTest(TextStyle.OUTLINE_OFFSET, PIXELS10);
getSetRemovePropertyTest(TextStyle.OUTLINE_STYLE, OutlineStyle.DASHED);
getSetRemovePropertyTest(TextStyle.OUTLINE_WIDTH, PIXELS10);

getSetRemovePropertyTest(TextStyle.OVERFLOW_X, Overflow.AUTO);
getSetRemovePropertyTest(TextStyle.OVERFLOW_Y, Overflow.AUTO);

getSetRemovePropertyTest(TextStyle.OUTLINE_WIDTH, PIXELS10);

getSetRemovePropertyTest(TextStyle.PADDING_BOTTOM, PIXELS10);
getSetRemovePropertyTest(TextStyle.PADDING_LEFT, PIXELS10);
getSetRemovePropertyTest(TextStyle.PADDING_RIGHT, PIXELS10);
getSetRemovePropertyTest(TextStyle.PADDING_TOP, PIXELS10);

getSetRemovePropertyTest(TextStyle.TAB_SIZE, PIXELS10);
getSetRemovePropertyTest(TextStyle.TEXT, "Abc123");

getSetRemovePropertyTest(TextStyle.TEXT_ALIGN, TextAlign.CENTER);

getSetRemovePropertyTest(TextStyle.TEXT_DECORATION_COLOR, COLOR1);
getSetRemovePropertyTest(TextStyle.TEXT_DECORATION_LINE, TextDecorationLine.LINE_THROUGH);
getSetRemovePropertyTest(TextStyle.TEXT_DECORATION_STYLE, TextDecorationStyle.DASHED);
getSetRemovePropertyTest(TextStyle.TEXT_DECORATION_THICKNESS, PIXELS10);

getSetRemovePropertyTest(TextStyle.TEXT_INDENT, PIXELS10);
getSetRemovePropertyTest(TextStyle.TEXT_JUSTIFY, TextJustify.AUTO);
getSetRemovePropertyTest(TextStyle.TEXT_OVERFLOW, "value123");
getSetRemovePropertyTest(TextStyle.TEXT_TRANSFORM, TextTransform.CAPITALIZE);
getSetRemovePropertyTest(TextStyle.TEXT_WRAPPING, TextWrapping.CLIP);
getSetRemovePropertyTest(TextStyle.VERTICAL_ALIGN, VerticalAlign.BOTTOM);

getSetRemovePropertyTest(TextStyle.VISIBILITY, Visibility.HIDDEN);
getSetRemovePropertyTest(TextStyle.WHITE_SPACE, TextWhitespace.NORMAL);
getSetRemovePropertyTest(TextStyle.WIDTH, PIXELS10);
getSetRemovePropertyTest(TextStyle.WORD_BREAK, WordBreak.BREAK_ALL);
getSetRemovePropertyTest(TextStyle.WORD_SPACING, PIXELS10);
getSetRemovePropertyTest(TextStyle.WORD_WRAP, WordWrap.BREAK_WORD);
getSetRemovePropertyTest(TextStyle.WRITING_MODE, WritingMode.HORIZONTAL_TB);

function getSetRemovePropertyTest(property, value) {
    getPropertyTest(property, value);
    setPropertyTest(property, value);

    test("remove " + property,
        () => {
            const json = {};
            json[property] = (value.toJson && value.toJson()) || value;

            expect(TextStyle.fromJson(json)
                .remove(property)
            ).toEqual(TextStyle.EMPTY);
        }
    );
}

function getPropertyTest(property, value) {
    test("get " + property + " missing", () => {
        expect(TextStyle.EMPTY
            .get(property))
            .toBeUndefined();
    });

    test("get " + property, () => {
        const json = {};
        json[property] = (value.toJson && value.toJson()) || value;

        expect(TextStyle.fromJson(json)
            .get(property)
        ).toEqual(value);
    });
};

function setPropertyTest(property, value) {
    test("set " + property + " missing", () => {
        expect(TextStyle.EMPTY
            .get(property))
            .toBeUndefined();
    });

    test("set " + property, () => {
        const style = TextStyle.EMPTY
            .set(property, value);

        const json = {};
        json[property] = (value.toJson && value.toJson()) || value;

        expect(TextStyle.fromJson(json)
            .get(property)
        ).toEqual(value);

        expect(style.toJson()).toEqual(json);
    });
};






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
        .set(TextStyle.BACKGROUND_COLOR, COLOR1)
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
        .set("width", PIXELS10)
        .toCss())
        .toEqual({
            width: "10px",
        });
});

test("toCss width, height", () => {
    expect(TextStyle.EMPTY
        .set("width", PIXELS10)
        .set("height", PIXELS20)
        .toCss())
        .toEqual({
            width: "10px",
            height: "20px",
        });
});

test("toCss margin-left", () => {
    expect(TextStyle.EMPTY
        .set("margin-left", PIXELS10)
        .toCss())
        .toEqual({
            marginLeft: "10px",
        });
});

test("toCss border-left-width", () => {
    expect(TextStyle.EMPTY
        .set("border-left-width", PIXELS10)
        .toCss())
        .toEqual({
            borderLeftWidth: "10px",
        });
});

test("toCss Direction.LTR", () => {
    expect(TextStyle.EMPTY
        .set(TextStyle.DIRECTION, Direction.LTR)
        .toCss())
        .toEqual({
            direction: "ltr",
        });
});

test("toCss WordWrap.BREAK_NORMAL", () => {
    expect(TextStyle.EMPTY
        .set(TextStyle.WORD_WRAP, WordWrap.BREAK_WORD)
        .toCss())
        .toEqual({
            wordWrap: "break-word",
        });
});

test("toCss mixed property names", () => {
    expect(TextStyle.EMPTY
        .set("border-left-width", PIXELS10)
        .set("color", COLOR1)
        .toCss())
        .toEqual({
            borderLeftWidth: "10px",
            color: COLOR1.toJson(),
        });
});

test("toCss border-xxx-width, margin-xxx, padding-xxx none", () => {
    expect(TextStyle.EMPTY
        .set("border-left-width", NONE)
        .set("border-top-width", NONE)
        .set("border-right-width", NONE)
        .set("border-bottom-width", NONE)
        .set("margin-left", NONE)
        .set("margin-top", NONE)
        .set("margin-right", NONE)
        .set("margin-bottom", NONE)
        .set("padding-left", NONE)
        .set("padding-top", NONE)
        .set("padding-right", NONE)
        .set("padding-bottom", NONE)
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
        .set("border-left-width", NONE)
        .set("border-top-width", PIXELS10)
        .set("border-right-width", PIXELS20)
        .set("border-bottom-width", PIXELS30)
        .set("margin-left", PIXELS30)
        .set("margin-top", PIXELS20)
        .set("margin-right", PIXELS10)
        .set("margin-bottom", NONE)
        .set("padding-left", PIXELS10)
        .set("padding-top", NONE)
        .set("padding-right", PIXELS20)
        .set("padding-bottom", NONE)
        .toCss())
        .toEqual({
            borderLeftWidth: "0",
            borderTopWidth: "10px",
            borderRightWidth: "20px",
            borderBottomWidth: "30px",
            marginLeft: "30px",
            marginTop: "20px",
            marginRight: "10px",
            marginBottom: "0",
            paddingLeft: "10px",
            paddingTop: "0",
            paddingRight: "20px",
            paddingBottom: "0",
        });
});

// equals...............................................................................................................

test("equals undefined false", () => {
    const t = textStyle();
    expect(t.equals()).toBeFalse();
});

test("equals null false", () => {
    const t = textStyle();
    expect(t.equals(null)).toBeFalse();
});

test("equals self true", () => {
    const t = textStyle();
    expect(t.equals(t)).toBeTrue();
});

test("equals different false", () => {
    const t = textStyle();
    expect(t.equals(TextStyle.EMPTY.set("width", PIXELS10))).toBeFalse();
});

test("equals different false", () => {
    const t = textStyle();
    expect(t.equals(t.set("width", PIXELS10))).toBeFalse();
});

test("equals self true", () => {
    const t = textStyle();
    expect(t.equals(textStyle())).toBeTrue();
});

// toString.............................................................................................................

test("toString", () => {
    expect(TextStyle.EMPTY
        .set(TextStyle.BACKGROUND_COLOR, COLOR1)
        .toString())
        .toEqual(JSON.stringify({
            "background-color": COLOR1.toJson()
        }));
});

test("toString several properties", () => {
    expect(TextStyle.EMPTY
        .set(TextStyle.BACKGROUND_COLOR, COLOR1)
        .set(TextStyle.COLOR, COLOR3)
        .toString())
        .toEqual(JSON.stringify({
            "background-color": COLOR1.toJson(),
            "color": COLOR3.toJson()
        }));
});

// helpers..............................................................................................................

// checks toJson and toString
function checkJson(textStyle, json) {
    expect(textStyle.toJson()).toStrictEqual(json);
    expect(textStyle.toString()).toBe(JSON.stringify(json));
    expect(TextStyle.fromJson(textStyle.toJson())).toStrictEqual(textStyle);
}
