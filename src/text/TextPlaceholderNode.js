import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";
import TextLeafNode from "./TextLeafNode";
import TextNode from "./TextNode";

export default class TextPlaceholderNode extends TextLeafNode {

    static fromJson(json) {
        return new TextPlaceholderNode(json);
    }

    constructor(placeholder) {
        super();
        Preconditions.requireText(placeholder, "placeholder");
        this.placeholder = placeholder;
    }

    value() {
        return this.placeholder;
    }

    typeName() {
        return TextNode.PLACEHOLDER;
    }

    toJson() {
        return this.value();
    }

    accept(textNodeVisitor) {
        textNodeVisitor.visitTextPlaceholderNode(this);
    }

    equals(other) {
        return other instanceof TextPlaceholderNode &&
            this.value() === other.value();
    }
}

SystemObject.register(TextNode.PLACEHOLDER, TextPlaceholderNode.fromJson);