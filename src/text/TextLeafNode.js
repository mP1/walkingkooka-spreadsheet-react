import TextNode from "./TextNode";
import TextStyle from "./TextStyle";

export default class TextLeafNode extends TextNode {

    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super();
    }

    styles() {
        return TextStyle.EMPTY;
    }
}