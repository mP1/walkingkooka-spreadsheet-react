import Equality from "../Equality.js";
import Preconditions from "../Preconditions.js";
import React from "react";
import SpreadsheetCellReference from "./reference/cell/SpreadsheetCellReference.js";
import SpreadsheetExpressionReference from "./reference/SpreadsheetExpressionReference.js";
import SpreadsheetFormatPattern from "./format/SpreadsheetFormatPattern.js";
import SpreadsheetFormula from "./reference/cell/formula/SpreadsheetFormula.js";
import SpreadsheetLabelName from "./reference/label/SpreadsheetLabelName.js";
import SystemObject from "../SystemObject.js";
import TableCell from "@mui/material/TableCell";
import TextNode from "../text/TextNode";
import textNodeJsonSupportFromJson from "../text/TextNodeJsonSupport";
import TextStyle from "../text/TextStyle";
import Tooltip from "@mui/material/Tooltip";

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
     *       "formatPattern": "pattern"
     *    }
     * }
     * </pre>
     */
    static fromJson(json) {
        Preconditions.requireNonNull(json, "json");

        const keys = Object.keys(json);
        switch(keys.length) {
            case 0:
                throw new Error("Missing reference");
            case 1:
                const cellReferenceOrLabel = keys[0];
                const {
                    formula,
                    style,
                    formatPattern,
                    formatted
                } = json[cellReferenceOrLabel];

                return new SpreadsheetCell(
                    SpreadsheetCellReference.isCellReferenceText(cellReferenceOrLabel) ?
                      SpreadsheetCellReference.fromJson(cellReferenceOrLabel) :
                        SpreadsheetLabelName.fromJson(cellReferenceOrLabel),
                    formula && SpreadsheetFormula.fromJson(formula), // formula is optional
                    (style && TextStyle.fromJson(style)) || TextStyle.EMPTY,
                    formatPattern != null ? SystemObject.fromJsonWithType(formatPattern) : undefined,
                    formatted && textNodeJsonSupportFromJson(formatted));
            default:
                throw new Error("Expected only reference got " + JSON.stringify(json));
        }
    }

    constructor(reference, formula, style, formatPattern, formatted) {
        super();
        Preconditions.requireInstance(reference, SpreadsheetExpressionReference, "reference");
        Preconditions.optionalInstance(formula, SpreadsheetFormula, "formula"); // only optional to support creating a cell patch with only a style.
        Preconditions.requireInstance(style, TextStyle, "style");
        Preconditions.optionalInstance(formatPattern, SpreadsheetFormatPattern, "formatPattern");
        Preconditions.optionalInstance(formatted, TextNode, "formatted");

        this.referenceValue = reference.toRelative();
        this.formulaValue = formula;
        this.styleValue = style;
        this.formatPatternValue = formatPattern;
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
        Preconditions.requireInstance(formula, SpreadsheetFormula, "formula");

        return this.formula() === formula ?
            this :
            new SpreadsheetCell(this.reference(), formula, this.style(), this.formatPattern(), this.formatted());
    }

    style() {
        return this.styleValue;
    }

    formatPattern() {
        return this.formatPatternValue;
    }

    formatted() {
        return this.formattedValue;
    }

    toJson() {
        const {
            formulaValue,
            styleValue,
            formatPatternValue,
            formattedValue
        } = this;

        const json2 = {};

        if(formulaValue){
            json2.formula = formulaValue.toJson();
        }

        if(!styleValue.isEmpty()){
            json2.style = styleValue.toJson();
        }

        if(formatPatternValue){
            json2.formatPattern = formatPatternValue.toJsonWithType();
        }

        if(formattedValue){
            json2.formatted = formattedValue.toJsonWithType();
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
    renderViewport(defaultStyle, labels) {
        Preconditions.requireInstance(defaultStyle, TextStyle, "defaultStyle");
        Preconditions.requireArray(labels, "labels");

        const formatted = this.formatted();

        const formattedRender = formatted ?
            formatted.renderRoot() :
            "";
        const style = formatted ?
            formatted.cellStyle(defaultStyle):
            defaultStyle;
        const css = style.toCss();
        css.boxSizing = "border-box";

        const reference = this.reference();
        const cellId = reference.viewportId();

        const tableCell = <TableCell key={cellId}
                                     id={cellId}
                                     className={"cell"}
                                     tabIndex={0}
                                     style={css}
                                     data-selection={reference}
        >{
            formattedRender
        }</TableCell>;

        // place a tooltip top-center with any labels csv.

        const tooltipId = reference.viewportTooltipId();
        return labels.length > 0 ?
            <Tooltip key={tooltipId}
                     id={tooltipId}
                     title={labels.map(l => l.value()).join(", ")}
                     placement={"top"}
                     >{
                tableCell
            }</Tooltip> :
            tableCell;
    }

    equals(other) {
        return (other instanceof SpreadsheetCell &&
                this.reference().equals(other.reference()) &&
                Equality.safeEquals(this.formula(), other.formula()) &&
                Equality.safeEquals(this.style(), other.style()) &&
                Equality.safeEquals(this.formatPattern(), other.formatPattern()) &&
                Equality.safeEquals(this.formatted(), other.formatted())
            );
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetCell.fromJson)