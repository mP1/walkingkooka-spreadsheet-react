export default class TextNode {

    static TEXT = "text";
    static STYLE = "text-style-node";
    static PLACEHOLDER = "text-placeholder";
    static STYLE_NAME = "text-styleName";

    // eslint-disable-next-line no-useless-constructor
    constructor() {
    }

    /**
     * Returns this metadata as a JSON. Perfect to perform REST api calls.
     */
    toJson() {
        return {
            type: this.typeName(),
            value: this.value()
        };
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}