import Equality from "../Equality.js";
import Preconditions from "../Preconditions.js";
import React from "react";
import TextNode from "./TextNode";
import TextStyle from "./TextStyle";

/**
 * Holds some styles that are applied to many child text nodes.
 */
export default class TextStyleNode extends TextNode {
    constructor(styles, children) {
        super();
        Preconditions.requireInstance(styles, TextStyle, "styles");

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
        return TextNode.STYLE;
    }

    toJson() {
        const value = {
            styles: this.styles().toJson()
        }
        const children = this.children();
        if(children && children.length > 0){
            value.children = children.map(c => c.toJsonWithType());
        }
        return value;
    }

    accept(textNodeVisitor) {
        if(textNodeVisitor.startVisitTextStyleNode(this)){
            textNodeVisitor.acceptChildren(this.children());
        }
        textNodeVisitor.endVisitTextStyleNode(this);
    }

    cellStyle(defaultStyle) {
        return defaultStyle.merge(this.styles());
    }

    // the SpreadsheetCell will render a TABLE CELL with style from #cellStyle
    renderRoot() {
        return (
            <React.Fragment>
                {
                    this.children()
                        .map(c => c.render())
                }
            </React.Fragment>
        );
    }

    render() {
        return (
            <div style={this.styles().toCss()}>
                {
                    this.children()
                        .map(c => c.render())
                }
            </div>
        );
    }

    equals(other) {
        return other instanceof TextStyleNode &&
            this.styles().equals(other.styles()) &&
            Equality.safeEquals(this.children(), other.children());
    }
}