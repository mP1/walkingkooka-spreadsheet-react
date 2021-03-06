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

    typeName() {
        return TextNode.PLACEHOLDER;
    }

    value() {
        return this.placeholder;
    }

    accept(textNodeVisitor) {
        textNodeVisitor.visitTextPlaceholderNode(this);
    }

    render() {
        throw new Error("Unsupported: render");
    }

    equals(other) {
        return this === other ||
            (other instanceof TextPlaceholderNode &&
                this.value() === other.value());
    }
}

SystemObject.register(TextNode.PLACEHOLDER, TextPlaceholderNode.fromJson);