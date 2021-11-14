import SpreadsheetMetadata from "../meta/SpreadsheetMetadata.js";
import SpreadsheetSettingsWidget from "./SpreadsheetSettingsWidget.js";
import SpreadsheetSettingsWidgetHistoryHashTokens from "./SpreadsheetSettingsWidgetHistoryHashTokens.js";
import TextStyle from "../../text/TextStyle.js";

function allRows() {
    return SpreadsheetSettingsWidgetHistoryHashTokens.metadataRows()
        .concat(SpreadsheetSettingsWidgetHistoryHashTokens.spreadsheetDateTimeRows())
        .concat(SpreadsheetSettingsWidgetHistoryHashTokens.spreadsheetNumberRows())
        .concat(SpreadsheetSettingsWidgetHistoryHashTokens.spreadsheetStyleRows())
        .concat(SpreadsheetSettingsWidgetHistoryHashTokens.spreadsheetTextRows());
}

// tests................................................................................................................

function testSectionRowsIsSpreadsheetMetadataOrTextStyleProperty(sectionLabel, rows) {
    test(sectionLabel + " rows is SpreadsheetMetadata or TextStyle properties", () => {
        const missing = rows()
            .concat("Unknown123")
            .filter(property => !(SpreadsheetMetadata.isProperty(property) || TextStyle.properties().indexOf(property) > -1));

        expect(missing).toStrictEqual(["Unknown123"]);
    });
}

testSectionRowsIsSpreadsheetMetadataOrTextStyleProperty("metadata", SpreadsheetSettingsWidgetHistoryHashTokens.metadataRows);
testSectionRowsIsSpreadsheetMetadataOrTextStyleProperty("data/time", SpreadsheetSettingsWidgetHistoryHashTokens.spreadsheetDateTimeRows);
testSectionRowsIsSpreadsheetMetadataOrTextStyleProperty("number", SpreadsheetSettingsWidgetHistoryHashTokens.spreadsheetNumberRows);
testSectionRowsIsSpreadsheetMetadataOrTextStyleProperty("style", SpreadsheetSettingsWidgetHistoryHashTokens.spreadsheetStyleRows);
testSectionRowsIsSpreadsheetMetadataOrTextStyleProperty("text", SpreadsheetSettingsWidgetHistoryHashTokens.spreadsheetTextRows);

test("spreadsheetMetadataPropertyLabel", () => {
    const missing = allRows()
        .filter(property => {
            var filter = false;

            if(SpreadsheetMetadata.properties().indexOf(property) > -1){
                try {
                    SpreadsheetSettingsWidget.spreadsheetMetadataPropertyLabel(property);
                } catch(e) {
                    filter = true;
                }
            }
            return filter;
        });

    expect(missing).toStrictEqual([]);
});

test("spreadsheetMetadataPropertyLabel unnecessary labels", () => {
    const extra = SpreadsheetMetadata.properties()
        .filter(property => {
            var filter = false;

            try {
                SpreadsheetSettingsWidget.spreadsheetMetadataPropertyLabel(property);
                filter = allRows()
                    .indexOf(property) === -1;
            } catch(e) {
            }

            return filter;
        });

    expect(extra).toStrictEqual([]);
});

test("textStylePropertyLabel", () => {
    const missing = allRows()
        .filter(property => {
            var filter = false;

            if(TextStyle.properties().indexOf(property) > -1){
                try {
                    SpreadsheetSettingsWidget.textStylePropertyLabel(property);
                } catch(e) {
                    filter = true;
                }
            }
            return filter;
        });

    expect(missing).toStrictEqual([]);
});

test("textStylePropertyLabel unnecessary labels", () => {
    console.log(JSON.stringify(allRows()));

    const extra = TextStyle.properties()
        .filter(property => {
            var filter = false;

            try {
                SpreadsheetSettingsWidget.textStylePropertyLabel(property);
                filter = allRows()
                    .indexOf(property) === -1;
            } catch(e) {
            }

            return filter;
        });

    expect(extra).toStrictEqual([]);
});