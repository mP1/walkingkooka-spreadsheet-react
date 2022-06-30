import textNodeJsonSupportFromJson from "../text/TextNodeJsonSupport";
import Equality from "../Equality.js";
import Preconditions from "../Preconditions.js";
import React from "react";
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference.js";
import SpreadsheetCellFormat from "./SpreadsheetCellFormat";
import SpreadsheetCellReferenceOrLabelName from "./reference/SpreadsheetCellReferenceOrLabelName.js";
import SpreadsheetFormula from "./SpreadsheetFormula";
import SpreadsheetLabelName from "./reference/SpreadsheetLabelName.js";
import SystemObject from "../SystemObject.js";
import TableCell from "@mui/material/TableCell";
import TextNode from "../text/TextNode";
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
     *       "format": "pattern"
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
                const {formula, style, format, formatted} = json[cellReferenceOrLabel];

                return new SpreadsheetCell(
                    SpreadsheetCellReference.isCellReferenceText(cellReferenceOrLabel) ?
                      SpreadsheetCellReference.fromJson(cellReferenceOrLabel) :
                        SpreadsheetLabelName.fromJson(cellReferenceOrLabel),
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
        Preconditions.requireInstance(reference, SpreadsheetCellReferenceOrLabelName, "reference");
        Preconditions.requireInstance(formula, SpreadsheetFormula, "formula");
        Preconditions.requireInstance(style, TextStyle, "style");
        Preconditions.optionalInstance(format, SpreadsheetCellFormat, "format");
        Preconditions.optionalInstance(formatted, TextNode, "formatted");

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
        Preconditions.requireInstance(formula, SpreadsheetFormula, "formula");

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
    renderViewport(defaultStyle, labels) {
        Preconditions.requireInstance(defaultStyle,TextStyle, "defaultStyle");
        Preconditions.requireArray(labels, "labels");

        const style = defaultStyle.merge(this.style());

        const formatted = this.formatted();
        const formattedRender = formatted ? formatted.render() : "";
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

SystemObject.register(TYPE_NAME, SpreadsheetCell.fromJson)