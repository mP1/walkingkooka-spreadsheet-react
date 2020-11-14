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

test("from json with spreadsheet-id", () => {
    const id = "123f";
    const json = {"spreadsheet-id": id};

    const metadata = new SpreadsheetMetadata(json);

    checkJson(metadata, json);
    checkSpreadsheetId(metadata, id);
    checkSpreadsheetName(metadata);
})

test("from json with spreadsheet-name", () => {
    const name = "Spreadsheet-abc-123";
    const json = {"spreadsheet-name": name};
    const metadata = new SpreadsheetMetadata(json);

    checkJson(metadata, json);
    checkSpreadsheetId(metadata);
    checkSpreadsheetName(metadata, name);
})

test("setSpreadsheetName same", () => {
    const name = "old-spreadsheet-name-111";
    const json = {"spreadsheet-name": name};

    const metadata = new SpreadsheetMetadata(json);
    const same = metadata.setSpreadsheetName(name);
    expect(metadata).toEqual(same);

    checkJson(metadata, json);
    checkSpreadsheetName(metadata, name);
})

test("setSpreadsheetName different name", () => {
    const id = "123f";
    const name = "old-spreadsheet-name-111";
    const json = {"spreadsheet-name": name, "spreadsheet-id": id};

    const metadata = new SpreadsheetMetadata(json);

    const newName = "new-spreadsheet-name-222";
    const updated = metadata.setSpreadsheetName(newName);
    expect(metadata == updated).toBeFalsy();

    checkSpreadsheetId(updated, id);
    checkSpreadsheetName(updated, newName);
    checkJson(updated, {"spreadsheet-name": newName, "spreadsheet-id": id});

    // original should be unmodified
    checkJson(metadata, json);
    checkSpreadsheetId(metadata, id);
    checkSpreadsheetName(metadata, name);
})

// get..................................................................................................................

test("get property present without defaults", () => {
    const propertyName = "creator";
    const propertyValue = "user1@example.com";

    const metadata = new SpreadsheetMetadata({"creator": propertyValue});
    expect(metadata.get(propertyName)).toEqual(propertyValue);
})

test("get property missing without defaults", () => {
    const metadata = new SpreadsheetMetadata({});
    expect(metadata.get("creator")).toBeUndefined();
})

test("get property missing but defaulted", () => {
    const propertyName = "creator";
    const propertyValue = "user1@example.com";

    const metadata = new SpreadsheetMetadata({_defaults: {"creator": propertyValue}});
    expect(metadata.get(propertyName)).toEqual(propertyValue);
})

// get..................................................................................................................

test("set property null fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.set(null, "user1@example.com")).toThrow("Missing property");
})

test("set value null fail", () => {
    expect(() => SpreadsheetMetadata.EMPTY.set("creator", null)).toThrow("Missing value");
})

test("set property same", () => {
    const metadata = new SpreadsheetMetadata({"creator": "user1@example.com"});
    expect(metadata).toEqual(metadata.set("creator", "user1@example.com"));
})

test("set property replace different value", () => {
    const propertyValue = "user1@example.com";
    const metadata = new SpreadsheetMetadata({"creator": "user1@example.com"});

    const differentPropertyValue = "different@example.com";
    const differentMetadata = metadata.set("creator", differentPropertyValue);

    expect(metadata).not.toEqual(differentMetadata);

    checkJson(metadata, {
        "creator": propertyValue
    });
    checkJson(differentMetadata,
        {
            "creator": differentPropertyValue
        });
})

test("set property different", () => {
    const propertyValue = "user1@example.com";
    const metadata = new SpreadsheetMetadata({"creator": propertyValue});

    const propertyValue2 = "user2@example.com";
    const metadata2 = metadata.set("modified", propertyValue2);

    expect(metadata).not.toEqual(metadata2);

    checkJson(metadata,
        {
            "creator": propertyValue
        });
    checkJson(metadata2,
        {
            "creator": propertyValue,
            "modified": propertyValue2
        });
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
        expect(() => metadata.spreadsheetId()).toThrow("Missing \"spreadsheet-id\" " + metadata.toString());
    }
}

function checkSpreadsheetName(metadata, name) {
    expect(metadata.spreadsheetName()).toBe(name);
}

// checks toJson and toString
function checkJson(metadata, json) {
    expect(metadata.toObject()).toEqual(json);
    expect(metadata.toJson()).toStrictEqual(json);
    expect(metadata.toString()).toBe(JSON.stringify(json));
}
