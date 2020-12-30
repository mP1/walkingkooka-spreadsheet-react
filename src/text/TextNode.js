import SystemObject from "../SystemObject.js";

export default class TextNode extends SystemObject {

    static TEXT = "text";
    static STYLE = "text-style-node";
    static PLACEHOLDER = "text-placeholder";
    static STYLE_NAME = "text-styleName";

    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super();
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

    toJsonWithType() {
        return this.toJson();
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}