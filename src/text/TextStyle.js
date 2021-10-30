/**
 * Used to create a new instance and then the given style and value.
 */
import BorderCollapse from "./BorderCollapse.js";
import BorderStyle from "./BorderStyle.js";
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
import Length from "./Length.js";
import LengthFromJson from "./LengthFromJson.js";
import ListStylePosition from "./ListStylePosition.js";
import ListStyleType from "./ListStyleType.js";
import OutlineStyle from "./OutlineStyle.js";
import Overflow from "./Overflow.js";
import PixelLength from "./PixelLength";
import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";
import TextAlign from "./TextAlign.js";
import TextDecorationLine from "./TextDecorationLine.js";
import TextDecorationStyle from "./TextDecorationStyle.js";
import TextJustify from "./TextJustify.js";
import TextTransform from "./TextTransform.js";
import TextWhitespace from "./TextWhitespace.js";
import TextWrapping from "./TextWrapping.js";
import VerticalAlign from "./VerticalAlign.js";
import Visibility from "./Visibility.js";
import WritingMode from "./WritingMode.js";
import WordWrap from "./WordWrap.js";
import WordBreak from "./WordBreak.js";

function checkProperty(property) {
    Preconditions.requireText(property, "property");

    switch(property) {
        case TextStyle.BACKGROUND_COLOR:
        case TextStyle.BORDER_BOTTOM_COLOR:
        case TextStyle.BORDER_BOTTOM_STYLE:
        case TextStyle.BORDER_BOTTOM_WIDTH:
        case TextStyle.BORDER_COLLAPSE:
        case TextStyle.BORDER_LEFT_COLOR:
        case TextStyle.BORDER_LEFT_STYLE:
        case TextStyle.BORDER_LEFT_WIDTH:
        case TextStyle.BORDER_RIGHT_COLOR:
        case TextStyle.BORDER_RIGHT_STYLE:
        case TextStyle.BORDER_RIGHT_WIDTH:
        case TextStyle.BORDER_SPACING:
        case TextStyle.BORDER_TOP_COLOR:
        case TextStyle.BORDER_TOP_STYLE:
        case TextStyle.BORDER_TOP_WIDTH:
        case TextStyle.COLOR:
        case TextStyle.DIRECTION:
        case TextStyle.FONT_FAMILY:
        case TextStyle.FONT_KERNING:
        case TextStyle.FONT_SIZE:
        case TextStyle.FONT_STRETCH:
        case TextStyle.FONT_STYLE:
        case TextStyle.FONT_VARIANT:
        case TextStyle.FONT_WEIGHT:
        case TextStyle.HANGING_PUNCTUATION:
        case TextStyle.HEIGHT:
        case TextStyle.HYPHENS:
        case TextStyle.LETTER_SPACING:
        case TextStyle.LINE_HEIGHT:
        case TextStyle.LIST_STYLE_POSITION:
        case TextStyle.LIST_STYLE_TYPE:
        case TextStyle.MARGIN_BOTTOM:
        case TextStyle.MARGIN_LEFT:
        case TextStyle.MARGIN_RIGHT:
        case TextStyle.MARGIN_TOP:
        case TextStyle.MAX_HEIGHT:
        case TextStyle.MAX_WIDTH:
        case TextStyle.MIN_HEIGHT:
        case TextStyle.MIN_WIDTH:
        case TextStyle.OPACITY:
        case TextStyle.OUTLINE_COLOR:
        case TextStyle.OUTLINE_OFFSET:
        case TextStyle.OUTLINE_STYLE:
        case TextStyle.OUTLINE_WIDTH:
        case TextStyle.OVERFLOW_X:
        case TextStyle.OVERFLOW_Y:
        case TextStyle.PADDING_BOTTOM:
        case TextStyle.PADDING_LEFT:
        case TextStyle.PADDING_RIGHT:
        case TextStyle.PADDING_TOP:
        case TextStyle.TAB_SIZE:
        case TextStyle.TEXT:
        case TextStyle.TEXT_ALIGN:
        case TextStyle.TEXT_DECORATION_COLOR:
        case TextStyle.TEXT_DECORATION_LINE:
        case TextStyle.TEXT_DECORATION_STYLE:
        case TextStyle.TEXT_DECORATION_THICKNESS:
        case TextStyle.TEXT_INDENT:
        case TextStyle.TEXT_JUSTIFY:
        case TextStyle.TEXT_OVERFLOW:
        case TextStyle.TEXT_TRANSFORM:
        case TextStyle.TEXT_WRAPPING:
        case TextStyle.VERTICAL_ALIGN:
        case TextStyle.VISIBILITY:
        case TextStyle.WHITE_SPACE:
        case TextStyle.WIDTH:
        case TextStyle.WORD_BREAK:
        case TextStyle.WORD_SPACING:
        case TextStyle.WORD_WRAP:
        case TextStyle.WRITING_MODE:
            break;
        default:
            throw new Error("Unknown property \"" + property + "\"");
    }
}

function copyAndSet(properties, property, value) {
    let copy = new TextStyle(properties);
    copy.properties[property] = value;
    return copy;
}

/**
 * Used to create a new instance and then remove the given style.
 */
function copyAndRemove(properties, property) {
    let copy = new TextStyle(properties);
    delete copy.properties[property];
    return copy;
}

const TYPE_NAME = "text-style";

/**
 * Holds many style properties and values.
 */
export default class TextStyle extends SystemObject {

    static EMPTY = new TextStyle({});

    // generated by TextStylePropertyNameConstantJavaScriptSourceTool
    static BACKGROUND_COLOR = "background-color";
    static BORDER_BOTTOM_COLOR = "border-bottom-color";
    static BORDER_BOTTOM_STYLE = "border-bottom-style";
    static BORDER_BOTTOM_WIDTH = "border-bottom-width";
    static BORDER_COLLAPSE = "border-collapse";
    static BORDER_LEFT_COLOR = "border-left-color";
    static BORDER_LEFT_STYLE = "border-left-style";
    static BORDER_LEFT_WIDTH = "border-left-width";
    static BORDER_RIGHT_COLOR = "border-right-color";
    static BORDER_RIGHT_STYLE = "border-right-style";
    static BORDER_RIGHT_WIDTH = "border-right-width";
    static BORDER_SPACING = "border-spacing";
    static BORDER_TOP_COLOR = "border-top-color";
    static BORDER_TOP_STYLE = "border-top-style";
    static BORDER_TOP_WIDTH = "border-top-width";
    static COLOR = "color";
    static DIRECTION = "direction";
    static FONT_FAMILY = "font-family";
    static FONT_KERNING = "font-kerning";
    static FONT_SIZE = "font-size";
    static FONT_STRETCH = "font-stretch";
    static FONT_STYLE = "font-style";
    static FONT_VARIANT = "font-variant";
    static FONT_WEIGHT = "font-weight";
    static HANGING_PUNCTUATION = "hanging-punctuation";
    static HEIGHT = "height";
    static HYPHENS = "hyphens";
    static LETTER_SPACING = "letter-spacing";
    static LINE_HEIGHT = "line-height";
    static LIST_STYLE_POSITION = "list-style-position";
    static LIST_STYLE_TYPE = "list-style-type";
    static MARGIN_BOTTOM = "margin-bottom";
    static MARGIN_LEFT = "margin-left";
    static MARGIN_RIGHT = "margin-right";
    static MARGIN_TOP = "margin-top";
    static MAX_HEIGHT = "max-height";
    static MAX_WIDTH = "max-width";
    static MIN_HEIGHT = "min-height";
    static MIN_WIDTH = "min-width";
    static OPACITY = "opacity";
    static OUTLINE_COLOR = "outline-color";
    static OUTLINE_OFFSET = "outline-offset";
    static OUTLINE_STYLE = "outline-style";
    static OUTLINE_WIDTH = "outline-width";
    static OVERFLOW_X = "overflow-x";
    static OVERFLOW_Y = "overflow-y";
    static PADDING_BOTTOM = "padding-bottom";
    static PADDING_LEFT = "padding-left";
    static PADDING_RIGHT = "padding-right";
    static PADDING_TOP = "padding-top";
    static TAB_SIZE = "tab-size";
    static TEXT = "text";
    static TEXT_ALIGN = "text-align";
    static TEXT_DECORATION_COLOR = "text-decoration-color";
    static TEXT_DECORATION_LINE = "text-decoration-line";
    static TEXT_DECORATION_STYLE = "text-decoration-style";
    static TEXT_DECORATION_THICKNESS = "text-decoration-thickness";
    static TEXT_INDENT = "text-indent";
    static TEXT_JUSTIFY = "text-justify";
    static TEXT_OVERFLOW = "text-overflow";
    static TEXT_TRANSFORM = "text-transform";
    static TEXT_WRAPPING = "text-wrapping";
    static VERTICAL_ALIGN = "vertical-align";
    static VISIBILITY = "visibility";
    static WHITE_SPACE = "white-space";
    static WIDTH = "width";
    static WORD_BREAK = "word-break";
    static WORD_SPACING = "word-spacing";
    static WORD_WRAP = "word-wrap";
    static WRITING_MODE = "writing-mode";

    /**
     * Returns an array of all properties.
     */
    static properties() {
        return [
            TextStyle.BACKGROUND_COLOR,
            TextStyle.BORDER_BOTTOM_COLOR,
            TextStyle.BORDER_BOTTOM_STYLE,
            TextStyle.BORDER_BOTTOM_WIDTH,
            TextStyle.BORDER_COLLAPSE,
            TextStyle.BORDER_LEFT_COLOR,
            TextStyle.BORDER_LEFT_STYLE,
            TextStyle.BORDER_LEFT_WIDTH,
            TextStyle.BORDER_RIGHT_COLOR,
            TextStyle.BORDER_RIGHT_STYLE,
            TextStyle.BORDER_RIGHT_WIDTH,
            TextStyle.BORDER_SPACING,
            TextStyle.BORDER_TOP_COLOR,
            TextStyle.BORDER_TOP_STYLE,
            TextStyle.BORDER_TOP_WIDTH,
            TextStyle.COLOR,
            TextStyle.DIRECTION,
            TextStyle.FONT_FAMILY,
            TextStyle.FONT_KERNING,
            TextStyle.FONT_SIZE,
            TextStyle.FONT_STRETCH,
            TextStyle.FONT_STYLE,
            TextStyle.FONT_VARIANT,
            TextStyle.FONT_WEIGHT,
            TextStyle.HANGING_PUNCTUATION,
            TextStyle.HEIGHT,
            TextStyle.HYPHENS,
            TextStyle.LETTER_SPACING,
            TextStyle.LINE_HEIGHT,
            TextStyle.LIST_STYLE_POSITION,
            TextStyle.LIST_STYLE_TYPE,
            TextStyle.MARGIN_BOTTOM,
            TextStyle.MARGIN_LEFT,
            TextStyle.MARGIN_RIGHT,
            TextStyle.MARGIN_TOP,
            TextStyle.MAX_HEIGHT,
            TextStyle.MAX_WIDTH,
            TextStyle.MIN_HEIGHT,
            TextStyle.MIN_WIDTH,
            TextStyle.OPACITY,
            TextStyle.OUTLINE_COLOR,
            TextStyle.OUTLINE_OFFSET,
            TextStyle.OUTLINE_STYLE,
            TextStyle.OUTLINE_WIDTH,
            TextStyle.OVERFLOW_X,
            TextStyle.OVERFLOW_Y,
            TextStyle.PADDING_BOTTOM,
            TextStyle.PADDING_LEFT,
            TextStyle.PADDING_RIGHT,
            TextStyle.PADDING_TOP,
            TextStyle.TAB_SIZE,
            TextStyle.TEXT,
            TextStyle.TEXT_ALIGN,
            TextStyle.TEXT_DECORATION_COLOR,
            TextStyle.TEXT_DECORATION_LINE,
            TextStyle.TEXT_DECORATION_STYLE,
            TextStyle.TEXT_DECORATION_THICKNESS,
            TextStyle.TEXT_INDENT,
            TextStyle.TEXT_JUSTIFY,
            TextStyle.TEXT_OVERFLOW,
            TextStyle.TEXT_TRANSFORM,
            TextStyle.TEXT_WRAPPING,
            TextStyle.VERTICAL_ALIGN,
            TextStyle.VISIBILITY,
            TextStyle.WHITE_SPACE,
            TextStyle.WIDTH,
            TextStyle.WORD_BREAK,
            TextStyle.WORD_SPACING,
            TextStyle.WORD_WRAP,
            TextStyle.WRITING_MODE,
        ];
    }

    static fromJson(json) {
        Preconditions.requireObject(json, "json");

        // check properties
        const properties = {};
        for(const [property, value] of Object.entries(json)) {
            let typed, unmarshaller;

            switch(property) {
                case TextStyle.BACKGROUND_COLOR:
                case TextStyle.BORDER_BOTTOM_COLOR:
                    unmarshaller = Color.fromJson;
                    break;
                case TextStyle.BORDER_BOTTOM_STYLE:
                    unmarshaller = BorderStyle.fromJson;
                    break;
                case TextStyle.BORDER_BOTTOM_WIDTH:
                    unmarshaller = LengthFromJson;
                    break;
                case TextStyle.BORDER_COLLAPSE:
                    unmarshaller = BorderCollapse.fromJson;
                    break;
                case TextStyle.BORDER_LEFT_COLOR:
                    unmarshaller = Color.fromJson;
                    break;
                case TextStyle.BORDER_LEFT_STYLE:
                    unmarshaller = BorderStyle.fromJson;
                    break;
                case TextStyle.BORDER_LEFT_WIDTH:
                    unmarshaller = LengthFromJson;
                    break;
                case TextStyle.BORDER_RIGHT_COLOR:
                    unmarshaller = Color.fromJson;
                    break;
                case TextStyle.BORDER_RIGHT_STYLE:
                    unmarshaller = BorderStyle.fromJson;
                    break;
                case TextStyle.BORDER_RIGHT_WIDTH:
                case TextStyle.BORDER_SPACING:
                    unmarshaller = LengthFromJson;
                    break;
                case TextStyle.BORDER_TOP_COLOR:
                    unmarshaller = Color.fromJson;
                    break;
                case TextStyle.BORDER_TOP_STYLE:
                    unmarshaller = BorderStyle.fromJson;
                    break;
                case TextStyle.BORDER_TOP_WIDTH:
                    unmarshaller = LengthFromJson;
                    break;
                case TextStyle.COLOR:
                    unmarshaller = Color.fromJson;
                    break;
                case TextStyle.DIRECTION:
                    unmarshaller = Direction.fromJson;
                    break;
                case TextStyle.FONT_FAMILY:
                    unmarshaller = FontFamily.fromJson;
                    break;
                case TextStyle.FONT_KERNING:
                    unmarshaller = FontKerning.fromJson;
                    break;
                case TextStyle.FONT_SIZE:
                    unmarshaller = FontSize.fromJson;
                    break;
                case TextStyle.FONT_STRETCH:
                    unmarshaller = FontStretch.fromJson;
                    break;
                case TextStyle.FONT_STYLE:
                    unmarshaller = FontStyle.fromJson;
                    break;
                case TextStyle.FONT_VARIANT:
                    unmarshaller = FontVariant.fromJson;
                    break;
                case TextStyle.FONT_WEIGHT:
                    unmarshaller = FontWeight.fromJson;
                    break;
                case TextStyle.HANGING_PUNCTUATION:
                    unmarshaller = HangingPunctuation.fromJson;
                    break;
                case TextStyle.HEIGHT:
                    unmarshaller = LengthFromJson;
                    break;
                case TextStyle.HYPHENS:
                    unmarshaller = Hyphens.fromJson;
                    break;
                case TextStyle.LETTER_SPACING:
                case TextStyle.LINE_HEIGHT:
                    unmarshaller = LengthFromJson;
                    break;
                case TextStyle.LIST_STYLE_POSITION:
                    unmarshaller = ListStylePosition.fromJson;
                    break;
                case TextStyle.LIST_STYLE_TYPE:
                    unmarshaller = ListStyleType.fromJson;
                    break;
                case TextStyle.MARGIN_BOTTOM:
                case TextStyle.MARGIN_LEFT:
                case TextStyle.MARGIN_RIGHT:
                case TextStyle.MARGIN_TOP:
                case TextStyle.MAX_HEIGHT:
                case TextStyle.MAX_WIDTH:
                case TextStyle.MIN_HEIGHT:
                case TextStyle.MIN_WIDTH:
                    unmarshaller = LengthFromJson;
                    break;
                case TextStyle.OPACITY:
                    // Opacity
                    break;
                case TextStyle.OUTLINE_COLOR:
                    unmarshaller = Color.fromJson;
                    break;
                case TextStyle.OUTLINE_OFFSET:
                    unmarshaller = LengthFromJson;
                    break;
                case TextStyle.OUTLINE_STYLE:
                    unmarshaller = OutlineStyle.fromJson;
                    break;
                case TextStyle.OUTLINE_WIDTH:
                    unmarshaller = LengthFromJson;
                    break;
                case TextStyle.OVERFLOW_X:
                case TextStyle.OVERFLOW_Y:
                    unmarshaller = Overflow.fromJson;
                    break;
                case TextStyle.PADDING_BOTTOM:
                case TextStyle.PADDING_LEFT:
                case TextStyle.PADDING_RIGHT:
                case TextStyle.PADDING_TOP:
                case TextStyle.TAB_SIZE:
                    unmarshaller = LengthFromJson;
                    break;
                case TextStyle.TEXT:
                    // String
                    break;
                case TextStyle.TEXT_ALIGN:
                    unmarshaller = TextAlign.fromJson;
                    break;
                case TextStyle.TEXT_DECORATION_COLOR:
                    unmarshaller = Color.fromJson;
                    break;
                case TextStyle.TEXT_DECORATION_LINE:
                    unmarshaller = TextDecorationLine.fromJson;
                    break;
                case TextStyle.TEXT_DECORATION_STYLE:
                    unmarshaller = TextDecorationStyle.fromJson;
                    break;
                case TextStyle.TEXT_DECORATION_THICKNESS:
                    unmarshaller = LengthFromJson;
                    break;
                case TextStyle.TEXT_INDENT:
                    unmarshaller = LengthFromJson;
                    break;
                case TextStyle.TEXT_JUSTIFY:
                    unmarshaller = TextJustify.fromJson;
                    break;
                case TextStyle.TEXT_OVERFLOW:
                    // TextOverflow
                    break;
                case TextStyle.TEXT_TRANSFORM:
                    unmarshaller = TextTransform.fromJson;
                    break;
                case TextStyle.TEXT_WRAPPING:
                    unmarshaller = TextWrapping.fromJson;
                    break;
                case TextStyle.VERTICAL_ALIGN:
                    unmarshaller = VerticalAlign.fromJson;
                    break;
                case TextStyle.VISIBILITY:
                    unmarshaller = Visibility.fromJson;
                    break;
                case TextStyle.WHITE_SPACE:
                    unmarshaller = TextWhitespace.fromJson;
                    break;
                case TextStyle.WIDTH:
                    unmarshaller = LengthFromJson;
                    break;
                case TextStyle.WORD_BREAK:
                    unmarshaller = WordBreak.fromJson;
                    break;
                case TextStyle.WORD_SPACING:
                    unmarshaller = LengthFromJson;
                    break;
                case TextStyle.WORD_WRAP:
                    unmarshaller = WordWrap.fromJson;
                    break;
                case TextStyle.WRITING_MODE:
                    unmarshaller = WritingMode.fromJson;
                    break;
                default:
                    throw new Error("Unknown property " + property);
            }

            properties[property] = (unmarshaller && unmarshaller(value)) ||
                typed ||
                value;
        }

        return new TextStyle(properties);
    }

    constructor(properties) {
        super();
        Preconditions.requireObject(properties, "properties");
        this.properties = Object.assign({}, properties);
    }

    get(property) {
        checkProperty(property);

        return this.properties[property];
    }

    set(property, value) {
        checkProperty(property);

        let expectedClass;
        let expectedTypeOf;

        switch(property) {
            case TextStyle.BACKGROUND_COLOR:
            case TextStyle.BORDER_BOTTOM_COLOR:
                expectedClass = Color;
                break;
            case TextStyle.BORDER_BOTTOM_STYLE:
                expectedClass = BorderStyle;
                break;
            case TextStyle.BORDER_BOTTOM_WIDTH:
                expectedClass = Length;
                break;
            case TextStyle.BORDER_COLLAPSE:
                expectedClass = BorderCollapse;
                break;
            case TextStyle.BORDER_LEFT_COLOR:
                expectedClass = Color;
                break;
            case TextStyle.BORDER_LEFT_STYLE:
                expectedClass = BorderStyle;
                break;
            case TextStyle.BORDER_LEFT_WIDTH:
                expectedClass = Length;
                break;
            case TextStyle.BORDER_RIGHT_COLOR:
                expectedClass = Color;
                break;
            case TextStyle.BORDER_RIGHT_STYLE:
                expectedClass = BorderStyle;
                break;
            case TextStyle.BORDER_RIGHT_WIDTH:
            case TextStyle.BORDER_SPACING:
                expectedClass = Length;
                break;
            case TextStyle.BORDER_TOP_COLOR:
                expectedClass = Color;
                break;
            case TextStyle.BORDER_TOP_STYLE:
                expectedClass = BorderStyle;
                break;
            case TextStyle.BORDER_TOP_WIDTH:
                expectedClass = Length;
                break;
            case TextStyle.COLOR:
                expectedClass = Color;
                break;
            case TextStyle.DIRECTION:
                expectedClass = Direction;
                break;
            case TextStyle.FONT_FAMILY:
                expectedClass = FontFamily;
                break;
            case TextStyle.FONT_KERNING:
                expectedClass = FontKerning;
                break;
            case TextStyle.FONT_SIZE:
                expectedClass = FontSize;
                break;
            case TextStyle.FONT_STRETCH:
                expectedClass = FontStretch;
                break;
            case TextStyle.FONT_STYLE:
                expectedClass = FontStyle;
                break;
            case TextStyle.FONT_VARIANT:
                expectedClass = FontVariant;
                break;
            case TextStyle.FONT_WEIGHT:
                expectedClass = FontWeight;
                break;
            case TextStyle.HANGING_PUNCTUATION:
                expectedClass = HangingPunctuation;
                break;
            case TextStyle.HEIGHT:
                expectedClass = Length;
                break;
            case TextStyle.HYPHENS:
                expectedClass = Hyphens;
                break;
            case TextStyle.LETTER_SPACING:
                expectedClass = Length;
                break;
            case TextStyle.LINE_HEIGHT:
                expectedClass = Length;
                break;
            case TextStyle.LIST_STYLE_POSITION:
                expectedClass = ListStylePosition;
                break;
            case TextStyle.LIST_STYLE_TYPE:
                expectedClass = ListStyleType;
                break;
            case TextStyle.MARGIN_BOTTOM:
            case TextStyle.MARGIN_LEFT:
            case TextStyle.MARGIN_RIGHT:
            case TextStyle.MARGIN_TOP:
            case TextStyle.MAX_HEIGHT:
            case TextStyle.MAX_WIDTH:
            case TextStyle.MIN_HEIGHT:
            case TextStyle.MIN_WIDTH:
                expectedClass = Length;
                break;
            case TextStyle.OPACITY:
                break;
            case TextStyle.OUTLINE_COLOR:
                expectedClass = Color;
                break;
            case TextStyle.OUTLINE_OFFSET:
                expectedClass = Length;
                break;
            case TextStyle.OUTLINE_STYLE:
                expectedClass = OutlineStyle;
                break;
            case TextStyle.OUTLINE_WIDTH:
                expectedClass = Length;
                break;
            case TextStyle.OVERFLOW_X:
            case TextStyle.OVERFLOW_Y:
                expectedClass = Overflow;
                break;
            case TextStyle.PADDING_BOTTOM:
            case TextStyle.PADDING_LEFT:
            case TextStyle.PADDING_RIGHT:
            case TextStyle.PADDING_TOP:
            case TextStyle.TAB_SIZE:
                expectedClass = Length;
                break;
            case TextStyle.TEXT:
                expectedTypeOf = "string";
                break;
            case TextStyle.TEXT_ALIGN:
                expectedClass = TextAlign;
                break;
            case TextStyle.TEXT_DECORATION_COLOR:
                expectedClass = Color;
                break;
            case TextStyle.TEXT_DECORATION_LINE:
                expectedClass = TextDecorationLine;
                break;
            case TextStyle.TEXT_DECORATION_STYLE:
                expectedClass = TextDecorationStyle;
                break;
            case TextStyle.TEXT_DECORATION_THICKNESS:
                expectedClass = Length;
                break;
            case TextStyle.TEXT_INDENT:
                expectedClass = Length;
                break;
            case TextStyle.TEXT_JUSTIFY:
                expectedClass = TextJustify;
                break;
            case TextStyle.TEXT_OVERFLOW:
                break;
            case TextStyle.TEXT_TRANSFORM:
                expectedClass = TextTransform;
                break;
            case TextStyle.TEXT_WRAPPING:
                expectedClass = TextWrapping;
                break;
            case TextStyle.VERTICAL_ALIGN:
                expectedClass = VerticalAlign;
                break;
            case TextStyle.VISIBILITY:
                expectedClass = Visibility;
                break;
            case TextStyle.WHITE_SPACE:
                expectedClass = TextWhitespace;
                break;
            case TextStyle.WIDTH:
                expectedClass = Length;
                break;
            case TextStyle.WORD_BREAK:
                expectedClass = WordBreak;
                break;
            case TextStyle.WORD_SPACING:
                expectedClass = Length;
                break;
            case TextStyle.WORD_WRAP:
                expectedClass = WordWrap;
                break;
            case TextStyle.WRITING_MODE:
                expectedClass = WritingMode;
                break;
            default:
                throw new Error("Unknown property " + property);
        }

        if(null == value){
            throw new Error("Property \"" + property + "\" missing value");
        }
        if((expectedTypeOf && typeof (value) !== expectedTypeOf)){
            throw new Error("Expected " + expectedTypeOf + " property \"" + property + "\" got " + value);
        }
        if((expectedClass === Number && Number.isNaN(value)) ||
            (typeof expectedClass === "function" && !(value instanceof expectedClass))){
            throw new Error("Expected " + expectedClass.name + " property \"" + property + "\" got " + value);
        }

        return value === this.get(property) ? // get will complain if property is unknown
            this :
            copyAndSet(this.properties, property, value);
    }

    remove(property) {
        const value = this.get(property); // get will complain if property is unknown
        return value ?
            copyAndRemove(this.properties, property) :
            this;
    }

    /**
     * Returns the width as a number removing the px suffix or undefined if absent.
     */
    width() {
        return this.get(TextStyle.WIDTH);
    }

    /**
     * Returns the height as a number removing the px suffix or undefined if absent.
     */
    height() {
        return this.get(TextStyle.HEIGHT);
    }

    /**
     * Merges this style with the entries from the given, this means properties in other will replace any that exist in this.
     */
    merge(style) {
        Preconditions.requireInstance(style, TextStyle, "style");

        return style.isEmpty() ?
            this :
            this.isEmpty() ?
                style :
                new TextStyle(Object.assign({}, this.properties, style.properties));
    }

    /**
     * Returns true only if this {@link TextStyle} has no actual entries.
     */
    isEmpty() {
        return Object.keys(this.properties).length === 0;
    }

    /**
     * Produces a JSON object holding the properties with style properties converted from kebab case to camel case.
     */
    toCss() {
        const css = {};

        for(const [property, value] of Object.entries(this.properties)) {
            let cssPropertyName;

            switch(property) {
                default:
                    const components = property.split("-");
                    const first = components.shift();

                    cssPropertyName =
                        first +
                        components.map(c => {
                            return c.charAt(0).toUpperCase() + c.substring(1);
                        })
                            .join("");
                    break;
            }

            css[cssPropertyName] = value.toCssValue ?
                value.toCssValue() :
                value.toString();
        }

        return css;
    }

    /**
     * Returns this metadata as a JSON. Perfect to perform REST api calls.
     */
    toJson() {
        const json = {};

        for(const [property, value] of Object.entries(this.properties)) {
            json[property] = (value.toJson && value.toJson()) || value;
        }

        return json;
    }

    typeName() {
        return TYPE_NAME;
    }

    accept(textNodeVisitor) {
        textNodeVisitor.visitTextStyle(this);
    }

    equals(other) {
        return this === other || (other instanceof TextStyle && toJsonString(this) === toJsonString(other));
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

function toJsonString(textStyle) {
    return JSON.stringify(textStyle.toJson());
}

SystemObject.register(TYPE_NAME, TextStyle.fromJson);

// force each class to call SystemObject.register
// eslint-disable-next-line no-unused-expressions
BorderCollapse.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
BorderStyle.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
Direction.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
FontFamily.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
FontKerning.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
FontSize.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
FontStretch.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
FontStyle.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
FontVariant.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
FontWeight.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
HangingPunctuation.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
Hyphens.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
Length.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
ListStylePosition.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
ListStyleType.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
OutlineStyle.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
Overflow.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
PixelLength.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
TextAlign.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
TextDecorationLine.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
TextDecorationStyle.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
TextJustify.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
TextTransform.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
TextWhitespace.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
TextWrapping.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
VerticalAlign.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
Visibility.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
WordBreak.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
WordWrap.prototype; // lgtm

// eslint-disable-next-line no-unused-expressions
WritingMode.prototype; // lgtm