import textNodeJsonSupportFromJson from "../text/TextNodeJsonSupport";
import Equality from "../Equality.js";
import React from "react";
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference";
import SpreadsheetFormula from "./SpreadsheetFormula";
import SpreadsheetCellFormat from "./SpreadsheetCellFormat";
import SystemObject from "../SystemObject.js";
import TableCell from "@material-ui/core/TableCell";
import TextNode from "../text/TextNode";
import TextStyle from "../text/TextStyle";
import "./SpreadsheetCell.css";

const TYPE_NAME = "spreadsheet-cell";

/**
 * Represents a spreadsheet cell only reference and formula are required.
 */
export default class SpreadsheetCell extends SystemObject {

    /**
     * <pre>
     * {
     *   "$B$21": {
     *     "formula": {
     *       "text": "=1+2"
     *       },
     *       "style": {
     *         "font-textStyle": "ITALIC",
     *         "font-weight": "bold"
     *       },
     *       "format": "pattern"
     *    }
     * }
     * </pre>
     */
    static fromJson(json) {
        if(!json){
            throw new Error("Missing json");
        }

        const keys = Object.keys(json);
        switch(keys.length) {
            case 0:
                throw new Error("Missing reference");
            case 1:
                const reference = keys[0];
                const {formula, style, format, formatted} = json[reference];

                return new SpreadsheetCell(SpreadsheetCellReference.fromJson(reference),
                    SpreadsheetFormula.fromJson(formula),
                    (style && TextStyle.fromJson(style)) || TextStyle.EMPTY,
                    format != null ? SpreadsheetCellFormat.fromJson(format) : format,
                    formatted && textNodeJsonSupportFromJson(formatted));
            default:
                throw new Error("Expected only reference got " + JSON.stringify(json));
        }
    }

    constructor(reference, formula, style, format, formatted) {
        super();
        if(!reference){
            throw new Error("Missing reference");
        }
        if(!(reference instanceof SpreadsheetCellReference)){
            throw new Error("Expected SpreadsheetCellReference reference got " + reference);
        }
        checkFormula(formula);

        if(!style){
            throw new Error("Missing style");
        }
        if(!(style instanceof TextStyle)){
            throw new Error("Expected TextStyle style got " + style);
        }

        if(format && !(format instanceof SpreadsheetCellFormat)){
            throw new Error("Expected SpreadsheetCellFormat format got " + format);
        }
        if(formatted && !(formatted instanceof TextNode)){
            throw new Error("Expected TextNode formatted got " + formatted);
        }

        this.referenceValue = reference.toRelative();
        this.formulaValue = formula;
        this.styleValue = style;
        this.formatValue = format;
        this.formattedValue = formatted;
    }

    reference() {
        return this.referenceValue;
    }

    formula() {
        return this.formulaValue;
    }

    /**
     * Would be setter that returns a {@link SpreadsheetCell} with the given {@link SpreadsheetFormula}.
     */
    setFormula(formula) {
        checkFormula(formula);

        return this.formula() === formula ?
            this :
            new SpreadsheetCell(this.reference(), formula, this.style(), this.format(), this.formatted());
    }

    style() {
        return this.styleValue;
    }

    format() {
        return this.formatValue;
    }

    formatted() {
        return this.formattedValue;
    }

    toJson() {
        const {formulaValue, styleValue, formatValue, formattedValue} = this;

        let json2 = {
            formula: formulaValue.toJson()
        };

        if(!styleValue.isEmpty()){
            json2.style = styleValue.toJson();
        }

        if(formatValue){
            json2.format = formatValue.toJson();
        }

        if(formattedValue){
            json2.formatted = formattedValue.toJson();
        }

        const json = {};
        json[this.reference().toJson()] = json2;
        return json;
    }

    typeName() {
        return TYPE_NAME;
    }

    /**
     * Renders a TableCell with the formatted content. The default style will typically come from {@link SpreadsheetMetadata}.
     */
    render(defaultStyle, edit, onClick) {
        if(!defaultStyle){
            throw new Error("Missing defaultStyle");
        }
        if(!(defaultStyle instanceof TextStyle)){
            throw new Error("Expected TextStyle defaultStyle got " + defaultStyle);
        }
        if(!onClick){
            throw new Error("Missing onClick");
        }
        if(typeof onClick !== "function"){
            throw new Error("Expected function onClick got " + onClick);
        }

        const style = defaultStyle.merge(this.style());

        const formatted = this.formatted();
        const formattedRender = formatted ? formatted.render() : "";
        const css = style.toCss();
        css.boxSizing = "border-box";

        edit && this.highlightCell(css);

        const reference = this.reference();

        return <TableCell key={reference}
                          id={"cell-" + reference}
                          className={"cell"}
                          onClick={onClick}
                          style={css}>{formattedRender}</TableCell>;
    }

    /**
     * Adds an outline styles to the given css.
     */
    highlightCell(css) {
        css.outlineColor="black";
        css.outlineStyle="dotted";
        css.outlineWidth="3px";
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetCell &&
                this.reference().equals(other.reference()) &&
                this.formula().equals(other.formula()) &&
                Equality.safeEquals(this.style(), other.style()) &&
                Equality.safeEquals(this.format(), other.format()) &&
                Equality.safeEquals(this.formatted(), other.formatted())
            );
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

function checkFormula(formula) {
    if(!formula){
        throw new Error("Missing formula");
    }
    if(!(formula instanceof SpreadsheetFormula)){
        throw new Error("Expected SpreadsheetFormula formula got " + formula);
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetCell.fromJson)