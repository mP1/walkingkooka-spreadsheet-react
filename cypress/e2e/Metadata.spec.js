/// <reference types="cypress" />

import BorderStyle from "../../src/text/BorderStyle.js";
import CharSequences from "../../src/CharSequences.js";
import ExpressionNumberKind from "../../src/math/ExpressionNumberKind.js";
import Hyphens from "../../src/text/Hyphens.js";
import RoundingMode from "../../src/math/RoundingMode.js";
import SpreadsheetCellReference from "../../src/spreadsheet/reference/cell/SpreadsheetCellReference.js";
import SpreadsheetMetadata from "../../src/spreadsheet/meta/SpreadsheetMetadata.js";
import SpreadsheetMetadataDrawerWidget from "../../src/spreadsheet/meta/drawer/SpreadsheetMetadataDrawerWidget.js";
import SpreadsheetTesting from "./SpreadsheetTesting.js";
import TextAlign from "../../src/text/TextAlign.js";
import TextStyle from "../../src/text/TextStyle.js";
import VerticalAlign from "../../src/text/VerticalAlign.js";
import WordBreak from "../../src/text/WordBreak.js";
import WordWrap from "../../src/text/WordWrap.js";

const FORCE_TRUE = {
    force: true,
};

const A1 = SpreadsheetCellReference.parse("A1");

describe(
    "Metadata",
    () => {

        const testing = new SpreadsheetTesting(cy);

        // helper that includes some waits to make formula text entry more reliable.
        function formulaTextEnterAndSave(a1Formula) {
            testing.cellFormulaEnterAndSave(A1, a1Formula);

            testing.cellClick(A1);
        }

        beforeEach(() => {
            cy.visit('/');

            testing.spreadsheetEmptyReady();
        });

        it("Toggle(Show and hide)", () => {
            metadataToggle();

            metadata()
                .should('be.visible');

            testing.hash()
                .should("match", /^#\/.*\/.*\/metadata$/) // => true

            metadataToggle();

            metadata()
                .should('be.not.visible');

            testing.hash()
                .should('not.match', /^#\/.*\/.*\/metadata$/);
        });

        it("Hash show metadata", () => {
            testing.hashAppend("/metadata");

            metadata()
                .should('be.visible');
        });

        it("Hash hide metadata", () => {
            metadataToggle();

            cy.window()
                .then((win) => {
                    var hash = win.location.hash;
                    win.location.hash = hash.substring(0, hash.length - 1);
                });

            metadata()
                .should('be.not.visible');
        });

        it("Toggle hash, verify accordions collapsed", () => {
            metadataToggle();

            cy.hash()
                .should("match", /^#\/.*\/Untitled\/metadata$/);

            metadata()
                .should("contains.text", "Metadata")
                .should("contains.text", "Text")
                .should("contains.text", "Number")
                .should("contains.text", "style");
        });

        it("Hash Toggle show then hide", () => {
            metadataToggle();
            metadataToggle();

            cy.hash()
                .should("match", /^#\/.*\/Untitled$/);
        });

        it("Metadata check creator-date-time/modified-date-time", () => {
            metadataProperty(SpreadsheetMetadata.CREATE_DATE_TIME);

            const year = new Date().getFullYear();

            testing.metadataProperty(SpreadsheetMetadata.CREATE_DATE_TIME)
                .contains(year);

            testing.metadataProperty(SpreadsheetMetadata.MODIFIED_DATE_TIME)
                .contains(year);
        });

        /**
         * Opens the spreadsheet metadata, types in the given text, and verifies the property.
         * The button is then clicked and the text field is verified.
         */
        function metadataPropertyTextAndCheck(property,
                                              a1Formula,
                                              text,
                                              defaultText,
                                              updatedA1Formula,
                                              a1CellContent,
                                              a1CellContentDefault) {
            it("Update SpreadsheetMetadata." + property, () => {
                // prepare date-parse & date format patterns ......
                var dateParsePattern = null;
                var dateFormatPattern = null;
                switch(property) {
                    case SpreadsheetMetadata.DEFAULT_YEAR:
                        dateParsePattern = "dd:mm";
                        dateFormatPattern = "yyyy/mm/dd";
                        break;
                    case SpreadsheetMetadata.TWO_DIGIT_YEAR:
                        dateParsePattern = "yy/mm/dd";
                        dateFormatPattern = "yyyy/mm/dd";
                        break;
                    default:
                        break;
                }

                if(dateParsePattern){
                    cy.log("prepare date-parse-pattern " + CharSequences.quoteAndEscape(dateParsePattern) + " & date-format-pattern=" + CharSequences.quoteAndEscape(dateFormatPattern));

                    metadataProperty(SpreadsheetMetadata.DATE_PARSE_PATTERNS);

                    testing.metadataProperty(SpreadsheetMetadata.DATE_PARSE_PATTERNS, "-TextField")
                        .click();

                    testing.metadataProperty(SpreadsheetMetadata.DATE_PARSE_PATTERNS, "-TextField")
                        .type("{selectall}" + dateParsePattern + "{enter}");

                    testing.metadataProperty(SpreadsheetMetadata.DATE_FORMAT_PATTERN, "-TextField")
                        .click();

                    testing.metadataProperty(SpreadsheetMetadata.DATE_FORMAT_PATTERN, "-TextField")
                        .type("{selectall}" + dateFormatPattern + "{enter}");

                    metadataToggle();
                }

                // enter formula
                if(a1Formula){
                    formulaTextEnterAndSave(a1Formula);
                }

                // update metadata property
                metadataProperty(property);

                const textFieldId = SpreadsheetMetadataDrawerWidget.propertyId(property) + "-TextField";
                testing.getById(textFieldId)
                    .then((input) => {
                        const textBackup = input.text();

                        // type text and hit ENTER
                        testing.getById(textFieldId)
                            .click();

                        testing.getById(textFieldId)
                            .type("{selectall}" + text + "{enter}");

                        testing.getById(textFieldId)
                            .should("have.value", text);

                        if(updatedA1Formula){
                            testing.formulaTextLoadWait();
                            testing.formulaText()
                                .should("have.value", updatedA1Formula)
                        }

                        if(a1Formula){
                            testing.cellFormattedTextCheck(A1, a1CellContent);
                        }

                        // restore original textField value.
                        testing.getById(textFieldId)
                            .type("{selectall}" + textBackup + "{enter}");

                        testing.metadataWait();

                        // click default button...
                        testing.metadataProperty(property, "-default-Button")
                            .should("have.text", defaultText)
                            .click();

                        testing.metadataWait();

                        testing.getById(textFieldId)
                            .should("have.value", "");

                        // TODO typing on formula closes metadata!!!!

                        if(a1Formula){
                            testing.formulaTextLoadWait();
                            testing.formulaText()
                                .should("have.value", a1Formula)
                        }

                        if(a1CellContentDefault){
                            testing.cellFormattedTextCheck(A1, a1CellContentDefault);
                        }

                        // type text and blur
                        testing.getById(textFieldId)
                            .click();

                        testing.getById(textFieldId)
                            .type("{selectall}" + text + "{enter}");

                        testing.metadataWait();

                        testing.getById(textFieldId)
                            .should("have.value", text);

                        if(updatedA1Formula){
                            testing.formulaTextLoadWait();
                            testing.formulaText()
                                .should("have.value", updatedA1Formula)
                        }

                        if(a1Formula){
                            testing.cellFormattedTextCheck(A1, a1CellContent);
                        }

                        // type text and ESC which should reset
                        testing.getById(textFieldId)
                            .type("{selectall}XYZ{esc}")

                        testing.getById(textFieldId)
                            .should("have.value", text);
                    });
            });
        }

        /**
         * Opens the spreadsheet metadata, selects each value by clicking the slider.
         * TODO Currently no test is made upon the a1 cell contents.
         */
        function metadataPropertySliderAndCheck(property,
                                                a1Formula,
                                                values,
                                                a1CellContents,
                                                defaultButtonText,
                                                defaultA1) {
            it("Update SpreadsheetMetadata." + property, () => {
                if(a1Formula){
                    formulaTextEnterAndSave(a1Formula);
                }
                metadataProperty(property);

                const sliderId = SpreadsheetMetadataDrawerWidget.propertyId(property) + "-Slider";

                if(defaultButtonText){
                    testing.cellFormattedTextCheck(A1, defaultA1);
                }

                const valueOffset = defaultButtonText ? 1 : 0;

                // the first slow of a Slider is reserved for "Default".
                values.forEach((v, i) => {
                    cy.log("=" + i + " " + JSON.stringify(v) + " " + (valueOffset + i) + " " + v.nameCapitalCase() + "!!" + JSON.stringify(values));

                    testing.metadataWait();

                    cy.get("#" + sliderId + " *[data-index=\"" + (valueOffset + i) + "\"][aria-hidden=\"true\"]")
                        .should("have.text", v.nameCapitalCase())
                        .click();

                    testing.metadataWait();
                    cy.get("#" + sliderId + " *[role=slider]")
                        .should("have.focus");

                    if(a1Formula){
                        testing.cellFormattedTextCheck(A1, a1CellContents[i]);
                    }
                });

                if(defaultA1){
                    testing.metadataProperty(property, "-default-Button")
                        .should("have.text", defaultButtonText)
                        .click();

                    testing.metadataWait();

                    testing.cellFormattedTextCheck(A1, defaultA1);

                    // the slider mark-0 should have text=Default
                    cy.get("#" + sliderId + " *[data-index=\"0\"][aria-hidden=\"true\"]")
                        .should("have.text", "Default")
                        .click();

                    testing.metadataWait();
                    cy.get("#" + sliderId + " *[role=slider]")
                        .should("have.focus");

                    testing.metadataWait();

                    testing.cellFormattedTextCheck(A1, defaultA1);
                }
            });
        }

        /**
         * Opens the spreadsheet metadata, selects each value by clicking the slider.
         * TODO Currently no test is made upon the a1 cell contents.
         */
        function metadataPropertySliderNumberTextFieldAndCheck(property,
                                                               a1Formula,
                                                               values,
                                                               a1CellContents) {
            it("Update SpreadsheetMetadata." + property, () => {
                if(a1Formula){
                    formulaTextEnterAndSave(a1Formula);
                }

                metadataProperty(property);

                const baseId = SpreadsheetMetadataDrawerWidget.propertyId(property);
                const sliderId = baseId + "-Slider";
                const numberTextFieldId = baseId + "-NumberTextField";

                // click on the slider and verify number in TextField was updated
                values.forEach((v, i) => {
                    cy.log("@" + JSON.stringify(v) + " =" + i);

                    cy.get("#" + sliderId + " *[data-index=\"" + i + "\"][aria-hidden=\"true\"]")
                        .should("have.text", v.text)
                        .click();

                    testing.metadataWait();

                    testing.getById(numberTextFieldId)
                        .should("have.value", v.value)
                        .click();

                    testing.metadataWait();

                    if(a1Formula){
                        testing.cellFormattedTextCheck(A1, a1CellContents[i]);
                    }
                });

                // type a number in TextField & verify slider moved.
                values.forEach((v, i) => {
                    if(v.value.length > 2){
                        return;
                    }

                    testing.getById(numberTextFieldId)
                        .type("{selectall}" + v.value + "{enter}", {force: true});

                    testing.metadataWait();

                    cy.get("#" + sliderId + " *[data-index=\"" + i + "\"][aria-hidden=\"true\"]")
                        .should("have.class", "MuiSlider-markLabelActive");

                    if(a1Formula){
                        testing.cellFormattedTextCheck(A1, a1CellContents[i]);
                    }
                });
            });
        }

        /**
         * Opens the spreadsheet metadata, selects each value by clicking the drop down list (select).
         * TODO Currently no test is made upon the a1 cell contents.
         */
        function metadataPropertyDropDownListAndCheck(property,
                                                      a1Formula,
                                                      values,
                                                      a1CellContents) {
            it("Update SpreadsheetMetadata." + property, () => {
                if(a1Formula){
                    formulaTextEnterAndSave(a1Formula);
                }

                metadataProperty(property);

                const dropDownListId = SpreadsheetMetadataDrawerWidget.propertyId(property) + "-DropDownList";

                values.forEach((v, i) => {
                    testing.historyWait();

                    testing.getById(dropDownListId)
                        .select(v.toString());

                    testing.getById(dropDownListId)
                        .should("have.value", v.toString());

                    if(a1Formula){
                        testing.cellFormattedTextCheck(A1, a1CellContents[i]);
                    }
                });
            });
        }

        metadataPropertySliderNumberTextFieldAndCheck(
            SpreadsheetMetadata.CELL_CHARACTER_WIDTH,
            null,
            [
                {
                    value: "1",
                    text: "1",
                },
                {
                    value: "10",
                    text: "10",
                },
                {
                    value: "20",
                    text: "20",
                },
            ],
            null
        );

        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.DATE_FORMAT_PATTERN,
            "31/12/1999",
            "yyyy/mm/dd",
            "Default",
            "31/12/1999",
            "1999/12/31",
            "Friday, 31 December 1999",
        );

        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.DATE_PARSE_PATTERNS,
            "1999:12:31",
            "yyyy:mm:dd",
            "Default",
            "1999:12:31",
            "Friday, 31 December 1999",
            "Friday, 31 December 1999",
        );

        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.DATETIME_FORMAT_PATTERN,
            "31/12/1999, 12:58",
            "hh:mm yyyy/mm/dd",
            "Default",
            "31/12/1999, 12:58",
            "12:58 1999/12/31",
            "Friday, 31 December 1999 at 12:58:00",
        );

        metadataPropertySliderNumberTextFieldAndCheck(
            SpreadsheetMetadata.DATETIME_OFFSET,
            null,
            [
                {
                    value: "-25569",
                    text: "1900",
                },
                {
                    value: "-24107",
                    text: "1904",
                },
            ],
            null
        );

        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.DATETIME_PARSE_PATTERNS,
            "1999/12/31 12:58",
            "yyyy/mm/dd hh:mm",
            "Default",
            "1999/12/31 12:58",
            "Friday, 31 December 1999 at 12:58:00",
            "Friday, 31 December 1999 at 12:58:00",
        );

        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.DECIMAL_SEPARATOR,
            "=2.5",
            "*",
            ".",
            "=2*5",
            "2*5",
            "2.5",
        );

        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.DEFAULT_YEAR,
            "31:12",
            "2000",
            "1900",
            "31:12",
            "2000/12/31",
            "1900/12/31",
        );

        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.EXPONENT_SYMBOL,
            null,
            "x",
            "E",
            null,
            null,
            null
        );

        metadataPropertySliderAndCheck(
            SpreadsheetMetadata.EXPRESSION_NUMBER_KIND,
            null,
            ExpressionNumberKind.values(),
            null,
            "Double",
            ""
        );

        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.GROUPING_SEPARATOR,
            "123456",
            "*",
            ",",
            "123456",
            "123*456.",
            "123,456."
        );

        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.NEGATIVE_SIGN,
            "=2*-4",
            "*",
            "-",
            "=2**4",
            "*8.",
            "-8.");

        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.NUMBER_FORMAT_PATTERN,
            "123.5",
            "###.000",
            "Default",
            "123.5",
            "123.500",
            "123.5",
        );

        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.NUMBER_PARSE_PATTERNS,
            "123.5",
            "###.000",
            "Default",
            "123.5",
            "123.5",
            "123.5",
        );

        // TODO need to set format pattern which includes percentage
        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.PERCENTAGE_SYMBOL,
            null,
            "*",
            "%",
            null,
            null,
            null
        );

        // TODO need to format Exponent
        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.POSITIVE_SIGN,
            "+1.5",
            "*",
            "+",
            "*1.5",
            "1.5",
            "1.5",
        );

        metadataPropertySliderNumberTextFieldAndCheck(
            SpreadsheetMetadata.PRECISION,
            null,
            [
                {
                    value: "0",
                    text: "∞",
                },
                {
                    value: "32",
                    text: "32",
                },
                {
                    value: "64",
                    text: "64",
                },
                {
                    value: "128",
                    text: "128",
                }
            ],
            null
        );

        metadataPropertyDropDownListAndCheck(
            SpreadsheetMetadata.ROUNDING_MODE,
            null,
            RoundingMode.values(),
            null
        );

        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.TEXT_FORMAT_PATTERN,
            "=\"Hello 123\"",
            "@@",
            "Default",
            "=\"Hello 123\"",
            "Hello 123Hello 123",
            "Hello 123",
        );

        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.TEXT_FORMAT_PATTERN,
            "'Hello 123",
            "@@",
            "Default",
            "'Hello 123",
            "Hello 123Hello 123",
            "Hello 123",
        );

        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.TIME_FORMAT_PATTERN,
            "12:58",
            "hh::mm::",
            "Default",
            "12:58",
            "12::58::",
            "12:58:00",
        );

        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.TIME_PARSE_PATTERNS,
            "12::58::59.000",
            "hh::mm::ss.000",
            "Default",
            "12::58::59.000",
            "12:58:59",
            "12:58:59",
        );

        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.TWO_DIGIT_YEAR,
            "30/12/31",
            "50",
            "20",
            "30/12/31",
            "2030/12/31",
            "1930/12/31",
        );

        metadataPropertyTextAndCheck(
            SpreadsheetMetadata.VALUE_SEPARATOR,
            "=5/2",
            "*",
            ",",
            "=5/2",
            "2.5",
            "2.5",
        );

        // metadata style...............................................................................................

        function metadataSpreadsheetMetadataStyleColorAndCheck(property, defaultColor) {
            it("Update SpreadsheetMetadata.style." + property, () => {
                formulaTextEnterAndSave("'ABC");

                metadataProperty(property);

                const textFieldId = SpreadsheetMetadataDrawerWidget.propertyId(property) + "-TextField";

                testing.getById(textFieldId)
                    .type("{selectall}#123456{enter}");

                testing.cellA1StyleCheck(property, "rgb(18, 52, 86)");

                testing.getById(textFieldId)
                    .type("{selectall}#789abc{enter}");

                testing.cellA1StyleCheck(property, "rgb(120, 154, 188)");

                if(defaultColor){
                    testing.metadataProperty(property, "-default-Button")
                        .should("have.text", defaultColor)
                        .click();

                    const red = parseInt(defaultColor.substring(1, 3), 16);
                    const green = parseInt(defaultColor.substring(3, 5), 16);
                    const blue = parseInt(defaultColor.substring(5, 7), 16);

                    testing.cellA1StyleCheck(property, "rgb(" + red + ", " + green + ", " + blue + ")");
                }
            });
        }

        function metadataSpreadsheetMetadataStyleSliderAndCheck(property,
                                                                values,
                                                                defaultValue,
                                                                defaultButtonText) {
            it("Update SpreadsheetMetadata.style." + property, () => {
                formulaTextEnterAndSave("'ABC");

                metadataProperty(property);

                const sliderId = SpreadsheetMetadataDrawerWidget.propertyId(property) + "-Slider";
                const defaultOffset = defaultButtonText ? 1 : 0;

                // the first slot of a Slider is reserved for "Default".
                values.forEach((v, i) => {
                    testing.metadataWait();

                    cy.get("#" + sliderId + " *[data-index=\"" + (defaultOffset + i) + "\"][aria-hidden=\"true\"]")
                        //.should("have.text", v.nameCapitalCase()) Element is not visible because it has CSS property: 'position: fixed' and its being covered by another element
                        .click(FORCE_TRUE);

                    testing.metadataWait();

                    testing.cellA1StyleCheck(property, v.toCssValue());
                });

                if(defaultValue){
                    testing.metadataProperty(property, "-default-Button")
                        .should("have.text", defaultButtonText)// @see https://github.com/mP1/walkingkooka-spreadsheet-react/issues/695
                        .click();

                    testing.cellA1StyleCheck(property, defaultValue.toCssValue());
                }
            });
        }

        function metadataSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(property,
                                                                              min,
                                                                              max,
                                                                              defaultValue,
                                                                              defaultText) {
            it("Update SpreadsheetMetadata.style." + property, () => {
                formulaTextEnterAndSave("'ABC");

                metadataProperty(property);

                const sliderId = SpreadsheetMetadataDrawerWidget.propertyId(property) + "-Slider";
                const numberTextFieldId = SpreadsheetMetadataDrawerWidget.propertyId(property) + "-NumberTextField";

                // type a number in TextField & verify slider moved.
                const values = [
                    {
                        value: min,
                        text: "" + min,
                    },
                    {
                        value: max,
                        text: "" + max,
                    }
                ];

                values.forEach((v, i) => {
                    console.log("value=" + JSON.stringify(v) + " i=" + i);

                    testing.getById(numberTextFieldId)
                        .type("{selectall}" + v.value + "{enter}")
                        .click();

                    cy.get("#" + sliderId + " *[data-index=\"" + i + "\"][aria-hidden=\"true\"]");
                    //     .should("have.class", "MuiSlider-markLabelActive");

                    switch(property) {
                        case TextStyle.WIDTH:
                        case TextStyle.HEIGHT:
                            break;
                        default:
                            //testing.cellA1StyleCheck(property, v.value + "px");
                            break;
                    }
                });

                if(defaultText){
                    testing.metadataProperty(property, "-default-Button")
                        .should("have.text", defaultText)
                        .click();

                    switch(property) {
                        case TextStyle.WIDTH:
                        case TextStyle.HEIGHT:
                            break;
                        default:
                            //testing.cellA1StyleCheck(property, defaultValue);
                            break;
                    }
                }
            });
        }

        metadataSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BACKGROUND_COLOR,
            "#ffffff"
        );

        metadataSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BORDER_LEFT_COLOR,
            "#000000"
        );

        metadataSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.BORDER_LEFT_STYLE,
            BorderStyle.values(),
            BorderStyle.SOLID,
            "solid"
        );

        metadataSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.BORDER_LEFT_WIDTH,
            0,
            2,
            "1px",
            "1px"
        );

        metadataSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BORDER_TOP_COLOR,
            "#000000"
        );

        metadataSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.BORDER_TOP_STYLE,
            BorderStyle.values(),
            BorderStyle.SOLID,
            "solid"
        );

        metadataSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.BORDER_TOP_WIDTH,
            0,
            2,
            "1px",
            "1px"
        );

        metadataSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BORDER_RIGHT_COLOR,
            "#000000"
        );

        metadataSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.BORDER_RIGHT_STYLE,
            BorderStyle.values(),
            BorderStyle.SOLID,
            "solid"
        );

        metadataSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.BORDER_RIGHT_WIDTH,
            0,
            2,
            "1px",
            "1px"
        );

        metadataSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BORDER_BOTTOM_COLOR,
            "#000000"
        );

        metadataSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.BORDER_BOTTOM_STYLE,
            BorderStyle.values(),
            BorderStyle.SOLID,
            "solid"
        );

        metadataSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.BORDER_BOTTOM_WIDTH,
            0,
            2,
            "1px",
            "1px"
        );

        metadataSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.COLOR,
            "#000000"
        );

        metadataSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.HEIGHT,
            21,
            30,
            "30px",
            "30px"
        );

        metadataSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.HYPHENS,
            Hyphens.values(),
            Hyphens.NONE,
            "none"
        );

        metadataSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.PADDING_LEFT,
            0,
            2,
            "0px",
            "none"
        );

        metadataSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.PADDING_TOP,
            0,
            2,
            "0px",
            "none"
        );

        metadataSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.PADDING_RIGHT,
            0,
            2,
            "0px",
            "none"
        );

        metadataSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.PADDING_BOTTOM,
            0,
            2,
            "0px",
            "none"
        );

        metadataSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.TEXT_ALIGN,
            TextAlign.values(),
            TextAlign.LEFT,
            "left"
        );

        metadataSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.VERTICAL_ALIGN,
            VerticalAlign.values(),
            VerticalAlign.TOP,
            "top"
        );

        metadataSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.WIDTH,
            70,
            200,
            "100px",
            "100px"
        );

        metadataSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.WORD_BREAK,
            WordBreak.values(),
            WordBreak.NORMAL,
            "normal"
        );

        metadataSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.WORD_WRAP,
            WordWrap.values(),
            WordWrap.NORMAL,
            "normal"
        );

        it("Tabbing accordions", () => {
            metadataToggle();

            metadata()
                .should('be.visible');

            testing.hash()
                .should("match", /^#\/.*\/.*\/metadata$/);

            testing.metadata()
                .should("have.focus")
                .tab();

            testing.metadataWait();

            testing.hash()
                .should("match", /^#\/.*\/.*\/metadata\/metadata$/);

            testing.metadataAccordion("metadata")
                .should("have.focus")
                .tab();

            testing.metadataWait();

            testing.hash()
                .should("match", /^#\/.*\/.*\/metadata\/text$/);

            testing.metadataAccordion("text")
                .should("have.focus")
                .tab();

            testing.metadataWait();

            testing.hash()
                .should("match", /^#\/.*\/.*\/metadata\/number$/);

            testing.metadataAccordion("number")
                .should("have.focus")
                .tab();

            testing.metadataWait();

            testing.hash()
                .should("match", /^#\/.*\/.*\/metadata\/date-time$/);

            testing.metadataAccordion("date-time")
                .should("have.focus")
                .tab();

            testing.metadataWait();

            testing.hash()
                .should("match", /^#\/.*\/.*\/metadata\/style$/);


            testing.metadataAccordion("style")
                .should("have.focus")
                .tab();

            testing.metadataWait();

            testing.hash()
                .should("match", /^#\/.*\/.*$/);
        });

        it("Tabbing metadata", () => {
            metadataToggle();

            testing.hash()
                .should("match", /^#\/.*\/.*\/metadata$/) // => true

            tabAccordion("metadata");
        });

        it("Tabbing text", () => {
            metadataToggle();

            testing.hash()
                .should("match", /^#\/.*\/.*\/metadata$/) // => true

            //tabAccordion("metadata", false);

            tabAccordion("text", false);

            tabColor(TextStyle.COLOR);
            tabSlider(TextStyle.TEXT_ALIGN);
            tabSlider(TextStyle.HYPHENS);
            tabSlider(TextStyle.VERTICAL_ALIGN);
            tabSlider(TextStyle.WORD_BREAK);
            tabSlider(TextStyle.WORD_WRAP);
            tabSlider(SpreadsheetMetadata.TEXT_FORMAT_PATTERN);

            tabNumberSlider(SpreadsheetMetadata.CELL_CHARACTER_WIDTH);
        });

        it("Tabbing number", () => {
            metadataToggle();

            testing.hash()
                .should("match", /^#\/.*\/.*\/metadata$/);

            tabAccordion("number");

            tabSlider(SpreadsheetMetadata.EXPRESSION_NUMBER_KIND);
            tabNumberSlider(SpreadsheetMetadata.PRECISION);
            tabDropdown(SpreadsheetMetadata.ROUNDING_MODE);
            tabText(SpreadsheetMetadata.CURRENCY_SYMBOL);
            tabText(SpreadsheetMetadata.DECIMAL_SEPARATOR);
            tabText(SpreadsheetMetadata.EXPONENT_SYMBOL);
            tabText(SpreadsheetMetadata.GROUPING_SEPARATOR);
            tabText(SpreadsheetMetadata.NEGATIVE_SIGN);
            tabText(SpreadsheetMetadata.PERCENTAGE_SYMBOL);
            tabText(SpreadsheetMetadata.POSITIVE_SIGN);
            tabText(SpreadsheetMetadata.NUMBER_FORMAT_PATTERN);
            tabText(SpreadsheetMetadata.NUMBER_PARSE_PATTERNS);
            tabText(SpreadsheetMetadata.VALUE_SEPARATOR);
        });

        it("Tabbing date-time", () => {
            metadataToggle();

            testing.hash()
                .should("match", /^#\/.*\/.*\/metadata$/);

            tabAccordion("date-time");

            tabNumberSlider(SpreadsheetMetadata.DATETIME_OFFSET);
            tabNumber(SpreadsheetMetadata.DEFAULT_YEAR);
            tabNumber(SpreadsheetMetadata.TWO_DIGIT_YEAR);
            tabText(SpreadsheetMetadata.DATE_FORMAT_PATTERN);
            tabText(SpreadsheetMetadata.DATE_PARSE_PATTERNS);
            tabText(SpreadsheetMetadata.DATETIME_FORMAT_PATTERN);
            tabText(SpreadsheetMetadata.DATETIME_PARSE_PATTERNS);
            tabText(SpreadsheetMetadata.TIME_FORMAT_PATTERN);
            tabText(SpreadsheetMetadata.TIME_PARSE_PATTERNS);
        });

        it("Tabbing style", () => {
            metadataToggle();

            testing.hash()
                .should("match", /^#\/.*\/.*\/metadata$/);

            tabAccordion("style");

            tabColor(TextStyle.BACKGROUND_COLOR);

            tabNumberSlider(TextStyle.WIDTH);
            tabNumberSlider(TextStyle.HEIGHT);

            tabColor(TextStyle.BORDER_LEFT_COLOR);
            tabSlider(TextStyle.BORDER_LEFT_STYLE);
            tabNumberSlider(TextStyle.BORDER_LEFT_WIDTH);

            tabColor(TextStyle.BORDER_TOP_COLOR);
            tabSlider(TextStyle.BORDER_TOP_STYLE);
            tabNumberSlider(TextStyle.BORDER_TOP_WIDTH);

            tabColor(TextStyle.BORDER_RIGHT_COLOR);
            tabSlider(TextStyle.BORDER_RIGHT_STYLE);
            tabNumberSlider(TextStyle.BORDER_RIGHT_WIDTH);

            tabColor(TextStyle.BORDER_BOTTOM_COLOR);
            tabSlider(TextStyle.BORDER_BOTTOM_STYLE);
            tabNumberSlider(TextStyle.BORDER_BOTTOM_WIDTH);

            tabNumberSlider(TextStyle.PADDING_LEFT);
            tabNumberSlider(TextStyle.PADDING_TOP);
            tabNumberSlider(TextStyle.PADDING_RIGHT);
            tabNumberSlider(TextStyle.PADDING_BOTTOM);
        });

        function tabAccordion(accordion, twice) {
            testing.metadataWait();

            // open accordion
            testing.metadataAccordion(accordion)
                .click();

            testing.metadataWait();

            if(twice){
                testing.metadataAccordion(accordion)
                    .click();

                testing.metadataWait();
            }

            testing.hash()
                .should("match", new RegExp(".*\/.*\/metadata\/" + accordion));

            // tab
            testing.metadataAccordion(accordion)
                .first()
                .tab()
        }

        function tabColor(property) {
            tabText(property);
        }

        function tabDropdown(property) {
            tabProperty(property, "DropDownList");
        }

        function tabNumber(property) {
            tabProperty(property, "TextField");
        }

        function tabSlider(property) {
            testing.metadataWait();

            testing.hash()
                .should("match", new RegExp(".*\/.*\/metadata\/" + property));

            testing.focused()
                .scrollIntoView()
                .tab();

            const id = SpreadsheetMetadataDrawerWidget.propertyId(property);

            testing.focused()
                .should("have.attr", "id", id + "-default-Button")
                .tab();
        }

        function tabText(property) {
            tabProperty(property, "TextField");

            testing.metadataWait();
        }

        function tabProperty(property, componentType) {
            testing.metadataWait();

            testing.hash()
                .should("match", new RegExp(".*\/.*\/metadata\/" + property));

            const id = SpreadsheetMetadataDrawerWidget.propertyId(property);

            // eg $id-TextField
            testing.focused()
                .scrollIntoView()
                .should("have.attr", "id", id + "-" + componentType)
                .tab();

            // $id-default-Button
            testing.focused()
                .should("have.attr", "id", id + "-default-Button")
                .tab();
        }

        function tabNumberSlider(property) {
            testing.metadataWait();

            testing.hash()
                .should("match", new RegExp(".*\/.*\/metadata\/" + property));

            testing.focused()
                .scrollIntoView()
                //.should("have.attr", "id", id + "-NumberTextField")
                .type(" ")
                .tab();

            testing.focused()
                .tab();

            const id = SpreadsheetMetadataDrawerWidget.propertyId(property);

            testing.focused()
                .should("have.attr", "id", id + "-default-Button")
                .tab();
        }

        it("Edit spreadsheet name then toggle metadata", () => {
            testing.spreadsheetNameClick();

            testing.spreadsheetName()
                .blur();

            cy.hash()
                .should("matches", /^#\/.*\/Untitled$/);

            metadataToggle();

            cy.hash()
                .should("matches", /^#\/.*\/Untitled\/metadata$/);
        });

        it("Edit cell then toggle metadata", () => {
            testing.cellClick(A1);

            metadataToggle();

            cy.hash()
                .should("matches", /^#\/.*\/Untitled\/cell\/A1\/metadata$/);
        });

        /**
         * The metadata that appears on the right containing metadata, tools and more.
         */
        function metadata() {
            return cy.get("#" + SpreadsheetMetadataDrawerWidget.ID + " > DIV"); // the #metadata remains 1000x0 while the DIV child has an actual height
        }

        /**
         * Opens the metadata accordion for the given metadata property.
         */
        function metadataProperty(property) {
            testing.hashAppend("/metadata/" + property);

            testing.metadataWait();
        }

        /**
         * Fetches the icon that when clicked toggles the metadata
         */
        function metadataToggle() {
            cy.get("#" + SpreadsheetMetadataDrawerWidget.ID + "-icon")
                .click();

            testing.metadataWait();
        }
    }
);