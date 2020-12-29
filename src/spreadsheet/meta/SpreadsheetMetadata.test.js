import EmailAddress from "../../net/EmailAddress.js";
import LocalDateTime from "../../datetime/LocalDateTime.js";
import PixelLength from "../../text/PixelLength";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference";
import SpreadsheetCoordinates from "../SpreadsheetCoordinates";
import SpreadsheetMetadata from "./SpreadsheetMetadata";
import SpreadsheetName from "../SpreadsheetName";
import TextStyle from "../../text/TextStyle";

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

test("from json all properties", () => {
    SpreadsheetMetadata.fromJson({
        "color-0": "#000000",
        "color-1": "#000001",
        "color-10": "#00000a",
        "color-11": "#00000b",
        "color-12": "#00000c",
        "color-13": "#00000d",
        "color-14": "#00000e",
        "color-15": "#00000f",
        "color-16": "#000010",
        "color-17": "#000011",
        "color-18": "#000012",
        "color-19": "#000013",
        "color-2": "#000002",
        "color-20": "#000014",
        "color-21": "#000015",
        "color-22": "#000016",
        "color-23": "#000017",
        "color-24": "#000018",
        "color-25": "#000019",
        "color-26": "#00001a",
        "color-27": "#00001b",
        "color-28": "#00001c",
        "color-29": "#00001d",
        "color-3": "#000003",
        "color-30": "#00001e",
        "color-31": "#00001f",
        "color-32": "#000020",
        "color-33": "#000021",
        "color-4": "#000004",
        "color-5": "#000005",
        "color-6": "#000006",
        "color-7": "#000007",
        "color-8": "#000008",
        "color-9": "#000009",
        "create-date-time": "2000-12-31T12:58:59",
        "creator": "creator@example.com",
        "currency-symbol": "$AUD",
        "date-format-pattern": "DD/MM/YYYY",
        "date-parse-patterns": "DD/MM/YYYYDDMMYYYY",
        "date-time-format-pattern": "DD/MM/YYYY hh:mm",
        "date-time-offset": "0",
        "date-time-parse-patterns": "DD/MM/YYYY hh:mmDDMMYYYYHHMMDDMMYYYY HHMM",
        "decimal-separator": "D",
        "exponent-symbol": "E",
        "expression-number-kind": "DOUBLE",
        "grouping-separator": "G",
        "locale": "en-AU",
        "modified-by": "modified@example.com",
        "modified-date-time": "1999-12-31T12:58:59",
        "negative-sign": "N",
        "number-format-pattern": "#0.0",
        "number-parse-patterns": "#0.0$#0.00",
        "percentage-symbol": "P",
        "positive-sign": "O",
        "precision": 123,
        "rounding-mode": "FLOOR",
        "spreadsheet-id": "7b",
        "text-format-pattern": "@@",
        "time-format-pattern": "hh:mm",
        "time-parse-patterns": "hh:mmhh:mm:ss.000",
        "two-digit-year": 31,
        "width": 10
    });
});

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

test("set invalid value fail", () => {
    expect(() => SpreadsheetMetadata.EMPTY.set("spreadsheet-id", 123)).toThrow("Expected string property spreadsheet-id with value 123");
});

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

test("set spreadsheet-id", () => {
    const metadata = SpreadsheetMetadata.EMPTY.set("spreadsheet-id", "123");
    checkJson(metadata, {
        "spreadsheet-id": "123",
    });
});

// set..................................................................................................................

test("remove property missing fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.remove()).toThrow("Missing property");
});

test("remove property invalid fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.remove(123)).toThrow("Expected string property got 123");
});

test("remove property unknown fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.remove("!unknown")).toThrow("Unknown property \"!unknown\"");
});

test("remove absent property", () => {
    const metadata = SpreadsheetMetadata.EMPTY;
    expect(metadata).toEqual(metadata.remove(SpreadsheetMetadata.EDIT_CELL));
});

test("remove absent property #2", () => {
    const metadata = SpreadsheetMetadata.EMPTY
        .set(SpreadsheetMetadata.SPREADSHEET_NAME, new SpreadsheetName("spreadsheet-name-123"));
    expect(metadata).toEqual(metadata.remove(SpreadsheetMetadata.EDIT_CELL));
});

test("remove property", () => {
    const editCell = SpreadsheetCellReference.parse("Z9");
    const metadata = SpreadsheetMetadata.EMPTY.set(SpreadsheetMetadata.EDIT_CELL, editCell);
    const removed = metadata.remove(SpreadsheetMetadata.EDIT_CELL);

    expect(metadata).not.toEqual(removed);

    checkJson(metadata, {
        "edit-cell": "Z9",
    });
    checkJson(removed,
        {});
});

test("remove property #2", () => {
    const withSpreadsheetName = SpreadsheetMetadata.EMPTY
        .set(SpreadsheetMetadata.SPREADSHEET_NAME, new SpreadsheetName("spreadsheet-name-123"));

    const editCell = SpreadsheetCellReference.parse("Z9");
    const metadata = withSpreadsheetName.set(SpreadsheetMetadata.EDIT_CELL, editCell);
    const removed = metadata.remove(SpreadsheetMetadata.EDIT_CELL);

    expect(metadata).not.toEqual(removed);
    expect(withSpreadsheetName).toEqual(removed);
});

// creator.............................................................................................................

test("get creator missing", () => {
    expect(SpreadsheetMetadata.EMPTY.get(SpreadsheetMetadata.CREATOR))
        .toBeUndefined();
});

test("get creator", () => {
    expect(SpreadsheetMetadata.fromJson({
        "creator": "creator@example.com"
    }).get(SpreadsheetMetadata.CREATOR))
        .toEqual(EmailAddress.fromJson("creator@example.com"));
});

test("remove creator fails", removeUnsupportedFails(SpreadsheetMetadata.CREATOR));

// create-date-time.............................................................................................................

test("get create-date-time missing", () => {
    expect(SpreadsheetMetadata.EMPTY
        .get(SpreadsheetMetadata.CREATE_DATE_TIME)
    ).toBeUndefined();
});

test("get create-date-time", () => {
    expect(SpreadsheetMetadata.fromJson({
        "create-date-time": "1999-12-31 12:58:59"
    }
    ).get(SpreadsheetMetadata.CREATE_DATE_TIME)
    ).toEqual(LocalDateTime.fromJson("1999-12-31 12:58:59"));
});

test("remove create-date-time fails", removeUnsupportedFails(SpreadsheetMetadata.CREATE_DATE_TIME));

// currency-symbol......................................................................................................

test("get currency-symbol missing", () => {
    expect(SpreadsheetMetadata.EMPTY
        .get(SpreadsheetMetadata.CURRENCY_SYMBOL))
        .toBeUndefined();
});

test("get currency-symbol", () => {
    expect(SpreadsheetMetadata.fromJson({
            "currency-symbol": "AUD"
        }).get(SpreadsheetMetadata.CURRENCY_SYMBOL)
    ).toEqual("AUD");
});

test("set currency-symbol", () => {
    const currencySymbol = "AUD";
    checkJson(SpreadsheetMetadata.EMPTY
            .set(SpreadsheetMetadata.CURRENCY_SYMBOL, currencySymbol),
        {
            "currency-symbol": currencySymbol,
        });
});

test("remove currency-symbol fails", removeUnsupportedFails(SpreadsheetMetadata.CURRENCY_SYMBOL));

// edit-cell............................................................................................................

test("get edit-cell missing", () => {
    expect(SpreadsheetMetadata.EMPTY
        .get(SpreadsheetMetadata.EDIT_CELL)
    ).toBeUndefined();
});

test("get edit-cell", () => {
    expect(SpreadsheetMetadata.fromJson({
        "edit-cell": "B97"
    }
    ).get(SpreadsheetMetadata.EDIT_CELL)
    ).toEqual(SpreadsheetCellReference.parse("B97"));
});

test("set edit-cell", () => {
    checkJson(SpreadsheetMetadata.EMPTY
            .set(SpreadsheetMetadata.EDIT_CELL,
                SpreadsheetCellReference.parse("B98")),
        {
            "edit-cell": "B98"
        });
});

// modified.............................................................................................................

test("get modified-by missing", () => {
    expect(SpreadsheetMetadata.EMPTY
        .get(SpreadsheetMetadata.MODIFIED_BY)
    ).toBeUndefined();
});

test("get modified-by", () => {
    expect(SpreadsheetMetadata.fromJson({
        "modified-by": "modified-by@example.com"
    }
    ).get(SpreadsheetMetadata.MODIFIED_BY)
    ).toEqual(EmailAddress.fromJson("modified-by@example.com"));
});

test("remove modified-by fails", removeUnsupportedFails(SpreadsheetMetadata.MODIFIED_BY));

// modified-date-time.............................................................................................................

test("get modified-date-time missing", () => {
    expect(SpreadsheetMetadata.EMPTY
        .get(SpreadsheetMetadata.MODIFIED_DATE_TIME)
    ).toBeUndefined();
});

test("get modified-date-time", () => {
    expect(SpreadsheetMetadata.fromJson({
        "modified-date-time": "1999-12-31 12:58:59"
    }).get(SpreadsheetMetadata.MODIFIED_DATE_TIME)
    ).toEqual(LocalDateTime.fromJson("1999-12-31 12:58:59"));
});

test("remove modified-date-time fails", removeUnsupportedFails(SpreadsheetMetadata.MODIFIED_DATE_TIME));

// spreadsheetId.........................................................................................................

test("get spreadsheet-id", () => {
    const id = "123ABC";

    expect(SpreadsheetMetadata.fromJson({
        "spreadsheet-id": id
    }).get(SpreadsheetMetadata.SPREADSHEET_ID)
    ).toEqual(id);
})

test("remove spreadsheet-id fails", removeUnsupportedFails(SpreadsheetMetadata.SPREADSHEET_ID));

// spreadsheet-name.....................................................................................................

test("get spreadsheet-name", () => {
    const name = "spreadsheet-name-123";

    expect(SpreadsheetMetadata.fromJson({
        "spreadsheet-name": name
    }).get(SpreadsheetMetadata.SPREADSHEET_NAME)
    ).toEqual(SpreadsheetName.parse(name));
})

test("set spreadsheet-name", () => {
    const name = SpreadsheetName.parse("spreadsheet-name-123");

    checkJson(SpreadsheetMetadata.EMPTY
            .set(SpreadsheetMetadata.SPREADSHEET_NAME, name),
        {
            "spreadsheet-name": name.value()
        });
})

test("remove spreadsheet-name fails", removeUnsupportedFails(SpreadsheetMetadata.SPREADSHEET_NAME));

// setStyle.............................................................................................................

test("set style", () => {
    checkJson(SpreadsheetMetadata.EMPTY
            .set(SpreadsheetMetadata.STYLE,
                TextStyle.EMPTY.set("width", "50px")
            ),
        {
            "style": {
                "width": "50px"
            }
        });
})

test("remove style fails", removeUnsupportedFails(SpreadsheetMetadata.STYLE));

// viewport-cell............................................................................................................

test("get viewport-cell missing", () => {
    expect(SpreadsheetMetadata.EMPTY
        .get(SpreadsheetMetadata.VIEWPORT_CELL)
    ).toBeUndefined();
});

test("get viewport-cell", () => {
    expect(SpreadsheetMetadata.fromJson({
        "viewport-cell": "B97"
    }
    ).get(SpreadsheetMetadata.VIEWPORT_CELL)
    ).toEqual(SpreadsheetCellReference.parse("B97"));
});

test("set viewport-cell", () => {
    checkJson(SpreadsheetMetadata.EMPTY
            .set(SpreadsheetMetadata.VIEWPORT_CELL, SpreadsheetCellReference.parse("B98")),
        {
            "viewport-cell": "B98"
        });
});

test("remove viewport-coordinates fails", removeUnsupportedFails(SpreadsheetMetadata.VIEWPORT_CELL));

// viewportCoordinates.............................................................................................................

test("get viewport-coordinates", () => {
    expect(SpreadsheetMetadata.fromJson({
        "viewport-coordinates": "123.5,400"
    })
        .get(SpreadsheetMetadata.VIEWPORT_COORDINATES)
    ).toEqual(SpreadsheetCoordinates.parse("123.5,400"));
})

test("set viewport-coordinates", () => {
    checkJson(SpreadsheetMetadata.EMPTY
            .set(SpreadsheetMetadata.VIEWPORT_COORDINATES, SpreadsheetCoordinates.parse("123.5,400")),
        {
            "viewport-coordinates": "123.5,400"
        });
})

test("remove viewport-coordinates fails", removeUnsupportedFails(SpreadsheetMetadata.VIEWPORT_COORDINATES));

// set..................................................................................................................

test("all setters & getters", () => {
    const editCell = SpreadsheetCellReference.parse("Z99");
    const name = new SpreadsheetName("Spreadsheet-name-123");
    const style = TextStyle.EMPTY
        .set("width", PixelLength.parse("123px"));
    const coords = new SpreadsheetCoordinates(12, 34);
    const viewportCell = SpreadsheetCellReference.parse("A99");

    const metadata = SpreadsheetMetadata.EMPTY
        .set(SpreadsheetMetadata.EDIT_CELL, editCell)
        .set(SpreadsheetMetadata.SPREADSHEET_NAME, name)
        .set(SpreadsheetMetadata.STYLE, style)
        .set(SpreadsheetMetadata.VIEWPORT_CELL, viewportCell)
        .set(SpreadsheetMetadata.VIEWPORT_COORDINATES, coords);

    expect(metadata.get(SpreadsheetMetadata.EDIT_CELL)).toEqual(editCell);
    expect(metadata.get(SpreadsheetMetadata.SPREADSHEET_NAME)).toEqual(name);
    expect(metadata.get(SpreadsheetMetadata.STYLE)).toEqual(style);
    expect(metadata.get(SpreadsheetMetadata.VIEWPORT_CELL)).toEqual(viewportCell);
    expect(metadata.get(SpreadsheetMetadata.VIEWPORT_COORDINATES)).toEqual(coords);
});

test("all setters & removers", () => {
    const editCell = SpreadsheetCellReference.parse("Z99");

    const metadata = SpreadsheetMetadata.EMPTY
        .set(SpreadsheetMetadata.EDIT_CELL, editCell)
        .remove(SpreadsheetMetadata.EDIT_CELL);

    expect(metadata.get(SpreadsheetMetadata.EDIT_CELL)).toBeUndefined();
    expect(metadata.isEmpty()).toBeTrue();
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
    expect(metadata.get(SpreadsheetMetadata.SPREADSHEET_ID)).toBe(id);
}

function checkSpreadsheetName(metadata, name) {
    expect(metadata.get(SpreadsheetMetadata.SPREADSHEET_NAME)).toStrictEqual(name);
}

// checks toJson and toString
function checkJson(metadata, json) {
    expect(metadata.toJson()).toStrictEqual(json);
    expect(metadata.toString()).toBe(JSON.stringify(json));
}

function removeUnsupportedFails(property) {
    return () => {
        expect(() => SpreadsheetMetadata.EMPTY.remove(property)).toThrow("Property \"" + property + "\" cannot be removed, {}");
    }
}