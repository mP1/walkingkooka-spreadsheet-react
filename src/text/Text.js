import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";
import TextLeafNode from "./TextLeafNode";
import TextNode from "./TextNode";

export default class Text extends TextLeafNode {

    static EMPTY = new Text("");

    static fromJson(json) {
        return "" === json ? Text.EMPTY : new Text(json);
    }

    constructor(text) {
        super();
        Preconditions.requireText(text, "text");
        this.text = text;
    }

    value() {
        return this.text;
    }

    typeName() {
        return TextNode.TEXT;
    }

    toJson() {
        return this.value();
    }

    accept(textNodeVisitor) {
        textNodeVisitor.visitText(this);
    }

    cellStyle(defaultStyle) {
        return defaultStyle;
    }

    renderRoot() {
        return this.render();
    }

    render() {
        return this.value();
    }

    equals(other) {
        return other instanceof Text &&
            this.value() === other.value();
    }
}

SystemObject.register(TextNode.TEXT, Text.fromJson);