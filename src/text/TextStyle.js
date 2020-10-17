export function fromJson(json) {
    return new TextStyle(json);
}

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

/**
 * Holds many style properties and values.
 */
// TODO validate style and value.
export class TextStyle {

    static EMPTY = new TextStyle({});

    constructor(styles) {
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
     * Returns this metadata as a JSON. Perfect to perform REST api calls.
     */
    toJson() {
        return Object.assign({}, this.styles);
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}