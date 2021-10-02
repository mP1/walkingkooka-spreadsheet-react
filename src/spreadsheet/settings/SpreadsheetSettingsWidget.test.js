import SpreadsheetMetadata from "../meta/SpreadsheetMetadata.js";
import SpreadsheetSettingsWidget from "./SpreadsheetSettingsWidget.js";
import TextStyle from "../../text/TextStyle.js";

function allRows() {
    return SpreadsheetSettingsWidget.metadataRows()
        .concat(SpreadsheetSettingsWidget.spreadsheetDateTimeRows())
        .concat(SpreadsheetSettingsWidget.spreadsheetNumberRows())
        .concat(SpreadsheetSettingsWidget.spreadsheetStyleRows())
        .concat(SpreadsheetSettingsWidget.spreadsheetTextRows());
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

testSectionRowsIsSpreadsheetMetadataOrTextStyleProperty("metadata", SpreadsheetSettingsWidget.metadataRows);
testSectionRowsIsSpreadsheetMetadataOrTextStyleProperty("data/time", SpreadsheetSettingsWidget.spreadsheetDateTimeRows);
testSectionRowsIsSpreadsheetMetadataOrTextStyleProperty("number", SpreadsheetSettingsWidget.spreadsheetNumberRows);
testSectionRowsIsSpreadsheetMetadataOrTextStyleProperty("style", SpreadsheetSettingsWidget.spreadsheetStyleRows);
testSectionRowsIsSpreadsheetMetadataOrTextStyleProperty("text", SpreadsheetSettingsWidget.spreadsheetTextRows);

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