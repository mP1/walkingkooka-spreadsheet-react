import EmailAddress from "../../net/EmailAddress.js";
import LocalDateTime from "../../datetime/LocalDateTime.js";
import PixelLength from "../../text/PixelLength";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference";
import SpreadsheetCoordinates from "../SpreadsheetCoordinates";
import SpreadsheetMetadata from "./SpreadsheetMetadata";
import SpreadsheetName from "../SpreadsheetName";
import TextStyle from "../../text/TextStyle";
import SpreadsheetPattern from "../format/SpreadsheetPattern.js";

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
    expect(() => SpreadsheetMetadata.EMPTY.set(SpreadsheetMetadata.DATE_FORMAT_PATTERN, 123)).toThrow("Expected SpreadsheetPattern property date-format-pattern got 123");
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

// remove...............................................................................................................

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

// properties...........................................................................................................

getPropertyTest(SpreadsheetMetadata.CREATE_DATE_TIME, LocalDateTime.fromJson("1999-12-31 12:58:59"));

getPropertyTest(SpreadsheetMetadata.CREATOR, EmailAddress.fromJson("creator@example.com"));

getSetPropertyTest(SpreadsheetMetadata.CURRENCY_SYMBOL, "AUD");

getSetPropertyTest(SpreadsheetMetadata.DATE_FORMAT_PATTERN, SpreadsheetPattern.fromJson("YYYY-MM-DD"));

getSetPropertyTest(SpreadsheetMetadata.DATE_PARSE_PATTERNS, SpreadsheetPattern.fromJson("YYYY-MM-DD"));

getSetPropertyTest(SpreadsheetMetadata.DATETIME_OFFSET, 1234);

getSetRemovePropertyTest(SpreadsheetMetadata.EDIT_CELL, SpreadsheetCellReference.parse("B97"));

getPropertyTest(SpreadsheetMetadata.MODIFIED_BY, EmailAddress.fromJson("creator@example.com"));

getPropertyTest(SpreadsheetMetadata.MODIFIED_DATE_TIME, LocalDateTime.fromJson("1999-12-31 12:58:59"));

getPropertyTest(SpreadsheetMetadata.SPREADSHEET_ID, "123");

getSetPropertyTest(SpreadsheetMetadata.SPREADSHEET_NAME, SpreadsheetName.fromJson("spreadsheet-name-123"));

getSetPropertyTest(SpreadsheetMetadata.STYLE, TextStyle.EMPTY.set("width", "50px"));

getSetPropertyTest(SpreadsheetMetadata.VIEWPORT_CELL, SpreadsheetCellReference.parse("B2"));

getSetPropertyTest(SpreadsheetMetadata.VIEWPORT_COORDINATES, SpreadsheetCoordinates.parse("123.5,400"));

function getPropertyTest(propertyName, propertyValue) {
    getPropertyTest0(propertyName, propertyValue);

    test("set " + propertyName + " fails",
        () => {
            expect(() => SpreadsheetMetadata.EMPTY.set(propertyName, propertyValue))
                .toThrow("set \"" + propertyName + "\" is not allowed");
        }
    );

    removePropertyFailsTest(propertyName);
}

function getSetPropertyTest(propertyName, propertyValue) {
    getPropertyTest0(propertyName, propertyValue);
    setPropertyTest(propertyName, propertyValue);
    removePropertyFailsTest(propertyName);
}

function getSetRemovePropertyTest(propertyName, propertyValue) {
    getPropertyTest0(propertyName, propertyValue);
    setPropertyTest(propertyName, propertyValue);

    test("remove " + propertyName,
        () => {
            const json = {};
            json[propertyName] = (propertyValue.toJson && propertyValue.toJson()) || propertyValue;

            expect(SpreadsheetMetadata.fromJson(json)
                .remove(propertyName)
            ).toEqual(SpreadsheetMetadata.EMPTY);
        }
    );
}

function getPropertyTest0(propertyName, propertyValue) {
    test("get " + propertyName + " missing", () => {
        expect(SpreadsheetMetadata.EMPTY
            .get(propertyName))
            .toBeUndefined();
    });

    test("get " + propertyName, () => {
        const json = {};
        json[propertyName] = (propertyValue.toJson && propertyValue.toJson()) || propertyValue;

        expect(SpreadsheetMetadata.fromJson(json)
            .get(propertyName)
        ).toEqual(propertyValue);
    });
};

function setPropertyTest(propertyName, propertyValue) {
    test("set " + propertyName + " missing", () => {
        expect(SpreadsheetMetadata.EMPTY
            .get(propertyName))
            .toBeUndefined();
    });

    test("set " + propertyName, () => {
        const metadata = SpreadsheetMetadata.EMPTY
            .set(propertyName, propertyValue);

        const json = {};
        json[propertyName] = (propertyValue.toJson && propertyValue.toJson()) || propertyValue;

        expect(SpreadsheetMetadata.fromJson(json)
            .get(propertyName)
        ).toEqual(propertyValue);

        expect(metadata.toJson()).toEqual(json);
    });
};

function removePropertyFailsTest(propertyName) {
    test("remove " + propertyName,
        () => {
            expect(() => SpreadsheetMetadata.EMPTY
                .remove(propertyName))
                .toThrow("Property \"" + propertyName + "\" cannot be removed, {}")
        }
    );
}

// all..................................................................................................................

test("all setters & getters", () => {
    const dateTimeOffset = 123;
    const dateTimeFormatPattern = SpreadsheetPattern.fromJson("yyyymmddhhmm");
    const dateTimeParsePatterns = SpreadsheetPattern.fromJson("yyyymmddhhmm");
    const editCell = SpreadsheetCellReference.parse("Z99");
    const name = new SpreadsheetName("Spreadsheet-name-123");
    const style = TextStyle.EMPTY
        .set("width", PixelLength.parse("123px"));
    const coords = new SpreadsheetCoordinates(12, 34);
    const viewportCell = SpreadsheetCellReference.parse("A99");

    const metadata = SpreadsheetMetadata.EMPTY
        .set(SpreadsheetMetadata.DATETIME_OFFSET, dateTimeOffset)
        .set(SpreadsheetMetadata.DATETIME_FORMAT_PATTERN, dateTimeFormatPattern)
        .set(SpreadsheetMetadata.DATETIME_PARSE_PATTERNS, dateTimeParsePatterns)
        .set(SpreadsheetMetadata.EDIT_CELL, editCell)
        .set(SpreadsheetMetadata.SPREADSHEET_NAME, name)
        .set(SpreadsheetMetadata.STYLE, style)
        .set(SpreadsheetMetadata.VIEWPORT_CELL, viewportCell)
        .set(SpreadsheetMetadata.VIEWPORT_COORDINATES, coords);

    expect(metadata.get(SpreadsheetMetadata.DATETIME_OFFSET)).toEqual(dateTimeOffset);
    expect(metadata.get(SpreadsheetMetadata.DATETIME_FORMAT_PATTERN)).toEqual(dateTimeFormatPattern);
    expect(metadata.get(SpreadsheetMetadata.DATETIME_PARSE_PATTERNS)).toEqual(dateTimeParsePatterns);
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
