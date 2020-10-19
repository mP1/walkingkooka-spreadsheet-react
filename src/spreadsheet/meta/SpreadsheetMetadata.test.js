import SpreadsheetMetadata from "./SpreadsheetMetadata";

test("Empty", () => {
    const spreadsheet = SpreadsheetMetadata.EMPTY;
    expect(spreadsheet).toBeDefined();

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

// get..................................................................................................................

test("property present without defaults", () => {
    const propertyName = "creator";
    const propertyValue = "user1@example.com";

    const spreadsheet = new SpreadsheetMetadata({"creator": propertyValue});
    expect(spreadsheet.get(propertyName)).toEqual(propertyValue);
})

test("property missing without defaults", () => {
    const spreadsheet = new SpreadsheetMetadata({});
    expect(spreadsheet.get("creator")).toBeUndefined();
})

test("property missing but defaulted", () => {
    const propertyName = "creator";
    const propertyValue = "user1@example.com";

    const spreadsheet = new SpreadsheetMetadata({_defaults: {"creator": propertyValue}});
    expect(spreadsheet.get(propertyName)).toEqual(propertyValue);
})

// defaults..............................................................................................................

test("defaults", () => {
    const propertyValue = "user1@example.com";
    const defaultJson = {"creator": propertyValue};

    const spreadsheet = new SpreadsheetMetadata({_defaults: defaultJson});
    const defaultSpreadsheetMetadata = spreadsheet.defaults();
    expect(defaultSpreadsheetMetadata).toEqual(new SpreadsheetMetadata(defaultJson));
})

test("set defaults EMPTY", () => {
    const spreadsheet = SpreadsheetMetadata.EMPTY;
    const same = spreadsheet.setDefaults(SpreadsheetMetadata.EMPTY);
    expect(same).toEqual(spreadsheet);
})

test("set defaults same", () => {
    const spreadsheet = new SpreadsheetMetadata({});
    const same = spreadsheet.setDefaults(SpreadsheetMetadata.EMPTY);
    expect(same).toEqual(spreadsheet);
})

test("set defaults same 2", () => {
    const defaultSpreadsheetMetadata = new SpreadsheetMetadata({"creator": "user1@example.com"});
    const withDefaults = new SpreadsheetMetadata({_defaults: defaultSpreadsheetMetadata.toJson()})
    const same = withDefaults.setDefaults(defaultSpreadsheetMetadata);
    expect(same).toEqual(withDefaults);
})

test("set defaults different", () => {
    const firstValue = "user1@example.com";
    const withDefaults = new SpreadsheetMetadata({_defaults: {"creator": firstValue}});

    const differentValue = "different@example.com";
    const different = new SpreadsheetMetadata({_defaults: {"creator": differentValue}});

    const withDifferent = withDefaults.setDefaults(different);
    expect(different).not.toEqual(withDefaults);

    const propertyName = "creator";
    expect(withDefaults.get(propertyName)).toEqual(firstValue);
    expect(withDifferent.get(propertyName)).toEqual(differentValue);
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
