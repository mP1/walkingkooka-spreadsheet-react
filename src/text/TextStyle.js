/**
 * Used to create a new instance and then the given style and value.
 */
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
        if (!styles) {
            throw new Error("Missing styles");
        }
        if (typeof styles != "object") {
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
        const width = this.get(WIDTH);
        const number = width && Number.parseFloat(width);
        return (width || !Number.isNaN(number)) && number;
    }

    /**
     * Returns this metadata as a JSON. Perfect to perform REST api calls.
     */
    toJson() {
        return Object.assign({}, this.styles);
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}