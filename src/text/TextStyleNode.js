import {STYLE, TextNode} from "./TextNode";
import TextStyle from "./TextStyle";

/**
 * Holds some styles that are applied to many child text nodes.
 */
export default class TextStyleNode extends TextNode {
    constructor(styles, children) {
        super();
        if (!(styles instanceof TextStyle)) {
            throw new Error("styles is not a TextStyle");
        }

        this.stylesValue = styles;
        this.childrenValue = children || [];
    }

    styles() {
        return this.stylesValue;
    }

    children() {
        return this.childrenValue;
    }

    typeName() {
        return STYLE;
    }

    value() {
        const value = {
            styles: this.styles().toJson()
        }
        const children = this.children();
        if (children && children.length > 0) {
            value.children = children.map(c => c.toJson());
        }
        return value;
    }
}