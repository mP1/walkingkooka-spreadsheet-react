/// <reference types="cypress" />

import BorderStyle from "../../src/text/BorderStyle.js";
import ExpressionNumberKind from "../../src/math/ExpressionNumberKind.js";
import FontVariant from "../../src/text/FontVariant.js";
import FontStyle from "../../src/text/FontStyle.js";
import Hyphens from "../../src/text/Hyphens.js";
import RoundingMode from "../../src/math/RoundingMode.js";
import SpreadsheetCellReference from "../../src/spreadsheet/reference/SpreadsheetCellReference.js";
import SpreadsheetMetadata from "../../src/spreadsheet/meta/SpreadsheetMetadata.js";
import SpreadsheetSettingsWidget from "../../src/spreadsheet/settings/SpreadsheetSettingsWidget.js";
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
    "Settings",
    () => {

        const testing = new SpreadsheetTesting(cy);

        // helper that includes some waits to make formula text entry more reliable.
        function formulaTextEnterAndSave(a1Formula) {
            testing.cellFormulaEnterAndSave(A1, a1Formula);
        }

        beforeEach(() => {
            cy.visit('/');

            testing.spreadsheetEmptyReady();
        });

        it("Toggle(Show and hide)", () => {
            settingsToggle();

            settings()
                .should('be.visible');

            testing.hash()
                .should('match', /.*\/.*\/settings/) // => true

            settingsToggle();

            settings()
                .should('be.not.visible');

            testing.hash()
                .should('not.match', /.*\/.*\/settings/);
        });

        it("Hash show settings", () => {
            testing.hashAppend("/settings");

            settings()
                .should('be.visible');
        });

        it("Hash hide settings", () => {
            settingsToggle();

            cy.window()
                .then((win) => {
                    var hash = win.location.hash;
                    win.location.hash = hash.substring(0, hash.length - 1);
                });

            settings()
                .should('be.not.visible');
        });

        it("Toggle hash", () => {
            settingsToggle();

            cy.hash()
                .should("match", /.*\/Untitled\/settings/);
        });

        it("Hash Toggle show then hide", () => {
            settingsToggle();
            settingsToggle();

            cy.hash()
                .should("match", /.*\/Untitled/);
        });

        it("Hash Toggle section and hide", () => {
            cy.window()
                .then((win) => {
                    var hash = win.location.hash;

                    settingsToggle(); // open

                    settingsOpenSectionSpreadsheetMetadataProperty(SpreadsheetMetadata.TWO_DIGIT_YEAR);

                    settingsToggle(); // close

                    settingsToggle(); // open

                    const section = SpreadsheetSettingsWidget.section(SpreadsheetMetadata.TWO_DIGIT_YEAR);
                    cy.get("#settings-spreadsheet-" + section + "-content")
                        .should('be.visible');

                    cy.hash()
                        .should("eq", hash + "/settings/" + section);
                });
        });

        it("Settings show after editing spreadsheet name", () => {
            testing.spreadsheetNameClick();

            testing.spreadsheetName()
                .blur();

            cy.hash()
                .should("matches", /.*\/Untitled/);

            settingsToggle();

            cy.hash()
                .should("matches", /.*\/Untitled\/settings/);
        });

        it("Open hash after Edit cell", () => {
            testing.cellClick(A1);

            settingsToggle();

            cy.hash()
                .should("matches", /.*\/Untitled\/cell\/A1\/settings/);
        });

        it("Metadata check creator-date-time/modified-date-time", () => {
            settingsToggle();

            settingsOpenSectionSpreadsheetMetadataProperty(SpreadsheetMetadata.CREATE_DATE_TIME);

            const year = new Date().getFullYear();

            cy.get("#settings-spreadsheet-metadata-create-date-time")
                .contains(year);

            cy.get("#settings-spreadsheet-metadata-modified-date-time")
                .contains(year);
        });

        /**
         * Opens the spreadsheet settings, types in the given text, and verifies the property.
         * The button is then clicked and the text field is verified.
         */
        function settingsSpreadsheetMetadataPropertyTextAndCheck(property,
                                                                 a1Formula,
                                                                 text,
                                                                 defaultText,
                                                                 updatedA1Formula,
                                                                 a1CellContent,
                                                                 a1CellContentDefault) {
            it("Update SpreadsheetMetadata." + property, () => {
                settingsToggle();

                settingsOpenSectionSpreadsheetMetadataProperty(property);

                const dateParsePatternsId = "#settings-spreadsheet-metadata-" + SpreadsheetMetadata.DATE_PARSE_PATTERNS + "-TextField";
                const dateFormatPatternId = "#settings-spreadsheet-metadata-" + SpreadsheetMetadata.DATE_FORMAT_PATTERN + "-TextField";
                switch(property) {
                    case SpreadsheetMetadata.DEFAULT_YEAR:
                        cy.get(dateParsePatternsId)
                            .type("{selectall}dd:mm{enter}")
                            .blur();

                        cy.get(dateFormatPatternId)
                            .type("{selectall}yyyy/mm/dd{enter}")
                            .blur();
                        break;
                    case SpreadsheetMetadata.TWO_DIGIT_YEAR:
                        cy.get(dateParsePatternsId)
                            .type("{selectall}yy/mm/dd{enter}")
                            .blur();

                        cy.get(dateFormatPatternId)
                            .type("{selectall}yyyy/mm/dd{enter}")
                            .blur();
                        break;
                    default:
                        break;
                }

                if(a1Formula){
                    formulaTextEnterAndSave(a1Formula);
                }

                const textFieldId = "#settings-spreadsheet-metadata-" + property + "-TextField";

                cy.get(textFieldId).then((input) => {
                    // type text and hit ENTER
                    cy.get(textFieldId)
                        .type("{selectall}" + text + "{enter}");

                    cy.get(textFieldId)
                        .should("have.value", text);

                    if(updatedA1Formula){
                        testing.formulaText()
                            .should("have.value", updatedA1Formula)
                    }

                    if(a1Formula){
                        testing.cellFormattedTextCheck(A1, a1CellContent);
                    }

                    // restore original textField value.
                    cy.get(textFieldId)
                        .type("{selectall}" + input.text() + "{enter}");

                    // click default button...
                    const buttonId = "#settings-spreadsheet-metadata-" + property + "-default-Button";
                    cy.get(buttonId)
                        .should("have.text", defaultText)
                        .click();

                    cy.get(textFieldId)
                        .should("have.value", "");

                    if(a1Formula){
                        testing.formulaText()
                            .should("have.value", a1Formula)
                    }

                    if(a1CellContentDefault){
                        testing.cellClick(A1);

                        testing.cellFormattedTextCheck(A1, a1CellContentDefault);
                    }

                    // type text and blur
                    cy.get(textFieldId)
                        .type("{selectall}" + text)
                        .blur();

                    cy.get(textFieldId)
                        .should("have.value", text);

                    if(updatedA1Formula){
                        testing.formulaText()
                            .should("have.value", updatedA1Formula)
                    }

                    if(a1Formula){
                        testing.cellFormattedTextCheck(A1, a1CellContent);
                    }

                    // type text and blur
                    cy.get(textFieldId)
                        .type("{selectall}XYZ{esc}")

                    cy.get(textFieldId)
                        .should("have.value", text);
                });
            });
        }

        /**
         * Opens the spreadsheet settings, selects each value by clicking the slider.
         * TODO Currently no test is made upon the a1 cell contents.
         */
        function settingsSpreadsheetMetadataPropertySliderAndCheck(property,
                                                                   a1Formula,
                                                                   values,
                                                                   a1CellContents) {
            it("Update SpreadsheetMetadata." + property, () => {
                settingsToggle();

                settingsOpenSectionSpreadsheetMetadataProperty(property);

                if(a1Formula){
                    formulaTextEnterAndSave(a1Formula);
                }

                const sliderId = "#settings-spreadsheet-metadata-" + property + "-Slider";

                // the first slow of a Slider is reserved for "Default".
                values.forEach((v, i) => {
                    cy.get(sliderId + " *[data-index=\"" + (1 + i) + "\"][aria-hidden=\"true\"]")
                        .should("have.text", v.nameCapitalCase())
                        .click();

                    if(a1Formula){
                        testing.cellFormattedTextCheck(A1, a1CellContents[i]);
                    }
                });
            });
        }

        /**
         * Opens the spreadsheet settings, selects each value by clicking the slider.
         * TODO Currently no test is made upon the a1 cell contents.
         */
        function settingsSpreadsheetMetadataPropertySliderNumberTextFieldAndCheck(property,
                                                                                  a1Formula,
                                                                                  values,
                                                                                  a1CellContents) {
            it("Update SpreadsheetMetadata." + property, () => {
                settingsToggle();

                settingsOpenSectionSpreadsheetMetadataProperty(property);

                if(a1Formula){
                    formulaTextEnterAndSave(a1Formula);
                }

                const sliderId = "#settings-spreadsheet-metadata-" + property + "-Slider";
                const numberTextFieldId = "#settings-spreadsheet-metadata-" + property + "-NumberTextField";

                // click on the slider and verify number in TextField was updated
                values.forEach((v, i) => {
                    cy.get(sliderId + " *[data-index=\"" + i + "\"][aria-hidden=\"true\"]")
                        .should("have.text", v.text)
                        .click();

                    cy.get(numberTextFieldId)
                        .should("have.value", v.value)
                        .click();

                    if(a1Formula){
                        testing.cellFormattedTextCheck(A1, a1CellContents[i]);
                    }
                });

                // type a number in TextField & verify slider moved.
                values.forEach((v, i) => {
                    console.log("value=" + JSON.stringify(v) + " i=" + i);

                    cy.get(numberTextFieldId)
                        .type("{selectall}" + v.value + "{enter}")
                        .click();

                    cy.get(sliderId + " *[data-index=\"" + i + "\"][aria-hidden=\"true\"]")
                        .should("have.class", "MuiSlider-markLabelActive");

                    if(a1Formula){
                        testing.cellFormattedTextCheck(A1, a1CellContents[i]);
                    }
                });
            });
        }

        /**
         * Opens the spreadsheet settings, selects each value by clicking the drop down list (select).
         * TODO Currently no test is made upon the a1 cell contents.
         */
        function settingsSpreadsheetMetadataPropertyDropDownListAndCheck(property,
                                                                         a1Formula,
                                                                         values,
                                                                         a1CellContents) {
            it("Update SpreadsheetMetadata." + property, () => {
                settingsToggle();

                settingsOpenSectionSpreadsheetMetadataProperty(property);

                if(a1Formula){
                    formulaTextEnterAndSave(a1Formula);
                }

                const dropDownListId = "#settings-spreadsheet-metadata-" + property + "-DropDownList";

                values.forEach((v, i) => {
                    cy.get(dropDownListId)
                        .select(v.toString());

                    cy.get(dropDownListId)
                        .should("have.value", v.toString());

                    if(a1Formula){
                        testing.cellFormattedTextCheck(A1, a1CellContents[i]);
                    }
                });
            });
        }

        settingsSpreadsheetMetadataPropertySliderNumberTextFieldAndCheck(
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

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.DATE_FORMAT_PATTERN,
            "31/12/1999",
            "yyyy/mm/dd",
            "Default",
            "31/12/1999",
            "1999/12/31",
            "Friday, 31 December 1999",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.DATE_PARSE_PATTERNS,
            "1999:12:31",
            "yyyy:mm:dd",
            "Default",
            "1999:12:31",
            "Friday, 31 December 1999",
            "Friday, 31 December 1999",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.DATETIME_FORMAT_PATTERN,
            "31/12/1999, 12:58",
            "hh:mm yyyy/mm/dd",
            "Default",
            "31/12/1999, 12:58",
            "12:58 1999/12/31",
            "Friday, 31 December 1999 at 12:58:00",
        );

        settingsSpreadsheetMetadataPropertySliderNumberTextFieldAndCheck(
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

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.DATETIME_PARSE_PATTERNS,
            "1999/12/31 12:58",
            "yyyy/mm/dd hh:mm",
            "Default",
            "1999/12/31 12:58",
            "Friday, 31 December 1999 at 12:58:00",
            "Friday, 31 December 1999 at 12:58:00",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.DECIMAL_SEPARATOR,
            "=2.5",
            "*",
            ".",
            "=2*5",
            "2*5",
            "2.5",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.DEFAULT_YEAR,
            "31:12",
            "2000",
            "1900",
            "31:12",
            "2000/12/31",
            "1900/12/31",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.EXPONENT_SYMBOL,
            null,
            "x",
            "E",
            null,
            null,
            null
        );

        settingsSpreadsheetMetadataPropertySliderAndCheck(
            SpreadsheetMetadata.EXPRESSION_NUMBER_KIND,
            null,
            ExpressionNumberKind.values(),
            null,
        );


        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.GROUPING_SEPARATOR,
            "123456",
            "*",
            ",",
            "123456",
            "123*456.",
            "123,456."
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.NEGATIVE_SIGN,
            "=2*-4",
            "*",
            "-",
            "=2**4",
            "*8.",
            "-8.");

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.NUMBER_FORMAT_PATTERN,
            "123.5",
            "###.000",
            "Default",
            "123.5",
            "123.500",
            "123.5",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.NUMBER_PARSE_PATTERNS,
            "123.5",
            "###.000",
            "Default",
            "123.5",
            "123.5",
            "123.5",
        );

        // TODO need to set format pattern which includes percentage
        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.PERCENTAGE_SYMBOL,
            null,
            "*",
            "%",
            null,
            null,
            null
        );

        // TODO need to format Exponent
        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.POSITIVE_SIGN,
            "+1.5",
            "*",
            "+",
            "*1.5",
            "1.5",
            "1.5",
        );

        settingsSpreadsheetMetadataPropertySliderNumberTextFieldAndCheck(
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

        settingsSpreadsheetMetadataPropertyDropDownListAndCheck(
            SpreadsheetMetadata.ROUNDING_MODE,
            null,
            RoundingMode.values(),
            null
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.TEXT_FORMAT_PATTERN,
            "=\"Hello 123\"",
            "@@",
            "Default",
            "=\"Hello 123\"",
            "Hello 123Hello 123",
            "Hello 123",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.TEXT_FORMAT_PATTERN,
            "'Hello 123",
            "@@",
            "Default",
            "'Hello 123",
            "Hello 123Hello 123",
            "Hello 123",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.TIME_FORMAT_PATTERN,
            "12:58",
            "hh::mm::",
            "Default",
            "12:58",
            "12::58::",
            "12:58:00",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.TIME_PARSE_PATTERNS,
            "12::58::59.000",
            "hh::mm::ss.000",
            "Default",
            "12::58::59.000",
            "12:58:59",
            "12:58:59",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.TWO_DIGIT_YEAR,
            "30/12/31",
            "50",
            "20",
            "30/12/31",
            "2030/12/31",
            "1930/12/31",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.VALUE_SEPARATOR,
            "=5/2",
            "*",
            ",",
            "=5/2",
            "2.5",
            "2.5",
        );

        /**
         * Updates 2 properties with initial text values, then sets the first to the second text, which should cause
         * the second to gain the former first text.
         */
        function settingsSpreadsheetMetadataPropertyTextSwapCheck(property1,
                                                                  text1,
                                                                  property2,
                                                                  text2) {
            it("Update SpreadsheetMetadata." + property1 + "=" + text1 + " & " + property2 + "=" + text2 + " causing value swap", () => {
                settingsToggle();

                settingsOpenSectionSpreadsheetMetadataProperty(property1);

                const textFieldId1 = "#settings-spreadsheet-metadata-" + property1 + "-TextField";
                cy.get(textFieldId1)
                    .type("{selectall}" + text1)
                    .blur();

                cy.get(textFieldId1)
                    .should("have.value", text1);

                const textFieldId2 = "#settings-spreadsheet-metadata-" + property2 + "-TextField";
                cy.get(textFieldId2)
                    .type("{selectall}" + text2)
                    .blur();

                cy.get(textFieldId2)
                    .should("have.value", text2);

                // set property1 with text2, this should force property2 to have text1
                cy.get(textFieldId1)
                    .type("{selectall}" + text2)
                    .blur();

                cy.get(textFieldId1)
                    .should("have.value", text2);

                cy.get(textFieldId2)
                    .should("have.value", text1);
            });
        }


        settingsSpreadsheetMetadataPropertyTextSwapCheck(
            SpreadsheetMetadata.DECIMAL_SEPARATOR,
            '.',
            SpreadsheetMetadata.GROUPING_SEPARATOR,
            ','
        );

        settingsSpreadsheetMetadataPropertyTextSwapCheck(
            SpreadsheetMetadata.NEGATIVE_SIGN,
            '-',
            SpreadsheetMetadata.PERCENTAGE_SYMBOL,
            '%'
        );

        settingsSpreadsheetMetadataPropertyTextSwapCheck(
            SpreadsheetMetadata.NEGATIVE_SIGN,
            '-',
            SpreadsheetMetadata.POSITIVE_SIGN,
            '+'
        );

        settingsSpreadsheetMetadataPropertyTextSwapCheck(
            SpreadsheetMetadata.DECIMAL_SEPARATOR,
            '-',
            SpreadsheetMetadata.POSITIVE_SIGN,
            '+'
        );

// settings default style...........................................................................................

        function settingsSpreadsheetMetadataStyleColorAndCheck(property, defaultColor) {
            it("Update SpreadsheetMetadata.style." + property, () => {
                settingsToggle();

                settingsOpenSectionSpreadsheetMetadataStyleProperty(property);

                formulaTextEnterAndSave("'ABC");

                const textFieldId = "#settings-spreadsheet-metadata-style-" + property + "-TextField";

                cy.get(textFieldId)
                    .type("{selectall}!BAD")
                    .blur(); // TODO verify alert appears!

                cy.get(textFieldId)
                    .type("{selectall}#123456")
                    .blur();

                testing.cellA1StyleCheck(property, "rgb(18, 52, 86)");

                cy.get(textFieldId)
                    .type("{selectall}#789abc{enter}");

                testing.cellA1StyleCheck(property, "rgb(120, 154, 188)");

                if(defaultColor){
                    const defaultButtonId = "#settings-spreadsheet-metadata-style-" + property + "-default-Button";
                    cy.get(defaultButtonId)
                        .should("have.text", defaultColor)
                        .click();

                    const red = parseInt(defaultColor.substring(1, 3), 16);
                    const green = parseInt(defaultColor.substring(3, 5), 16);
                    const blue = parseInt(defaultColor.substring(5, 7), 16);

                    testing.cellA1StyleCheck(property, "rgb(" + red + ", " + green + ", " + blue + ")");
                }
            });
        }

        function settingsSpreadsheetMetadataStyleSliderAndCheck(property,
                                                                values,
                                                                defaultValue,
                                                                defaultButtonText) {
            it("Update SpreadsheetMetadata.style." + property, () => {
                settingsToggle();

                settingsOpenSectionSpreadsheetMetadataStyleProperty(property);

                formulaTextEnterAndSave("'ABC");

                const sliderId = "#settings-spreadsheet-metadata-style-" + property + "-Slider";

                // the first slot of a Slider is reserved for "Default".
                values.forEach((v, i) => {
                    let skip;
                    switch(property) {
                        case TextStyle.FONT_STYLE:
                        case TextStyle.FONT_VARIANT:
                            skip = i > 0;
                            break;
                        default:
                            skip = true;
                            break;
                    }

                    if(!skip){
                        cy.get(sliderId + " *[data-index=\"" + (1 + i) + "\"][aria-hidden=\"true\"]")
                            //.should("have.text", v.nameCapitalCase()) Element is not visible because it has CSS property: 'position: fixed' and its being covered by another element
                            .click(FORCE_TRUE);

                        testing.cellA1StyleCheck(property, v.toCssValue());
                    }
                });

                if(defaultValue){
                    const defaultButtonId = "#settings-spreadsheet-metadata-style-" + property + "-default-Button";
                    cy.get(defaultButtonId)
                        .should("have.text", defaultButtonText)// @see https://github.com/mP1/walkingkooka-spreadsheet-react/issues/695
                        .click();

                    testing.cellA1StyleCheck(property, defaultValue.toCssValue());
                }
            });
        }

        function settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(property,
                                                                              min,
                                                                              max,
                                                                              defaultValue,
                                                                              defaultButtonText) {
            it("Update SpreadsheetMetadata.style." + property, () => {
                settingsToggle();

                settingsOpenSectionSpreadsheetMetadataStyleProperty(property);

                formulaTextEnterAndSave("'ABC");

                const sliderId = "#settings-spreadsheet-metadata-style-" + property + "-Slider";
                const numberTextFieldId = "#settings-spreadsheet-metadata-style-" + property + "-NumberTextField";

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

                    cy.get(numberTextFieldId)
                        .type("{selectall}" + v.value + "{enter}")
                        .click();

                    cy.get(sliderId + " *[data-index=\"" + i + "\"][aria-hidden=\"true\"]");
                    //     .should("have.class", "MuiSlider-markLabelActive");

                    switch(property) {
                        case TextStyle.WIDTH:
                        case TextStyle.HEIGHT:
                            break;
                        default:
                            testing.cellA1StyleCheck(property, v.value + "px");
                            break;
                    }
                });

                if(null != defaultValue){
                    const defaultButtonId = "#settings-spreadsheet-metadata-style-" + property + "-default-Button";
                    cy.get(defaultButtonId)
                        .should("have.text", defaultButtonText)
                        .click();

                    switch(property) {
                        case TextStyle.WIDTH:
                        case TextStyle.HEIGHT:
                            break;
                        default:
                            testing.cellA1StyleCheck(property, defaultValue);
                            break;
                    }
                }
            });
        }

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BACKGROUND_COLOR,
            "#ffffff"
        );

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BORDER_LEFT_COLOR,
            "#000000"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.BORDER_LEFT_STYLE,
            BorderStyle.values(),
            BorderStyle.SOLID,
            "solid"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.BORDER_LEFT_WIDTH,
            0,
            2,
            "1px",
            "1"
        );

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BORDER_TOP_COLOR,
            "#000000"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.BORDER_TOP_STYLE,
            BorderStyle.values(),
            BorderStyle.SOLID,
            "solid"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.BORDER_TOP_WIDTH,
            0,
            2,
            "1px",
            "1"
        );

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BORDER_RIGHT_COLOR,
            "#000000"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.BORDER_RIGHT_STYLE,
            BorderStyle.values(),
            BorderStyle.SOLID,
            "solid"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.BORDER_RIGHT_WIDTH,
            0,
            2,
            "1px",
            "1"
        );

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BORDER_BOTTOM_COLOR,
            "#000000"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.BORDER_BOTTOM_STYLE,
            BorderStyle.values(),
            BorderStyle.SOLID,
            "solid"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.BORDER_BOTTOM_WIDTH,
            0,
            2,
            "1px",
            "1"
        );

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.COLOR,
            "#000000"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.FONT_STYLE,
            FontStyle.values(),
            FontStyle.NORMAL,
            "normal"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.FONT_VARIANT,
            FontVariant.values(),
            FontVariant.NORMAL,
            "normal"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.HEIGHT,
            21,
            30,
            "30px",
            "30"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.HYPHENS,
            Hyphens.values(),
            Hyphens.NONE,
            "none"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.PADDING_LEFT,
            0,
            2,
            "0px",
            "0"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.PADDING_TOP,
            0,
            2,
            "0px",
            "0"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.PADDING_RIGHT,
            0,
            2,
            "0px",
            "0"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.PADDING_BOTTOM,
            0,
            2,
            "0px",
            "0"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.TEXT_ALIGN,
            TextAlign.values(),
            TextAlign.LEFT,
            "left"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.VERTICAL_ALIGN,
            VerticalAlign.values(),
            VerticalAlign.TOP,
            "top"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.WIDTH,
            70,
            200,
            "100px",
            "100"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.WORD_BREAK,
            WordBreak.values(),
            WordBreak.NORMAL,
            "normal"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.WORD_WRAP,
            WordWrap.values(),
            WordWrap.NORMAL,
            "normal"
        );

        /**
         * The settings that appears on the right containing settings, tools and more.
         */
        function settings() {
            return cy.get("#settings > DIV"); // the #settings remains 1000x0 while the DIV child has an actual height
        }

        /**
         * Opens the settings section that includes the given SpreadsheetMetadata property
         */
        function settingsOpenSectionSpreadsheetMetadataProperty(property) {
            settingsOpenSection(SpreadsheetSettingsWidget.section(property));
        }

        function settingsOpenSectionSpreadsheetMetadataStyleProperty(property) {
            settingsOpenSection(SpreadsheetSettingsWidget.section(property));
        }

        function settingsOpenSection(section) {
            settings();
            //.scrollIntoView() // prevents cypress from complaining about content that is longer than the screen height.
            //.should('be.visible');

            cy.get("#settings-spreadsheet-" + section + "-expand-more-icon")
                .click();

            testing.wait();

            cy.get("#settings-spreadsheet-" + section + "-content");
            //.should('be.visible');

            testing.hash()
                .should('match', new RegExp(".*\/.*\/settings\/" + section)) // => true
        }

        /**
         * Fetches the icon that when clicked toggles the settings
         */
        function settingsToggle() {
            testing.wait();
            cy.get("#settings-icon")
                .click();
        }
    }
);