import {TextNode, STYLE} from "./TextNode";

/**
 * Holds some styles that are applied to many child text nodes.
 */
export default class TextStyleNode extends TextNode {
    constructor(styles, children) {
        super();
        this.stylesValue = Object.assign({}, styles);
        this.childrenValue = children || [];
    }

    styles() {
        return Object.assign({}, this.stylesValue);
    }

    children() {
        return this.childrenValue;
    }

    typeName() {
        return STYLE;
    }

    value() {
        const value = {
            styles: this.styles()
        }
        const children = this.children();
        if (children && children.length > 0) {
            value.children = children.map(c => c.toJson());
        }
        return value;
    }
}