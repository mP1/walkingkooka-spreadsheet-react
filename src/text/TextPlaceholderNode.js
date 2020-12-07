import {PLACEHOLDER} from "./TextNode";
import TextLeafNode from "./TextLeafNode";

export default class TextPlaceholderNode extends TextLeafNode {

    static fromJson(json) {
        return new TextPlaceholderNode(json);
    }

    constructor(placeholder) {
        super();
        if (!placeholder) {
            throw new Error("Missing text");
        }
        if (typeof placeholder !== "string") {
            throw new Error("Expected string got " + placeholder);
        }
        this.placeholder = placeholder;
    }

    typeName() {
        return PLACEHOLDER;
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