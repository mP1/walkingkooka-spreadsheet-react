import SpreadsheetMetadata from "./SpreadsheetMetadata";

test("Empty", () => {
    const metadata = SpreadsheetMetadata.EMPTY;
    expect(metadata).toBeDefined();

    checkJson(metadata, {});
    checkSpreadsheetId(metadata);
    checkSpreadsheetName(metadata);
});

test("from json", () => {
    const json = {};

    const metadata = new SpreadsheetMetadata(json);

    checkJson(metadata, json);
    checkSpreadsheetId(metadata);
    checkSpreadsheetName(metadata);
});

test("from json with metadata-id", () => {
    const id = "123f";
    const json = {"metadata-id": id};

    const metadata = new SpreadsheetMetadata(json);

    checkJson(metadata, json);
    checkSpreadsheetId(metadata, id);
    checkSpreadsheetName(metadata);
})

test("from json with metadata-name", () => {
    const name = "Spreadsheet-abc-123";
    const json = {"metadata-name": name};
    const metadata = new SpreadsheetMetadata(json);

    checkJson(metadata, json);
    checkSpreadsheetId(metadata);
    checkSpreadsheetName(metadata, name);
})

test("setSpreadsheetName same", () => {
    const name = "old-metadata-name-111";
    const json = {"metadata-name": name};

    const metadata = new SpreadsheetMetadata(json);
    const same = metadata.setSpreadsheetName(name);
    expect(metadata).toEqual(same);

    checkJson(metadata, json);
    checkSpreadsheetName(metadata, name);
})

test("setSpreadsheetName different name", () => {
    const id = "123f";
    const name = "old-metadata-name-111";
    const json = {"metadata-name": name, "metadata-id": id};

    const metadata = new SpreadsheetMetadata(json);

    const newName = "new-metadata-name-222";
    const updated = metadata.setSpreadsheetName(newName);
    expect(metadata == updated).toBeFalsy();

    checkSpreadsheetId(updated, id);
    checkSpreadsheetName(updated, newName);
    checkJson(updated, {"metadata-name": newName, "metadata-id": id});

    // original should be unmodified
    checkJson(metadata, json);
    checkSpreadsheetId(metadata, id);
    checkSpreadsheetName(metadata, name);
})

// get..................................................................................................................

test("property present without defaults", () => {
    const propertyName = "creator";
    const propertyValue = "user1@example.com";

    const metadata = new SpreadsheetMetadata({"creator": propertyValue});
    expect(metadata.get(propertyName)).toEqual(propertyValue);
})

test("property missing without defaults", () => {
    const metadata = new SpreadsheetMetadata({});
    expect(metadata.get("creator")).toBeUndefined();
})

test("property missing but defaulted", () => {
    const propertyName = "creator";
    const propertyValue = "user1@example.com";

    const metadata = new SpreadsheetMetadata({_defaults: {"creator": propertyValue}});
    expect(metadata.get(propertyName)).toEqual(propertyValue);
})

// defaults..............................................................................................................

test("defaults", () => {
    const propertyValue = "user1@example.com";
    const defaultJson = {"creator": propertyValue};

    const metadata = new SpreadsheetMetadata({_defaults: defaultJson});
    const defaultMetadata = metadata.defaults();
    expect(defaultMetadata).toEqual(new SpreadsheetMetadata(defaultJson));
})

test("set defaults missing fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.setDefaults(null)).toThrow("Missing SpreadsheetMetadata");
})

test("set defaults wrong type fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.setDefaults(1.5)).toThrow("Expected SpreadsheetMetadata got 1.5");
})

test("set defaults EMPTY", () => {
    const metadata = SpreadsheetMetadata.EMPTY;
    const same = metadata.setDefaults(SpreadsheetMetadata.EMPTY);
    expect(same).toEqual(metadata);
})

test("set defaults same", () => {
    const metadata = new SpreadsheetMetadata({});
    const same = metadata.setDefaults(SpreadsheetMetadata.EMPTY);
    expect(same).toEqual(metadata);
})

test("set defaults same 2", () => {
    const defaultMetadata = new SpreadsheetMetadata({"creator": "user1@example.com"});
    const withDefaults = new SpreadsheetMetadata({_defaults: defaultMetadata.toJson()})
    const same = withDefaults.setDefaults(defaultMetadata);
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

function checkSpreadsheetId(metadata, id) {
    if (id) {
        expect(metadata.spreadsheetId()).toBe(id);
    } else {
        expect(() => metadata.spreadsheetId()).toThrow("Missing \"metadata-id\" " + metadata.toString());
    }
}

function checkSpreadsheetName(metadata, name) {
    expect(metadata.metadataName()).toBe(name);
}

// checks toJson and toString
function checkJson(metadata, json) {
    expect(metadata.toObject()).toEqual(json);
    expect(metadata.toJson()).toStrictEqual(json);
    expect(metadata.toString()).toBe(JSON.stringify(json));
}
