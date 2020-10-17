import {TEXT} from "./TextNode";
import TextLeafNode from "./TextLeafNode";

export default class Text extends TextLeafNode {

    constructor(text) {
        super();
        if (!text) {
            throw new Error("text missing");
        }
        if (typeof text != "string") {
            throw new Error("Expected string got " + text);
        }
        this.text = text;
    }

    typeName() {
        return TEXT;
    }

    value() {
        return this.text;
    }
}