import {PLACEHOLDER} from "./TextNode";
import TextLeafNode from "./TextLeafNode";

export default class TextPlaceholderNode extends TextLeafNode {

    constructor(placeholder) {
        super();
        this.placeholder = placeholder;
    }

    typeName() {
        return PLACEHOLDER;
    }

    value() {
        return this.placeholder;
    }
}