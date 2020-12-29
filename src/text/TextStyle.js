/**
 * Used to create a new instance and then the given style and value.
 */
import PixelLength from "./PixelLength";

function copyAndSet(styles, style, value) {
    let copy = new TextStyle(styles);
    copy.styles[style] = value;
    return copy;
}

/**
 * Used to create a new instance and then remove the given style.
 */
function copyAndRemove(styles, style) {
    let copy = new TextStyle(styles);
    delete copy.styles[style];
    return copy;
}

const WIDTH = "width";
const HEIGHT = "height";

function fromPixel(text) {
    return text && PixelLength.parse(text);
}

/**
 * Holds many style properties and values.
 */
// TODO validate style and value.
export default class TextStyle {

    static EMPTY = new TextStyle({});

    static fromJson(json) {
        return new TextStyle(json);
    }

    constructor(styles) {
        if(!styles){
            throw new Error("Missing styles");
        }
        if(typeof styles !== "object"){
            throw new Error("Styles expected object got " + styles);
        }
        this.styles = Object.assign({}, styles);
    }

    get(style) {
        return this.styles[style];
    }

    set(style, value) {
        return value === this.get(style) ?
            this :
            copyAndSet(this.styles, style, value);
    }

    remove(style) {
        const value = this.get(style);
        return value ?
            copyAndRemove(this.styles, style) :
            this;
    }

    /**
     * Returns the width as a number removing the px suffix or undefined if absent.
     */
    width() {
        return fromPixel(this.get(WIDTH));
    }

    /**
     * Returns the height as a number removing the px suffix or undefined if absent.
     */
    height() {
        return fromPixel(this.get(HEIGHT));
    }

    /**
     * Merges this style with the entries from the given, this means properties in other will replace any that exist in this.
     */
    merge(style) {
        if(!style){
            throw new Error("Missing style");
        }
        if(!(style instanceof TextStyle)){
            throw new Error("Expected TextStyle style got " + style);
        }

        return style.isEmpty() ?
            this :
            this.isEmpty() ?
                style :
                new TextStyle(Object.assign({}, this.styles, style.styles));
    }

    /**
     * Returns true only if this {@link TextStyle} has no actual entries.
     */
    isEmpty() {
        return Object.keys(this.styles).length === 0;
    }

    /**
     * Produces a JSON object holding the styles with style properties converted from kebab case to camel case.
     */
    toCss() {
        const css = {};

        for(const [key, value] of Object.entries(this.styles)) {
            const components = key.split("-");
            const first = components.shift();

            const camelCase =
                first +
                components.map(c => {
                    return c.charAt(0).toUpperCase() + c.substring(1);
                })
                    .join("");

            var value2;
            switch(first) {
                case "border":
                case "margin":
                case "padding":
                    if(value === "none"){
                        value2 = "0";
                        break;
                    }
                    value2 = value;
                    break;
                default:
                    value2 = value;
                    break;
            }

            css[camelCase] = value2.toString();
        }

        return css;
    }

    /**
     * Returns this metadata as a JSON. Perfect to perform REST api calls.
     */
    toJson() {
        return Object.assign({}, this.styles);
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