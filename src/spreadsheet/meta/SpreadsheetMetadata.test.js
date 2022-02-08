import Character from "../../Character.js";
import EmailAddress from "../../net/EmailAddress.js";
import ExpressionNumberKind from "../../math/ExpressionNumberKind.js";
import lengthFromJson from "../../text/LengthFromJson.js";
import LocalDateTime from "../../datetime/LocalDateTime.js";
import Locale from "../../util/Locale.js";
import PixelLength from "../../text/PixelLength";
import RoundingMode from "../../math/RoundingMode.js";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference";
import SpreadsheetDateFormatPattern from "../format/SpreadsheetDateFormatPattern.js";
import SpreadsheetDateParsePatterns from "../format/SpreadsheetDateParsePatterns.js";
import SpreadsheetDateTimeFormatPattern from "../format/SpreadsheetDateTimeFormatPattern.js";
import SpreadsheetDateTimeParsePatterns from "../format/SpreadsheetDateTimeParsePatterns.js";
import SpreadsheetMetadata from "./SpreadsheetMetadata";
import SpreadsheetName from "../SpreadsheetName";
import SpreadsheetNumberFormatPattern from "../format/SpreadsheetNumberFormatPattern.js";
import SpreadsheetNumberParsePatterns from "../format/SpreadsheetNumberParsePatterns.js";
import SpreadsheetTextFormatPattern from "../format/SpreadsheetTextFormatPattern.js";
import SpreadsheetTimeFormatPattern from "../format/SpreadsheetTimeFormatPattern.js";
import SpreadsheetTimeParsePatterns from "../format/SpreadsheetTimeParsePatterns.js";
import systemObjectTesting from "../../SystemObjectTesting.js";
import TextStyle from "../../text/TextStyle";

systemObjectTesting(
    new SpreadsheetMetadata(
        {
            "spreadsheet-id": "ABC123",
            "spreadsheet-name": SpreadsheetName.fromJson("spreadsheet-name-123"),
        }
    ),
    SpreadsheetMetadata.EMPTY,
    SpreadsheetMetadata.fromJson,
    "Missing json",
    "spreadsheet-metadata",
    {
        "spreadsheet-id": "ABC123",
        "spreadsheet-name": "spreadsheet-name-123",
    }
);

// isProperty...........................................................................................................

test("isProperty using properties()", () => {
    const missing = SpreadsheetMetadata.properties()
        .concat("Unknown123")
        .filter(property => !SpreadsheetMetadata.isProperty(property))

    expect(missing).toStrictEqual(["Unknown123"]);
});

// stringValueToJson....................................................................................................

test("stringValueToJson invalid property fails", () => {
    expect(() => SpreadsheetMetadata.stringValueToJson("!invalid", 123))
        .toThrow("Unknown propertyName \"!invalid\"");
});

test("stringValueToJson non text value fails", () => {
    expect(() => SpreadsheetMetadata.stringValueToJson(SpreadsheetMetadata.CELL_CHARACTER_WIDTH, 123))
        .toThrow("Expected string value got 123");
});

function teststringValueToJson(propertyName, value, json) {
    test("stringValueToJson " + propertyName + "=" + value, () => {
        expect(SpreadsheetMetadata.stringValueToJson(propertyName, value))
            .toStrictEqual(json);
    });
}

teststringValueToJson(SpreadsheetMetadata.DATETIME_OFFSET, "123", 123);
teststringValueToJson(SpreadsheetMetadata.TWO_DIGIT_YEAR, "20", 20);
teststringValueToJson(SpreadsheetMetadata.CURRENCY_SYMBOL, "AUD", "AUD");
teststringValueToJson(SpreadsheetMetadata.CREATOR, "user@example.com", "user@example.com");
teststringValueToJson(SpreadsheetMetadata.POSITIVE_SIGN, "+", "+");

// EMPTY................................................................................................................

test("Empty", () => {
    const metadata = SpreadsheetMetadata.EMPTY;
    expect(metadata).toBeDefined();

    checkJson(metadata, {});
    checkSpreadsheetId(metadata, null);
});

// fromJson.............................................................................................................

test("from json empty", () => {
    const json = {};

    const metadata = SpreadsheetMetadata.fromJson(json);

    checkJson(metadata, json);
    checkSpreadsheetId(metadata, null);
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
    checkSpreadsheetId(metadata, null);
    checkSpreadsheetName(metadata, name);
})

test("from json all properties", () => {
    SpreadsheetMetadata.fromJson({
        "cell-character-width": 10,
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
        "frozen-columns": 1,
        "frozen-rows": 2,
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
    });
});

// getIgnoringDefaults..................................................................................................................

test("getIgnoringDefaults present without defaults", () => {
    const propertyName = SpreadsheetMetadata.SPREADSHEET_ID;
    const propertyValue = "1234";

    const metadata = new SpreadsheetMetadata({"spreadsheet-id": propertyValue});
    expect(metadata.getIgnoringDefaults(propertyName)).toEqual(propertyValue);
})

test("getIgnoringDefaults missing without defaults", () => {
    const metadata = new SpreadsheetMetadata({});
    expect(metadata.getIgnoringDefaults("creator")).toBeNull();
})

test("getIgnoringDefaults missing but ignoring default", () => {
    const propertyName = SpreadsheetMetadata.SPREADSHEET_ID;
    const propertyValue = "1234";

    const metadata = SpreadsheetMetadata.fromJson({_defaults: {"spreadsheet-id": propertyValue}});
    expect(metadata.getIgnoringDefaults(propertyName)).toBeNull();
})

// get..................................................................................................................

test("get null fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.get(null)).toThrow("Missing property");
})

test("get present without defaults", () => {
    const propertyName = SpreadsheetMetadata.SPREADSHEET_ID;
    const propertyValue = "1234";

    const metadata = new SpreadsheetMetadata({"spreadsheet-id": propertyValue});
    expect(metadata.get(propertyName)).toEqual(propertyValue);
})

test("get missing without defaults", () => {
    const metadata = new SpreadsheetMetadata({});
    expect(metadata.get("creator")).toBeNull();
})

test("get from default", () => {
    const propertyName = SpreadsheetMetadata.SPREADSHEET_ID;
    const propertyValue = "1234";

    const metadata = SpreadsheetMetadata.fromJson({_defaults: {"spreadsheet-id": propertyValue}});
    expect(metadata.get(propertyName)).toStrictEqual(propertyValue);
})

// set..................................................................................................................

test("set null fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.set(null, "1234")).toThrow("Missing property");
})

test("set value null fail", () => {
    expect(() => SpreadsheetMetadata.EMPTY.set(SpreadsheetMetadata.SPREADSHEET_ID, null)).toThrow("Property \"spreadsheet-id\" missing value");
})

test("set invalid value fail", () => {
    expect(() => SpreadsheetMetadata.EMPTY.set(SpreadsheetMetadata.DATE_FORMAT_PATTERN, 123)).toThrow("Expected SpreadsheetDateFormatPattern property date-format-pattern got 123");
});

test("set same", () => {
    const name = new SpreadsheetName("spreadsheet-name-123");
    const metadata = new SpreadsheetMetadata({"spreadsheet-name": name});
    expect(metadata).toEqual(metadata.set(SpreadsheetMetadata.SPREADSHEET_NAME, name));
})

test("set replace different value", () => {
    const propertyValue = new SpreadsheetName("spreadsheet-name-123");
    const metadata = new SpreadsheetMetadata({"spreadsheet-name": propertyValue.toJson()});

    const differentPropertyValue = new SpreadsheetName("different-spreadsheet-name-456");
    const differentMetadata = metadata.set(SpreadsheetMetadata.SPREADSHEET_NAME, differentPropertyValue);

    expect(metadata).not.toEqual(differentMetadata);

    checkJson(metadata, {
        "spreadsheet-name": propertyValue.toJson()
    });
    checkJson(differentMetadata,
        {
            "spreadsheet-name": differentPropertyValue.toJson()
        });
})

test("set different", () => {
    const propertyValue = "spreadsheet-id-123";
    const metadata = new SpreadsheetMetadata({"spreadsheet-id": propertyValue});

    const propertyValue2 = new SpreadsheetName("spreadsheet-name-123");
    const metadata2 = metadata.set(SpreadsheetMetadata.SPREADSHEET_NAME, propertyValue2);

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
});

test("set empty new character", () => {
    const metadata = SpreadsheetMetadata.EMPTY;
    const comma = new Character('.');
    const metadata2 = metadata.set(SpreadsheetMetadata.DECIMAL_SEPARATOR, comma);
    expect(metadata).not.toEqual(metadata2);

    checkJson(metadata, {});
    checkJson(
        metadata2,
        {
            "decimal-separator": comma.toJson(),
        }
    );
});

test("set new character duplicate fails", () => {
    const comma = new Character(',');
    const metadata = new SpreadsheetMetadata({
        "decimal-separator": comma,
    });

    expect(() => metadata.set(SpreadsheetMetadata.GROUPING_SEPARATOR, comma)).toThrow("Cannot set grouping-separator=, duplicate of decimal-separator");
});

test("set new character duplicate fails #2", () => {
    const comma = new Character(',');
    const metadata = new SpreadsheetMetadata({
        "decimal-separator": comma,
    });

    expect(() => metadata.set(SpreadsheetMetadata.POSITIVE_SIGN, comma)).toThrow("Cannot set positive-sign=, duplicate of decimal-separator");
});

test("set new character", () => {
    const json = {
        "currency": "$AUD",
    };
    const metadata = new SpreadsheetMetadata(json);

    const comma = new Character(',');
    const metadata2 = metadata.set(SpreadsheetMetadata.DECIMAL_SEPARATOR, comma);

    expect(metadata).not.toEqual(metadata2);

    checkJson(metadata, json);
    checkJson(
        metadata2,
        {
            "currency": "$AUD",
            "decimal-separator": comma.toJson(),
        }
    );
});

test("set character copy default group-separator", () => {
    const dot = new Character('.');
    const comma = new Character(',');
    const percent = new Character('%');

    const metadata = new SpreadsheetMetadata({
        "decimal-separator": dot,
        "grouping-separator": comma,
        "percentage-symbol": percent,
    });
    const metadata2 = metadata.set(SpreadsheetMetadata.GROUPING_SEPARATOR, dot);
    expect(metadata).not.toEqual(metadata2);

    checkJson(
        metadata,
        {
            "decimal-separator": dot.toJson(),
            "grouping-separator": comma.toJson(),
            "percentage-symbol": percent.toJson(),
        }
    );
    checkJson(
        metadata2,
        {
            "decimal-separator": comma.toJson(),
            "grouping-separator": dot.toJson(),
            "percentage-symbol": percent.toJson(),
        });
});

test("set character copy default value-separator", () => {
    const dot = new Character('.');
    const comma = new Character(',');
    const percent = new Character('%');

    const metadata = new SpreadsheetMetadata({
        "defaults": {
            "decimal-separator": dot,
            "percentage-symbol": percent,
            "value-separator": comma,
        }
    });
    const metadata2 = metadata.set(SpreadsheetMetadata.VALUE_SEPARATOR, dot);
    expect(metadata).not.toEqual(metadata2);

    checkJson(
        metadata,
        {
            "defaults": {
                "decimal-separator": dot,
                "percentage-symbol": percent,
                "value-separator": comma,
            },
        }
    );
    checkJson(
        metadata2,
        {
            "defaults": {
                "decimal-separator": dot,
                "percentage-symbol": percent,
                "value-separator": comma,
            },
            "value-separator": dot.toJson(),
        });
});

test("set character copy default non group-separator/value-separator", () => {
    const dot = new Character('.');
    const comma = new Character(',');
    const percent = new Character('%');

    const metadata = new SpreadsheetMetadata({
        "defaults": {
            "decimal-separator": dot.toJson(),
            "grouping-separator": comma.toJson(),
            "percentage-symbol": percent.toJson(),
        }
    });
    const metadata2 = metadata.set(SpreadsheetMetadata.PERCENTAGE_SYMBOL, percent);
    expect(metadata).not.toEqual(metadata2);

    checkJson(
        metadata,
        {
            "defaults": {
                "decimal-separator": dot.toJson(),
                "grouping-separator": comma.toJson(),
                "percentage-symbol": percent.toJson(),
            },
        }
    );
    checkJson(
        metadata2,
        {
            "defaults": {
                "decimal-separator": dot.toJson(),
                "grouping-separator": comma.toJson(),
                "percentage-symbol": percent.toJson(),
            },
            "percentage-symbol": percent.toJson(),
        });
});

test("set replace character", () => {
    const dot = new Character('.');
    const comma = new Character(',');

    const metadata = new SpreadsheetMetadata({
        "decimal-separator": dot,
    });
    const metadata2 = metadata.set(SpreadsheetMetadata.DECIMAL_SEPARATOR, comma);
    expect(metadata).not.toEqual(metadata2);

    checkJson(
        metadata,
        {
            "decimal-separator": dot.toJson(),
        }
    );
    checkJson(
        metadata2,
        {
            "decimal-separator": comma.toJson(),
        }
    );
});

test("set duplicate dont swap character", () => {
    const comma = new Character('.');

    const metadata = new SpreadsheetMetadata({
        "grouping-separator": comma,
    });
    const metadata2 = metadata.set(SpreadsheetMetadata.VALUE_SEPARATOR, comma);
    expect(metadata).not.toEqual(metadata2);

    checkJson(
        metadata,
        {
            "grouping-separator": comma.toJson(),
        }
    );
    checkJson(
        metadata2,
        {
            "grouping-separator": comma.toJson(),
            "value-separator": comma.toJson(),
        }
    );
});

test("set character swap", () => {
    const dot = new Character('.');
    const comma = new Character(',');

    const metadata = new SpreadsheetMetadata({
        "decimal-separator": dot,
        "grouping-separator": comma,
    });

    const metadata2 = metadata.set(SpreadsheetMetadata.DECIMAL_SEPARATOR, comma);
    expect(metadata).not.toEqual(metadata2);

    checkJson(
        metadata,
        {
            "decimal-separator": dot.toJson(),
            "grouping-separator": comma.toJson(),
        }
    );
    checkJson(
        metadata2,
        {
            "decimal-separator": comma.toJson(),
            "grouping-separator": dot.toJson(), // swap!
        });
});

test("set character swap 2", () => {
    const dot = new Character('.');
    const comma = new Character(',');
    const percent = new Character('%');

    const metadata = new SpreadsheetMetadata({
        "decimal-separator": dot,
        "grouping-separator": comma,
        "percentage-symbol": percent,
    });
    const metadata2 = metadata.set(SpreadsheetMetadata.DECIMAL_SEPARATOR, comma);
    expect(metadata).not.toEqual(metadata2);

    checkJson(metadata, {
        "decimal-separator": dot.toJson(),
        "grouping-separator": comma.toJson(),
        "percentage-symbol": percent.toJson(),
    });
    checkJson(metadata2,
        {
            "decimal-separator": comma.toJson(),
            "grouping-separator": dot.toJson(), // swap!
            "percentage-symbol": percent.toJson(),
        });
});

// remove...............................................................................................................

test("remove missing fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.remove()).toThrow("Missing property");
});

test("remove invalid fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.remove(123)).toThrow("Expected string propertyName got 123");
});

test("remove unknown fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.remove("!unknown")).toThrow("Unknown propertyName \"!unknown\"");
});

test("remove absent property", () => {
    const metadata = SpreadsheetMetadata.EMPTY;
    expect(metadata).toEqual(metadata.remove(SpreadsheetMetadata.SELECTION));
});

test("remove absent property #2", () => {
    const metadata = SpreadsheetMetadata.EMPTY
        .set(SpreadsheetMetadata.SPREADSHEET_NAME, new SpreadsheetName("spreadsheet-name-123"));
    expect(metadata).toEqual(metadata.remove(SpreadsheetMetadata.SELECTION));
});

test("remove", () => {
    const selection = SpreadsheetCellReference.parse("Z9")
        .setAnchor();
    const metadata = SpreadsheetMetadata.EMPTY.set(SpreadsheetMetadata.SELECTION, selection);
    const removed = metadata.remove(SpreadsheetMetadata.SELECTION);

    expect(metadata).not.toEqual(removed);

    checkJson(metadata, {
        "selection": selection.toJson(),
    });
    checkJson(removed,
        {});
});

test("remove #2", () => {
    const withSpreadsheetName = SpreadsheetMetadata.EMPTY
        .set(SpreadsheetMetadata.SPREADSHEET_NAME, new SpreadsheetName("spreadsheet-name-123"));

    const selection = SpreadsheetCellReference.parse("Z9")
        .setAnchor();
    const metadata = withSpreadsheetName.set(SpreadsheetMetadata.SELECTION, selection);
    const removed = metadata.remove(SpreadsheetMetadata.SELECTION);

    expect(metadata).not.toEqual(removed);
    expect(withSpreadsheetName).toEqual(removed);
});

// properties...........................................................................................................

getSetRemoveTest(SpreadsheetMetadata.CELL_CHARACTER_WIDTH, 2);

test("set cell-character-width 0 fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.set(SpreadsheetMetadata.CELL_CHARACTER_WIDTH, 0)).toThrow("Expected number width > 0 got 0");
});

test("set cell-character-width -1 fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.set(SpreadsheetMetadata.CELL_CHARACTER_WIDTH, -1)).toThrow("Expected number width > 0 got -1");
});

getIgnoringDefaultsTest(SpreadsheetMetadata.CREATE_DATE_TIME, LocalDateTime.fromJson("1999-12-31 12:58:59"));

getIgnoringDefaultsTest(SpreadsheetMetadata.CREATOR, EmailAddress.fromJson("creator@example.com"));

getSetRemoveTest(SpreadsheetMetadata.CURRENCY_SYMBOL, "AUD");

getSetRemoveTest(SpreadsheetMetadata.DATE_FORMAT_PATTERN, SpreadsheetDateFormatPattern.fromJson("YYYY-MM-DD"));

getSetRemoveTest(SpreadsheetMetadata.DATE_PARSE_PATTERNS, SpreadsheetDateParsePatterns.fromJson("YYYY-MM-DD"));

getSetTest(SpreadsheetMetadata.DATETIME_OFFSET, 1234);

getSetRemoveTest(SpreadsheetMetadata.DATETIME_FORMAT_PATTERN, SpreadsheetDateTimeFormatPattern.fromJson("YYYY-MM-DD HH-MM"));

getSetRemoveTest(SpreadsheetMetadata.DATETIME_PARSE_PATTERNS, SpreadsheetDateTimeParsePatterns.fromJson("YYYY-MM-DD HH-MM-SS"));

getSetRemoveTest(SpreadsheetMetadata.DECIMAL_SEPARATOR, Character.fromJson(","));

test("set decimal separator invalid character fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.set(SpreadsheetMetadata.DECIMAL_SEPARATOR, new Character('a'))).toThrow("Expected symbol got a");
});

getSetRemoveTest(SpreadsheetMetadata.DEFAULT_YEAR, 1902);

getSetRemoveTest(SpreadsheetMetadata.EXPONENT_SYMBOL, Character.fromJson(","));

getSetRemoveTest(SpreadsheetMetadata.EXPRESSION_NUMBER_KIND, ExpressionNumberKind.BIG_DECIMAL);

getSetRemoveTest(SpreadsheetMetadata.FROZEN_COLUMNS, 1);

getSetRemoveTest(SpreadsheetMetadata.FROZEN_ROWS, 2);

getSetRemoveTest(SpreadsheetMetadata.GROUPING_SEPARATOR, Character.fromJson(","));

getSetTest(SpreadsheetMetadata.LOCALE, Locale.fromJson("EN-AU"));

getIgnoringDefaultsTest(SpreadsheetMetadata.MODIFIED_BY, EmailAddress.fromJson("creator@example.com"));

getIgnoringDefaultsTest(SpreadsheetMetadata.MODIFIED_DATE_TIME, LocalDateTime.fromJson("1999-12-31 12:58:59"));

getSetRemoveTest(SpreadsheetMetadata.NEGATIVE_SIGN, Character.fromJson("-"));

getSetRemoveTest(SpreadsheetMetadata.NUMBER_FORMAT_PATTERN, SpreadsheetNumberFormatPattern.fromJson("#.#"));

getSetRemoveTest(SpreadsheetMetadata.NUMBER_PARSE_PATTERNS, SpreadsheetNumberParsePatterns.fromJson("#.##"));

getSetRemoveTest(SpreadsheetMetadata.PERCENTAGE_SYMBOL, Character.fromJson("%"));

getSetRemoveTest(SpreadsheetMetadata.POSITIVE_SIGN, Character.fromJson("+"));

getSetRemoveTest(SpreadsheetMetadata.PRECISION, 3);

test("set precision 0 pass", () => {
    expect(() => SpreadsheetMetadata.EMPTY.set(SpreadsheetMetadata.PRECISION, 0));
});

test("set precision -1 fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.set(SpreadsheetMetadata.PRECISION, -1)).toThrow("Expected number precision >= 0 got -1");
});

test("set precision NAN fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.set(SpreadsheetMetadata.PRECISION, parseInt(undefined))).toThrow("Expected number precision >= 0 got NaN");
});

getSetRemoveTest(SpreadsheetMetadata.ROUNDING_MODE, RoundingMode.CEILING);

getSetRemoveTest(
    SpreadsheetMetadata.SELECTION,
    SpreadsheetCellReference.parse("B97")
        .setAnchor()
);

getIgnoringDefaultsTest(SpreadsheetMetadata.SPREADSHEET_ID, "123");

getSetTest(SpreadsheetMetadata.SPREADSHEET_NAME, SpreadsheetName.fromJson("spreadsheet-name-123"));

getSetTest(SpreadsheetMetadata.STYLE, TextStyle.EMPTY.set("width", lengthFromJson("50px")));

getSetRemoveTest(SpreadsheetMetadata.TEXT_FORMAT_PATTERN, SpreadsheetTextFormatPattern.fromJson("@@"));

getSetRemoveTest(SpreadsheetMetadata.TIME_FORMAT_PATTERN, SpreadsheetTimeFormatPattern.fromJson("HH-MM"));

getSetRemoveTest(SpreadsheetMetadata.TIME_PARSE_PATTERNS, SpreadsheetTimeParsePatterns.fromJson("HH-MM-SS"));

getSetRemoveTest(SpreadsheetMetadata.TWO_DIGIT_YEAR, 2);

test("set two_digit_year -1 fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.set(SpreadsheetMetadata.TWO_DIGIT_YEAR, -1)).toThrow("Expected number twoDigitYear >= 0 and <= 99 got -1");
});

test("set two_digit_year 100 fails", () => {
    expect(() => SpreadsheetMetadata.EMPTY.set(SpreadsheetMetadata.TWO_DIGIT_YEAR, 100)).toThrow("Expected number twoDigitYear >= 0 and <= 99 got 100");
});

getSetRemoveTest(SpreadsheetMetadata.VALUE_SEPARATOR, Character.fromJson(";"));

getSetTest(SpreadsheetMetadata.VIEWPORT_CELL, SpreadsheetCellReference.parse("B2"));

function getIgnoringDefaultsTest(propertyName, propertyValue) {
    getIgnoringDefaultsTest0(propertyName, propertyValue);

    test("set " + propertyName + " fails",
        () => {
            expect(() => SpreadsheetMetadata.EMPTY.set(propertyName, propertyValue))
                .toThrow("set \"" + propertyName + "\" is not allowed");
        }
    );

    removePropertyFailsTest(propertyName);
}

function getSetTest(propertyName, propertyValue) {
    getIgnoringDefaultsTest0(propertyName, propertyValue);
    setPropertyTest(propertyName, propertyValue);
    removePropertyFailsTest(propertyName);
}

function getSetRemoveTest(propertyName, propertyValue) {
    getIgnoringDefaultsTest0(propertyName, propertyValue);
    setPropertyTest(propertyName, propertyValue);

    test("remove " + propertyName,
        () => {
            const json = {};
            json[propertyName] = SpreadsheetMetadata.SELECTION === propertyValue ?
                propertyValue.toJsonWithType() :
                (propertyValue.toJson && propertyValue.toJson()) || propertyValue;

            expect(SpreadsheetMetadata.fromJson(json)
                .remove(propertyName)
            ).toEqual(SpreadsheetMetadata.EMPTY);
        }
    );
}

function getIgnoringDefaultsTest0(propertyName, propertyValue) {
    test("getIgnoringDefaults " + propertyName + " missing", () => {
        expect(SpreadsheetMetadata.EMPTY
            .getIgnoringDefaults(propertyName))
            .toBeNull();
    });

    test("getIgnoringDefaults " + propertyName, () => {
        const json = {};
        json[propertyName] = propertyValue.toJson && propertyValue.toJson() || propertyValue;

        expect(SpreadsheetMetadata.fromJson(json)
            .getIgnoringDefaults(propertyName)
        ).toEqual(propertyValue);
    });
};

function setPropertyTest(propertyName, propertyValue) {
    test("set " + propertyName + " missing", () => {
        expect(SpreadsheetMetadata.EMPTY
            .getIgnoringDefaults(propertyName))
            .toBeNull();
    });

    test("set " + propertyName, () => {
        const metadata = SpreadsheetMetadata.EMPTY
            .set(propertyName, propertyValue);

        const json = {};
        json[propertyName] = propertyValue.toJson && propertyValue.toJson() || propertyValue;

        expect(SpreadsheetMetadata.fromJson(json)
            .getIgnoringDefaults(propertyName)
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

test("setOrRemove non null", () => {
    const viewportSelection = SpreadsheetCellReference.parse("Z99")
        .setAnchor();
    const metadata = SpreadsheetMetadata.EMPTY
        .setOrRemove(SpreadsheetMetadata.SELECTION, viewportSelection);

    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.SELECTION))
        .toEqual(viewportSelection);
});

test("setOrRemove null", () => {
    const viewportSelection = SpreadsheetCellReference.parse("Z99")
        .setAnchor();
    const metadata = SpreadsheetMetadata.EMPTY
        .set(SpreadsheetMetadata.SELECTION, viewportSelection);
    const metadata2 = metadata.setOrRemove(SpreadsheetMetadata.SELECTION, null)
    expect(metadata2.getIgnoringDefaults(SpreadsheetMetadata.SELECTION)).toBeNull();
});

// all..................................................................................................................

test("all setters & getters", () => {
    const cellCharacterWidth = 1;
    const currencySymbol = "$AUD";
    const dateFormatPattern = SpreadsheetDateFormatPattern.fromJson("yyyymmdd");
    const dateParsePatterns = SpreadsheetDateParsePatterns.fromJson("yyyymmdd");
    const dateTimeOffset = 123;
    const dateTimeFormatPattern = SpreadsheetDateTimeFormatPattern.fromJson("yyyymmddhhmm");
    const dateTimeParsePatterns = SpreadsheetDateTimeParsePatterns.fromJson("yyyymmddhhmm");
    const decimalSeparator = Character.fromJson(".");
    const defaultYear = 1987;
    const exponentSymbol = Character.fromJson("^");
    const expressionNumberKind = ExpressionNumberKind.BIG_DECIMAL;
    const groupingSeparator = Character.fromJson(",");
    const locale = Locale.fromJson("EN-NZ");
    const name = new SpreadsheetName("Spreadsheet-name-123");
    const negativeSign = Character.fromJson("-");
    const numberFormatPattern = SpreadsheetNumberFormatPattern.fromJson("#.##");
    const numberParsePatterns = SpreadsheetNumberParsePatterns.fromJson("#.##");
    const percentSymbol = Character.fromJson("%");
    const positiveSign = Character.fromJson("+");
    const precision = 1;
    const roundingMode = RoundingMode.FLOOR;
    const selection = SpreadsheetCellReference.parse("Z99")
        .setAnchor();
    const style = TextStyle.EMPTY
        .set("width", PixelLength.parse("123px"));
    const textFormatPattern = SpreadsheetTextFormatPattern.fromJson("@@");
    const timeFormatPattern = SpreadsheetTimeFormatPattern.fromJson("hhmm");
    const timeParsePatterns = SpreadsheetTimeParsePatterns.fromJson("hhmmss");
    const twoDigitYear = 80;
    const valueSeparator = Character.fromJson(",");
    const viewportCell = SpreadsheetCellReference.parse("A99");

    const metadata = SpreadsheetMetadata.EMPTY
        .set(SpreadsheetMetadata.CELL_CHARACTER_WIDTH, cellCharacterWidth)
        .set(SpreadsheetMetadata.CURRENCY_SYMBOL, currencySymbol)
        .set(SpreadsheetMetadata.DATE_FORMAT_PATTERN, dateFormatPattern)
        .set(SpreadsheetMetadata.DATE_PARSE_PATTERNS, dateParsePatterns)
        .set(SpreadsheetMetadata.DATETIME_OFFSET, dateTimeOffset)
        .set(SpreadsheetMetadata.DATETIME_FORMAT_PATTERN, dateTimeFormatPattern)
        .set(SpreadsheetMetadata.DATETIME_PARSE_PATTERNS, dateTimeParsePatterns)
        .set(SpreadsheetMetadata.DECIMAL_SEPARATOR, decimalSeparator)
        .set(SpreadsheetMetadata.DEFAULT_YEAR, defaultYear)
        .set(SpreadsheetMetadata.EXPONENT_SYMBOL, exponentSymbol)
        .set(SpreadsheetMetadata.EXPRESSION_NUMBER_KIND, expressionNumberKind)
        .set(SpreadsheetMetadata.GROUPING_SEPARATOR, groupingSeparator)
        .set(SpreadsheetMetadata.LOCALE, locale)
        .set(SpreadsheetMetadata.NEGATIVE_SIGN, negativeSign)
        .set(SpreadsheetMetadata.NUMBER_FORMAT_PATTERN, numberFormatPattern)
        .set(SpreadsheetMetadata.NUMBER_PARSE_PATTERNS, numberParsePatterns)
        .set(SpreadsheetMetadata.PERCENTAGE_SYMBOL, percentSymbol)
        .set(SpreadsheetMetadata.POSITIVE_SIGN, positiveSign)
        .set(SpreadsheetMetadata.PRECISION, precision)
        .set(SpreadsheetMetadata.ROUNDING_MODE, roundingMode)
        .set(SpreadsheetMetadata.SELECTION, selection)
        .set(SpreadsheetMetadata.SPREADSHEET_NAME, name)
        .set(SpreadsheetMetadata.STYLE, style)
        .set(SpreadsheetMetadata.TEXT_FORMAT_PATTERN, textFormatPattern)
        .set(SpreadsheetMetadata.TIME_FORMAT_PATTERN, timeFormatPattern)
        .set(SpreadsheetMetadata.TIME_PARSE_PATTERNS, timeParsePatterns)
        .set(SpreadsheetMetadata.TWO_DIGIT_YEAR, twoDigitYear)
        .set(SpreadsheetMetadata.VALUE_SEPARATOR, valueSeparator)
        .set(SpreadsheetMetadata.VIEWPORT_CELL, viewportCell);

    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.CELL_CHARACTER_WIDTH)).toEqual(cellCharacterWidth);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.CURRENCY_SYMBOL)).toEqual(currencySymbol);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.DATE_FORMAT_PATTERN)).toEqual(dateFormatPattern);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.DATE_PARSE_PATTERNS)).toEqual(dateParsePatterns);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.DATETIME_OFFSET)).toEqual(dateTimeOffset);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.DATETIME_FORMAT_PATTERN)).toEqual(dateTimeFormatPattern);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.DATETIME_PARSE_PATTERNS)).toEqual(dateTimeParsePatterns);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.DECIMAL_SEPARATOR)).toEqual(decimalSeparator);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.DEFAULT_YEAR)).toEqual(defaultYear);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.EXPONENT_SYMBOL)).toEqual(exponentSymbol);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.EXPRESSION_NUMBER_KIND)).toEqual(expressionNumberKind);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.GROUPING_SEPARATOR)).toEqual(groupingSeparator);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.LOCALE)).toEqual(locale);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.NEGATIVE_SIGN)).toEqual(negativeSign);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.NUMBER_FORMAT_PATTERN)).toEqual(numberFormatPattern);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.NUMBER_PARSE_PATTERNS)).toEqual(numberParsePatterns);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.PERCENTAGE_SYMBOL)).toEqual(percentSymbol);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.POSITIVE_SIGN)).toEqual(positiveSign);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.PRECISION)).toEqual(precision);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.ROUNDING_MODE)).toEqual(roundingMode);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.SELECTION)).toEqual(selection);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_NAME)).toEqual(name);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.STYLE)).toEqual(style);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.TEXT_FORMAT_PATTERN)).toEqual(textFormatPattern);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.TIME_FORMAT_PATTERN)).toEqual(timeFormatPattern);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.TIME_PARSE_PATTERNS)).toEqual(timeParsePatterns);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.TWO_DIGIT_YEAR)).toEqual(twoDigitYear);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.VALUE_SEPARATOR)).toEqual(valueSeparator);
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL)).toEqual(viewportCell);
});

// effectiveStyle.......................................................................................................

test("effectiveStyle EMPTY", () => {
    expect(SpreadsheetMetadata.EMPTY.effectiveStyle()).toEqual(TextStyle.EMPTY);
});

test("effectiveStyle EMPTY default", () => {
    const style = {
        "color": "#123456",
    };

    expect(SpreadsheetMetadata.fromJson({
        style: style,
    }).effectiveStyle()).toEqual(TextStyle.fromJson(style));
});

test("effectiveStyle merged styles", () => {
    expect(SpreadsheetMetadata.fromJson({
        style: {
            "color": "#123456",
        },
        "_defaults": {
            style: {
                "background-color": "#ffffff",
            }
        }
    }).effectiveStyle()).toEqual(TextStyle.fromJson({
        "background-color": "#ffffff",
        "color": "#123456",
    }));
});

test("effectiveStyle merged styles and default clash", () => {
    expect(SpreadsheetMetadata.fromJson({
        style: {
            "color": "#123456",
        },
        "_defaults": {
            style: {
                "background-color": "#ffffff",
                "color": "#ffffff",
            }
        }
    }).effectiveStyle()).toEqual(TextStyle.fromJson({
        "background-color": "#ffffff",
        "color": "#123456",
    }));
});

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

test("equals different property values", () => {
    expect(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-id": "111",
        }
    ).equals(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-id": "222",
        }
    ))).toEqual(false);
});

test("equals different property values", () => {
    expect(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-id": "111",
            "spreadsheet-name": "Spreadsheet-name-567",
        }
    ).equals(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-id": "222",
            "spreadsheet-name": "different-Spreadsheet-name",
        }
    ))).toEqual(false);
});

test("equals different property values with defaults", () => {
    expect(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-id": "111",
            "_defaults": {
                "spreadsheet-name": "Spreadsheet-name-567",
            }
        }
    ).equals(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-id": "222",
            "_defaults": {
                "spreadsheet-name": "different-Spreadsheet-name",
            }
        }
    ))).toEqual(false);
});

test("equals EMPTY true", () => {
    expect(SpreadsheetMetadata.EMPTY.equals(SpreadsheetMetadata.EMPTY))
        .toEqual(true);
});

test("equals different properties count less", () => {
    expect(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-id": "1234",
        }
    ).equals(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-id": "1234",
            "spreadsheet-name": "Spreadsheet-name-567",
        }
    ))).toEqual(false);
});

test("equals different properties count more", () => {
    expect(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-id": "1234",
            "spreadsheet-name": "Spreadsheet-name-567",
        }
    ).equals(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-id": "1234",
        }
    ))).toEqual(false);
});

test("equals different properties", () => {
    expect(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-id": "1234",
        }
    ).equals(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-name": "Spreadsheet-name-567",
        }
    ))).toEqual(false);
});

test("equals same property different values", () => {
    expect(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-id": "1234",
        }
    ).equals(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-id": "5678",
        }
    ))).toEqual(false);
});

test("equals same property values", () => {
    expect(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-id": "1234",
            "spreadsheet-name": "Spreadsheet-name-567",
        }
    ).equals(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-id": "1234",
            "spreadsheet-name": "Spreadsheet-name-567",
        }
    ))).toEqual(true);
});

test("equals same property values with defaults", () => {
    expect(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-id": "111",
            "_defaults": {
                "spreadsheet-name": "Spreadsheet-name-567",
            }
        }
    ).equals(SpreadsheetMetadata.fromJson(
        {
            "spreadsheet-id": "111",
            "_defaults": {
                "spreadsheet-name": "Spreadsheet-name-567",
            }
        }
    ))).toEqual(true);
});

// viewportShouldLoadCells...............................................................................................

function testViewportShouldLoadCells(titleSuffix, left, right, result) {
    test("viewportShouldLoadCells " + titleSuffix + " " + result, () => {
        expect(SpreadsheetMetadata.fromJson(left)
            .viewportShouldLoadCells(SpreadsheetMetadata.fromJson(right))
        ).toBe(result);
    });
}

testViewportShouldLoadCells(
    "id different",
    {
        "spreadsheet-id": "123",
    },
    {
        "spreadsheet-id": "456",
    },
    true
);

testViewportShouldLoadCells(
    "id same",
    {
        "spreadsheet-id": "123",
    },
    {
        "spreadsheet-id": "123",
    },
    false
);

testViewportShouldLoadCells(
    "id & name same",
    {
        "spreadsheet-id": "123",
        "spreadsheet-name": "SpreadsheetName456",
    },
    {
        "spreadsheet-id": "123",
        "spreadsheet-name": "SpreadsheetName456",
    },
    false
);

testViewportShouldLoadCells(
    "id & name different",
    {
        "spreadsheet-id": "123",
        "spreadsheet-name": "SpreadsheetName456",
    },
    {
        "spreadsheet-id": "123",
        "spreadsheet-name": "SpreadsheetName999",
    },
    false
);

testViewportShouldLoadCells(
    "id & name different",
    {
        "spreadsheet-id": "123",
        "spreadsheet-name": "SpreadsheetName456",
    },
    {
        "spreadsheet-id": "456",
        "spreadsheet-name": "SpreadsheetName999",
    },
    true
);

testViewportShouldLoadCells(
    "currency different",
    {
        "spreadsheet-id": "123",
        "currency-symbol": "$AUD",
    },
    {
        "spreadsheet-id": "123",
        "currency-symbol": "Different",
    },
    true
);

testViewportShouldLoadCells(
    "currency different 2",
    {
        "spreadsheet-id": "123",
        "currency-symbol": "$AUD",
    },
    {
        "spreadsheet-id": "123",
    },
    true
);

testViewportShouldLoadCells(
    "currency same",
    {
        "spreadsheet-id": "123",
        "currency-symbol": "$AUD",
    },
    {
        "spreadsheet-id": "123",
        "currency-symbol": "$AUD",
    },
    false
);

testViewportShouldLoadCells(
    "different selection",
    {
        "spreadsheet-id": "123",
        "selection": SpreadsheetCellReference.parse("A1").setAnchor().toJson(),
    },
    {
        "spreadsheet-id": "123",
        "selection": SpreadsheetCellReference.parse("B2").setAnchor().toJson(),
    },
    false
);

testViewportShouldLoadCells(
    "different viewport-cell",
    {
        "spreadsheet-id": "123",
        "viewport-cell": SpreadsheetCellReference.parse("A1").toJson(),
    },
    {
        "spreadsheet-id": "123",
        "viewport-cell": SpreadsheetCellReference.parse("B2").toJson(),
    },
    true
);

// viewportShouldSaveMetadata...............................................................................................

function testViewportShouldSaveMetadata(titleSuffix, left, right, result) {
    test("viewportShouldSaveMetadata " + titleSuffix + " " + result, () => {
        expect(SpreadsheetMetadata.fromJson(left)
            .viewportShouldSaveMetadata(SpreadsheetMetadata.fromJson(right))
        ).toBe(result);
    });
}

testViewportShouldSaveMetadata(
    "id different",
    {
        "spreadsheet-id": "123",
    },
    {
        "spreadsheet-id": "456",
    },
    false
);

testViewportShouldSaveMetadata(
    "id same",
    {
        "spreadsheet-id": "123",
    },
    {
        "spreadsheet-id": "123",
    },
    false
);

testViewportShouldSaveMetadata(
    "id & name same",
    {
        "spreadsheet-id": "123",
        "spreadsheet-name": "SpreadsheetName456",
    },
    {
        "spreadsheet-id": "123",
        "spreadsheet-name": "SpreadsheetName456",
    },
    false
);

testViewportShouldSaveMetadata(
    "id & name different",
    {
        "spreadsheet-id": "123",
        "spreadsheet-name": "SpreadsheetName456",
    },
    {
        "spreadsheet-id": "123",
        "spreadsheet-name": "SpreadsheetName999",
    },
    false
);

testViewportShouldSaveMetadata(
    "id & name different",
    {
        "spreadsheet-id": "123",
        "spreadsheet-name": "SpreadsheetName456",
    },
    {
        "spreadsheet-id": "456",
        "spreadsheet-name": "SpreadsheetName999",
    },
    false
);

testViewportShouldSaveMetadata(
    "currency different",
    {
        "spreadsheet-id": "123",
        "currency-symbol": "$AUD",
    },
    {
        "spreadsheet-id": "123",
        "currency-symbol": "Different",
    },
    false
);

testViewportShouldSaveMetadata(
    "currency different 2",
    {
        "spreadsheet-id": "123",
        "currency-symbol": "$AUD",
    },
    {
        "spreadsheet-id": "123",
    },
    false
);

testViewportShouldSaveMetadata(
    "currency same",
    {
        "spreadsheet-id": "123",
        "currency-symbol": "$AUD",
    },
    {
        "spreadsheet-id": "123",
        "currency-symbol": "$AUD",
    },
    false
);

testViewportShouldSaveMetadata(
    "same selection",
    {
        "spreadsheet-id": "123",
        "selection": SpreadsheetCellReference.parse("A1").setAnchor().toJson(),
    },
    {
        "spreadsheet-id": "123",
        "selection": SpreadsheetCellReference.parse("A1").setAnchor().toJson(),
    },
    false
);

testViewportShouldSaveMetadata(
    "different selection",
    {
        "spreadsheet-id": "123",
        "selection": SpreadsheetCellReference.parse("A1").setAnchor().toJson(),
    },
    {
        "spreadsheet-id": "123",
        "selection": SpreadsheetCellReference.parse("B2").setAnchor().toJson(),
    },
    true
);

testViewportShouldSaveMetadata(
    "same viewport-cell",
    {
        "spreadsheet-id": "123",
        "viewport-cell": SpreadsheetCellReference.parse("A1").toJson(),
    },
    {
        "spreadsheet-id": "123",
        "viewport-cell": SpreadsheetCellReference.parse("A1").toJson(),
    },
    false
);

testViewportShouldSaveMetadata(
    "different viewport-cell",
    {
        "spreadsheet-id": "123",
        "viewport-cell": SpreadsheetCellReference.parse("A1").toJson(),
    },
    {
        "spreadsheet-id": "123",
        "viewport-cell": SpreadsheetCellReference.parse("B2").toJson(),
    },
    true
);

// helpers..............................................................................................................

function checkSpreadsheetId(metadata, id) {
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID)).toBe(id);
}

function checkSpreadsheetName(metadata, name) {
    expect(metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_NAME)).toStrictEqual(name);
}

// checks toJson and toString
function checkJson(metadata, json) {
    expect(metadata.toJson()).toStrictEqual(json);
    expect(metadata.toString()).toBe(JSON.stringify(json));
}
