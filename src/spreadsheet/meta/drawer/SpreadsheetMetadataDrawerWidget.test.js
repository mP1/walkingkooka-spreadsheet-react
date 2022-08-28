import SpreadsheetMetadata from "../SpreadsheetMetadata.js";
import SpreadsheetMetadataDrawerWidget from "./SpreadsheetMetadataDrawerWidget.js";
import SpreadsheetMetadataDrawerWidgetHistoryHashTokens from "./SpreadsheetMetadataDrawerWidgetHistoryHashTokens.js";
import TextStyle from "../../../text/TextStyle.js";

function allRows() {
    return SpreadsheetMetadataDrawerWidgetHistoryHashTokens.metadataRows()
        .concat(SpreadsheetMetadataDrawerWidgetHistoryHashTokens.spreadsheetDateTimeRows())
        .concat(SpreadsheetMetadataDrawerWidgetHistoryHashTokens.spreadsheetNumberRows())
        .concat(SpreadsheetMetadataDrawerWidgetHistoryHashTokens.spreadsheetStyleRows())
        .concat(SpreadsheetMetadataDrawerWidgetHistoryHashTokens.spreadsheetTextRows());
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

testSectionRowsIsSpreadsheetMetadataOrTextStyleProperty("metadata", SpreadsheetMetadataDrawerWidgetHistoryHashTokens.metadataRows);
testSectionRowsIsSpreadsheetMetadataOrTextStyleProperty("data/time", SpreadsheetMetadataDrawerWidgetHistoryHashTokens.spreadsheetDateTimeRows);
testSectionRowsIsSpreadsheetMetadataOrTextStyleProperty("number", SpreadsheetMetadataDrawerWidgetHistoryHashTokens.spreadsheetNumberRows);
testSectionRowsIsSpreadsheetMetadataOrTextStyleProperty("style", SpreadsheetMetadataDrawerWidgetHistoryHashTokens.spreadsheetStyleRows);
testSectionRowsIsSpreadsheetMetadataOrTextStyleProperty("text", SpreadsheetMetadataDrawerWidgetHistoryHashTokens.spreadsheetTextRows);

test("spreadsheetMetadataPropertyLabel", () => {
    const missing = allRows()
        .filter(property => {
            var filter = false;

            if(SpreadsheetMetadata.properties().indexOf(property) > -1){
                try {
                    SpreadsheetMetadataDrawerWidget.spreadsheetMetadataPropertyLabel(property);
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
                SpreadsheetMetadataDrawerWidget.spreadsheetMetadataPropertyLabel(property);
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
                    SpreadsheetMetadataDrawerWidget.textStylePropertyLabel(property);
                } catch(e) {
                    filter = true;
                }
            }
            return filter;
        });

    expect(missing).toStrictEqual([]);
});

test("textStylePropertyLabel unnecessary labels", () => {
    const extra = TextStyle.properties()
        .filter(property => {
            var filter = false;

            try {
                SpreadsheetMetadataDrawerWidget.textStylePropertyLabel(property);
                filter = allRows()
                    .indexOf(property) === -1;
            } catch(e) {
            }

            return filter;
        });

    expect(extra).toStrictEqual([]);
});