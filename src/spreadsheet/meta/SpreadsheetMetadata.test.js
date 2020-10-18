import SpreadsheetMetadata from "./SpreadsheetMetadata";

test("Empty", () => {
    const spreadsheet = SpreadsheetMetadata.EMPTY;

    checkJson(spreadsheet, {});
    checkSpreadsheetId(spreadsheet);
    checkSpreadsheetName(spreadsheet);
});

test("from json", () => {
    const json = {};

    const spreadsheet = new SpreadsheetMetadata(json);

    checkJson(spreadsheet, json);
    checkSpreadsheetId(spreadsheet);
    checkSpreadsheetName(spreadsheet);
});

test("from json with spreadsheet-id", () => {
    const id = "123f";
    const json = {"spreadsheet-id": id};

    const spreadsheet = new SpreadsheetMetadata(json);

    checkJson(spreadsheet, json);
    checkSpreadsheetId(spreadsheet, id);
    checkSpreadsheetName(spreadsheet);
})

test("from json with spreadsheet-name", () => {
    const name = "Spreadsheet-abc-123";
    const json = {"spreadsheet-name": name};
    const spreadsheet = new SpreadsheetMetadata(json);

    checkJson(spreadsheet, json);
    checkSpreadsheetId(spreadsheet);
    checkSpreadsheetName(spreadsheet, name);
})

test("setSpreadsheetName same", () => {
    const name = "old-spreadsheet-name-111";
    const json = {"spreadsheet-name": name};

    const spreadsheet = new SpreadsheetMetadata(json);
    const same = spreadsheet.setSpreadsheetName(name);
    expect(spreadsheet).toEqual(same);

    checkJson(spreadsheet, json);
    checkSpreadsheetName(spreadsheet, name);
})

test("setSpreadsheetName different name", () => {
    const id = "123f";
    const name = "old-spreadsheet-name-111";
    const json = {"spreadsheet-name": name, "spreadsheet-id": id};

    const spreadsheet = new SpreadsheetMetadata(json);

    const newName = "new-spreadsheet-name-222";
    const updated = spreadsheet.setSpreadsheetName(newName);
    expect(spreadsheet == updated).toBeFalsy();

    checkSpreadsheetId(updated, id);
    checkSpreadsheetName(updated, newName);
    checkJson(updated, {"spreadsheet-name": newName, "spreadsheet-id": id});

    // original should be unmodified
    checkJson(spreadsheet, json);
    checkSpreadsheetId(spreadsheet, id);
    checkSpreadsheetName(spreadsheet, name);
})

// helpers..............................................................................................................

function checkSpreadsheetId(spreadsheet, id) {
    if(id) {
        expect(spreadsheet.spreadsheetId()).toBe(id);
    } else {
        expect(() => spreadsheet.spreadsheetId()).toThrow("Missing \"spreadsheet-id\" " + spreadsheet.toString());
    }
}

function checkSpreadsheetName(spreadsheet, name) {
    expect(spreadsheet.spreadsheetName()).toBe(name);
}

// checks toJson and toString
function checkJson(spreadsheet, json) {
    expect(spreadsheet.toObject()).toEqual(json);
    expect(spreadsheet.toJson()).toStrictEqual(json);
    expect(spreadsheet.toString()).toBe(JSON.stringify(json));
}
