import {TEXT} from "./TextNode";
import TextLeafNode from "./TextLeafNode";

export default class Text extends TextLeafNode {

    constructor(text) {
        super();
        this.text = text;
    }

    typeName() {
        return TEXT;
    }

    value() {
        return this.text;
    }
}