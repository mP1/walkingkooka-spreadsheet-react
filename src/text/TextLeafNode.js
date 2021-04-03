import TextNode from "./TextNode";
import TextStyle from "./TextStyle";

export default class TextLeafNode extends TextNode {

    styles() {
        return TextStyle.EMPTY;
    }
}