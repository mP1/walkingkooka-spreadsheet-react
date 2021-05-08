import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";
import TextLeafNode from "./TextLeafNode";
import TextNode from "./TextNode";

export default class Text extends TextLeafNode {

    static fromJson(json) {
        return new Text(json);
    }

    constructor(text) {
        super();
        Preconditions.requireText(text, "text");
        this.text = text;
    }

    typeName() {
        return TextNode.TEXT;
    }

    value() {
        return this.text;
    }

    accept(textNodeVisitor) {
        textNodeVisitor.visitText(this);
    }

    render() {
        return this.value();
    }

    equals(other) {
        return this === other ||
            (other instanceof Text &&
                this.value() === other.value());
    }
}

SystemObject.register(TextNode.TEXT, Text.fromJson);