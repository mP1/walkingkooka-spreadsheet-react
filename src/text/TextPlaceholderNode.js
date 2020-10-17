import {PLACEHOLDER} from "./TextNode";
import TextLeafNode from "./TextLeafNode";

export default class TextPlaceholderNode extends TextLeafNode {

    constructor(placeholder) {
        super();
        if (!placeholder) {
            throw new Error("text missing");
        }
        if (typeof placeholder != "string") {
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
}