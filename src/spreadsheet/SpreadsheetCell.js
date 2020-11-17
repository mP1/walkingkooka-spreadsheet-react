import textNodeJsonSupportFromJson from "../text/TextNodeJsonSupport";
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference";
import SpreadsheetFormula from "./SpreadsheetFormula";
import TextStyle from "../text/TextStyle";
import SpreadsheetCellFormat from "./SpreadsheetCellFormat";
import TextNode from "../text/TextNode";

/**
 * Represents a spreadsheet cell only reference and formula are required.
 */
export default class SpreadsheetCell {

    static fromJson(json) {
        if (!json) {
            throw new Error("Missing json");
        }

        const {reference, formula, style, format, formatted} = json;

        return new SpreadsheetCell(SpreadsheetCellReference.fromJson(reference),
            SpreadsheetFormula.fromJson(formula),
            style && TextStyle.fromJson(style),
            format && SpreadsheetCellFormat.fromJson(format),
            formatted && textNodeJsonSupportFromJson(formatted));
    }

    constructor(reference, formula, style, format, formatted) {
        if (!reference) {
            throw new Error("Missing reference");
        }
        if (!(reference instanceof SpreadsheetCellReference)) {
            throw new Error("Expected SpreadsheetCellReference reference got " + reference);
        }
        checkFormula(formula);
        if (style && !(style instanceof TextStyle)) {
            throw new Error("Expected TextStyle style got " + style);
        }
        if (format && !(format instanceof SpreadsheetCellFormat)) {
            throw new Error("Expected SpreadsheetCellFormat format got " + format);
        }
        if (formatted && !(formatted instanceof TextNode)) {
            throw new Error("Expected TextNode formatted got " + formatted);
        }

        this.referenceValue = reference;
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

        return this.formula() == formula ?
            this:
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
        const {referenceValue, formulaValue, styleValue, formatValue, formattedValue} = this;
        let json = {
            reference: referenceValue.toJson(),
            formula: formulaValue.toJson()
        };

        if (styleValue) {
            json.style = styleValue.toJson();
        }

        if (formatValue) {
            json.format = formatValue.toJson();
        }

        if (formattedValue) {
            json.formatted = formattedValue.toJson();
        }

        return json;
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

function checkFormula(formula) {
    if (!formula) {
        throw new Error("Missing formula");
    }
    if (!(formula instanceof SpreadsheetFormula)) {
        throw new Error("Expected SpreadsheetFormula formula got " + formula);
    }
}