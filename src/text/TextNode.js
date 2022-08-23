import SystemObject from "../SystemObject.js";

export default class TextNode extends SystemObject {

    static TEXT = "text";
    static STYLE = "text-style-node";
    static PLACEHOLDER = "text-placeholder";
    static STYLE_NAME = "text-styleName";

    cellStyle(defaultStyle) {
        SystemObject.throwUnsupportedOperation();
    }

    renderRoot() {
        SystemObject.throwUnsupportedOperation();
    }

    render() {
        SystemObject.throwUnsupportedOperation();
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}