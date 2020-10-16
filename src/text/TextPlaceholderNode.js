import {TextNode, PLACEHOLDER} from "./TextNode";

export default class TextPlaceholderNode extends TextNode {

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