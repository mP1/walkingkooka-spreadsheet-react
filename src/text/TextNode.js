export const TEXT = "text";
export const STYLE = "text-style";
export const PLACEHOLDER = "text-placeholder";
export const STYLE_NAME = "text-style-name";

export class TextNode {

    constructor() {
    }

    /**
     * Returns this metadata as a JSON. Perfect to perform REST api calls.
     */
    toJson() {
        return {
            "typeName": this.typeName(),
            "value": this.value()
        };
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}