import {TextNode} from "./TextNode";
import TextStyle from "./TextStyle";

export default class TextLeafNode extends TextNode {

    constructor() {
        super();
    }

    styles() {
        return TextStyle.EMPTY;
    }
}