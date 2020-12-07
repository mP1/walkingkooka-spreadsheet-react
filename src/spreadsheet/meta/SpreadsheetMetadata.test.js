import SpreadsheetMetadata from "./SpreadsheetMetadata";
import SpreadsheetName from "../SpreadsheetName";
import TextStyle from "../../text/TextStyle";
import SpreadsheetCoordinates from "../SpreadsheetCoordinates";
import PixelLength from "../../text/PixelLength";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference";

// EMPTY................................................................................................................

test("Empty", () => {
    const metadata = SpreadsheetMetadata.EMPTY;
    expect(metadata).toBeDefined();

    checkJson(metadata, {});
    checkSpreadsheetId(metadata);
});

// fromJson.............................................................................................................

test("from json missing fails", () => {
    expect(() => SpreadsheetMetadata.fromJson()).toThrow("Missing json");
});

test("from json invalid fails", () => {
    expect(() => SpreadsheetMetadata.fromJson("!invalid")).toThrow("Expected Object json got !invalid");
});

test("from json", () => {
    const json = {};

    const metadata = SpreadsheetMetadata.fromJson(json);

    checkJson(metadata, json);
    checkSpreadsheetId(metadata);
});

test("from json with spreadsheet-id", () => {
    const id = "123f";
    const json = {"spreadsheet-id": id};

    const metadata = SpreadsheetMetadata.fromJson(json);

    checkJson(metadata, json);
    checkSpreadsheetId(metadata, id);
})

test("from json with spreadsheet-name", () => {
    const name = new SpreadsheetName("Spreadsheet-abc-123");
    const json = {"spreadsheet-name": name.toJson()};
    const metadata = SpreadsheetMetadata.fromJson(json);

    checkJson(metadata, json);
    checkSpreadsheetId(metadata);
    checkSpreadsheetName(metadata, name);
})

// setSpreadsheetName...................................................................................................

test("setSpreadsheetName same", () => {
    const name = new SpreadsheetName("old-spreadsheet-name-111");
    const json = {"spreadsheet-name": name.toJson()};

    const metadata = SpreadsheetMetadata.fromJson(json);
    const same = metadata.setSpreadsheetName(name);
    expect(metadata).toEqual(same);

    checkJson(metadata, json);
    checkSpreadsheetName(metadata, name);
})

test("setSpreadsheetName different name", () => {
    const id = "123f";
    const name = new SpreadsheetName("old-spreadsheet-name-111");
    const json = {"spreadsheet-name": name.toJson(), "spreadsheet-id": id};

    const metadata = SpreadsheetMetadata.fromJson(json);

    const newName = new SpreadsheetName("new-spreadsheet-name-222");
    const updated = metadata.setSpreadsheetName(newName);
    expect(metadata == updated).toBeFalsy();

    checkSpreadsheetId(updated, id);
    checkSpreadsheetName(updated, newName);
    checkJson(updated, {"spreadsheet-name": newName.toJson(), "spreadsheet-id": id});

    // original should be unmodified
    checkJson(metadata, json);
    checkSpreadsheetId(metadata, id);
    checkSpreadsheetName(metadata, name);
})

// get..................................................................................................................

test("get property present without defaults", () => {
    const propertyName = "spreadsheet-id";
    const propertyValue = "1234";

    const metadata = new SpreadsheetMetadata({"spreadsheet-id": propertyValue});
    expect(metadata.get(propertyName)).toEqual(propertyValue);
})

test("get property missing without defaults", () => {
    const metadata = new SpreadsheetMetadata({});
    expect(metadata.get("creator")).toBeUndefined();
})

test("get property missing but defaulted", () => {
    const propertyName = "spreadsheet-id";
    const propertyValue = "1234";

    const metadata = SpreadsheetMetadata.fromJson({_defaults: {"spreadsheet-id": propertyValue}});
    expect(metadata.get(propertyName)).toEqual(propertyValue);
})

// set..................................................................................................................

test("set property null fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.set(null, "1234")).toThrow("Missing property");
})

test("set value null fail", () => {
    expect(() => SpreadsheetMetadata.EMPTY.set("spreadsheet-id", null)).toThrow("Missing value");
})

test("set property same", () => {
    const name = new SpreadsheetName("spreadsheet-name-123");
    const metadata = new SpreadsheetMetadata({"spreadsheet-name": name});
    expect(metadata).toEqual(metadata.set("spreadsheet-name", name));
})

test("set property replace different value", () => {
    const propertyValue = new SpreadsheetName("spreadsheet-name-123");
    const metadata = new SpreadsheetMetadata({"spreadsheet-name": propertyValue.toJson()});

    const differentPropertyValue = new SpreadsheetName("different-spreadsheet-name-456");
    const differentMetadata = metadata.set("spreadsheet-name", differentPropertyValue);

    expect(metadata).not.toEqual(differentMetadata);

    checkJson(metadata, {
        "spreadsheet-name": propertyValue.toJson()
    });
    checkJson(differentMetadata,
        {
            "spreadsheet-name": differentPropertyValue.toJson()
        });
})

test("set property different", () => {
    const propertyValue = "spreadsheet-id-123";
    const metadata = new SpreadsheetMetadata({"spreadsheet-id": propertyValue});

    const propertyValue2 = new SpreadsheetName("spreadsheet-name-123");
    const metadata2 = metadata.set("spreadsheet-name", propertyValue2);

    expect(metadata).not.toEqual(metadata2);

    checkJson(metadata,
        {
            "spreadsheet-id": propertyValue
        });
    checkJson(metadata2,
        {
            "spreadsheet-id": propertyValue,
            "spreadsheet-name": propertyValue2.toJson()
        });
})

// edit-cell............................................................................................................

test("get edit-cell missing", () => {
    expect(SpreadsheetMetadata.EMPTY.editCell()).toBeUndefined();
});

test("get edit-cell", () => {
    expect(SpreadsheetMetadata.fromJson({
        "edit-cell": "B97"
    }).editCell()).toEqual(SpreadsheetCellReference.parse("B97"));
});

test("set edit-cell", () => {
    checkJson(SpreadsheetMetadata.EMPTY.setEditCell(SpreadsheetCellReference.parse("B98")),
        {
            "edit-cell": "B98"
        });
});

// spreadsheetId.........................................................................................................

test("get spreadsheet-id", () => {
    const id = "123ABC";

    expect(SpreadsheetMetadata.fromJson({
        "spreadsheet-id": id
    }).spreadsheetId()).toEqual(id);
})

// spreadsheet-name.....................................................................................................

test("get spreadsheet-name", () => {
    const name = "spreadsheet-name-123";

    expect(SpreadsheetMetadata.fromJson({
        "spreadsheet-name": name
    }).spreadsheetName()).toEqual(SpreadsheetName.parse(name));
})

test("set spreadsheet-name", () => {
    const name = SpreadsheetName.parse("spreadsheet-name-123");

    checkJson(SpreadsheetMetadata.EMPTY.setSpreadsheetName(name),
        {
            "spreadsheet-name": name.value()
        });
})

// setStyle.............................................................................................................

test("set style", () => {
    checkJson(SpreadsheetMetadata.EMPTY.setStyle(TextStyle.EMPTY.set("width", "50px")),
        {
            "style": {
                "width": "50px"
            }
        });
})

// viewport-cell............................................................................................................

test("get viewport-cell missing", () => {
    expect(SpreadsheetMetadata.EMPTY.viewportCell()).toBeUndefined();
});

test("get viewport-cell", () => {
    expect(SpreadsheetMetadata.fromJson({
        "viewport-cell": "B97"
    }).viewportCell()).toEqual(SpreadsheetCellReference.parse("B97"));
});

test("set viewport-cell", () => {
    checkJson(SpreadsheetMetadata.EMPTY.setViewportCell(SpreadsheetCellReference.parse("B98")),
        {
            "viewport-cell": "B98"
        });
});

// viewportCoordinates.............................................................................................................

test("get viewport-coordinates", () => {
    expect(SpreadsheetMetadata.fromJson({
        "viewport-coordinates": "123.5,400"
    }).viewportCoordinates()).toEqual(SpreadsheetCoordinates.parse("123.5,400"));
})

test("set viewport-coordinates", () => {
    checkJson(SpreadsheetMetadata.EMPTY.setViewportCoordinates(SpreadsheetCoordinates.parse("123.5,400")),
        {
            "viewport-coordinates": "123.5,400"
        });
})

// set..................................................................................................................

test("all setters & getters", () => {
    const name = new SpreadsheetName("Spreadsheet-name-123");
    const style = TextStyle.EMPTY
        .set("width", PixelLength.parse("123px"));
    const coords = new SpreadsheetCoordinates(12, 34);
    const viewportCell = SpreadsheetCellReference.parse("A99");

    const metadata = SpreadsheetMetadata.EMPTY
        .setSpreadsheetName(name)
        .setStyle(style)
        .setViewportCell(viewportCell)
        .setViewportCoordinates(coords);

    expect(metadata.spreadsheetName()).toEqual(name);
    expect(metadata.style()).toEqual(style);
    expect(metadata.viewportCell()).toEqual(viewportCell);
    expect(metadata.viewportCoordinates()).toEqual(coords);
});

// defaults..............................................................................................................

test("defaults", () => {
    const propertyValue = "1234";
    const defaultJson = {"spreadsheet-name": propertyValue};

    const metadata = SpreadsheetMetadata.fromJson({_defaults: defaultJson});
    const defaultMetadata = metadata.defaults();
    expect(defaultMetadata).toEqual(SpreadsheetMetadata.fromJson(defaultJson));
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
    const metadata = SpreadsheetMetadata.fromJson({});
    const same = metadata.setDefaults(SpreadsheetMetadata.EMPTY);
    expect(same).toEqual(metadata);
})

test("set defaults same 2", () => {
    const defaultMetadata = SpreadsheetMetadata.fromJson({"spreadsheet-id": "123"});
    const withDefaults = SpreadsheetMetadata.fromJson({_defaults: defaultMetadata.toJson()})
    const same = withDefaults.setDefaults(defaultMetadata);
    expect(same).toEqual(withDefaults);
})

test("set defaults different", () => {
    const firstValue = "1";
    const withDefaults = SpreadsheetMetadata.fromJson({_defaults: {"spreadsheet-id": firstValue}});

    const differentValue = "2";
    const different = SpreadsheetMetadata.fromJson({_defaults: {"spreadsheet-id": differentValue}});

    const withDifferent = withDefaults.setDefaults(different);
    expect(different).not.toEqual(withDefaults);

    const propertyName = "spreadsheet-id";
    expect(withDefaults.get(propertyName)).toEqual(firstValue);
    expect(withDifferent.get(propertyName)).toEqual(differentValue);
})

// isEmpty..............................................................................................................

test("isEmpty EMPTY", () => {
    expect(SpreadsheetMetadata.EMPTY.isEmpty()).toEqual(true);
});

test("isEmpty empty 2", () => {
    expect(SpreadsheetMetadata.fromJson({}).isEmpty()).toEqual(true);
});

test("isEmpty not empty", () => {
    expect(SpreadsheetMetadata.fromJson({"spreadsheet-id": "1"}).isEmpty()).toEqual(false);
});

// equals...............................................................................................................

test("equals undefined false", () => {
    expect(SpreadsheetMetadata.EMPTY.equals()).toEqual(false);
});

test("equals null false", () => {
    expect(SpreadsheetMetadata.EMPTY.equals(null)).toEqual(false);
});

test("equals different property values", () => {
    expect(SpreadsheetMetadata.fromJson({
        "spreadsheet-id": "111",
    }).equals(SpreadsheetMetadata.fromJson({
        "spreadsheet-id": "222",
    }))).toEqual(false);
});

test("equals different property values", () => {
    expect(SpreadsheetMetadata.fromJson({
        "spreadsheet-id": "111",
        "spreadsheet-name": "Spreadsheet-name-567",
    }).equals(SpreadsheetMetadata.fromJson({
        "spreadsheet-id": "222",
        "spreadsheet-name": "different-Spreadsheet-name",
    }))).toEqual(false);
});

test("equals different property values with defaults", () => {
    expect(SpreadsheetMetadata.fromJson({
        "spreadsheet-id": "111",
        "_defaults": {
            "spreadsheet-name": "Spreadsheet-name-567",
        }
    }).equals(SpreadsheetMetadata.fromJson({
        "spreadsheet-id": "222",
        "_defaults": {
            "spreadsheet-name": "different-Spreadsheet-name",
        }
    }))).toEqual(false);
});

test("equals self true", () => {
    expect(SpreadsheetMetadata.EMPTY.equals(SpreadsheetMetadata.EMPTY)).toEqual(true);
});

test("equals same property values", () => {
    expect(SpreadsheetMetadata.fromJson({
        "spreadsheet-id": "1234",
        "spreadsheet-name": "Spreadsheet-name-567",
    }).equals(SpreadsheetMetadata.fromJson({
        "spreadsheet-id": "1234",
        "spreadsheet-name": "Spreadsheet-name-567",
    }))).toEqual(true);
});

test("equals same property values with defaults", () => {
    expect(SpreadsheetMetadata.fromJson({
        "spreadsheet-id": "111",
        "_defaults": {
            "spreadsheet-name": "Spreadsheet-name-567",
        }
    }).equals(SpreadsheetMetadata.fromJson({
        "spreadsheet-id": "111",
        "_defaults": {
            "spreadsheet-name": "Spreadsheet-name-567",
        }
    }))).toEqual(true);
});

// helpers..............................................................................................................

function checkSpreadsheetId(metadata, id) {
    if (id) {
        expect(metadata.spreadsheetId()).toBe(id);
    } else {
        expect(() => metadata.spreadsheetId()).toThrow("Missing \"spreadsheet-id\" " + metadata.toString());
    }
}

function checkSpreadsheetName(metadata, name) {
    expect(metadata.spreadsheetName()).toStrictEqual(name);
}

// checks toJson and toString
function checkJson(metadata, json) {
    expect(metadata.toJson()).toStrictEqual(json);
    expect(metadata.toString()).toBe(JSON.stringify(json));
}
