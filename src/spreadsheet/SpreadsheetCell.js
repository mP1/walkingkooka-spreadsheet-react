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
        if (!json) {
            throw new Error("Missing json");
        }

        const keys = Object.keys(json);
        switch (keys.length) {
            case 0:
                throw new Error("Missing reference");
            case 1:
                const reference = keys[0];
                const {formula, style, format, formatted} = json[reference];

                return new SpreadsheetCell(SpreadsheetCellReference.fromJson(reference),
                    SpreadsheetFormula.fromJson(formula),
                    style && TextStyle.fromJson(style),
                    format && SpreadsheetCellFormat.fromJson(format),
                    formatted && textNodeJsonSupportFromJson(formatted));
            default:
                throw new Error("Expected only reference got " + JSON.stringify(json));
        }
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

        return this.formula() === formula ?
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
        const {formulaValue, styleValue, formatValue, formattedValue} = this;

        let json2 = {
            formula: formulaValue.toJson()
        };

        if (styleValue) {
            json2.style = styleValue.toJson();
        }

        if (formatValue) {
            json2.format = formatValue.toJson();
        }

        if (formattedValue) {
            json2.formatted = formattedValue.toJson();
        }

        const json = {};
        json[this.reference().toJson()] = json2;
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