import UrlPath from "./UrlPath";

function urlPath() {
    return UrlPath.parse("/path?a=c");
}

// parse...............................................................................................................

function testParse(url, path, queryParameters) {
    test("Parse " + url, () => {
        const urlPath = UrlPath.parse(url);

        expect(urlPath.path())
            .toStrictEqual(path);
        expect(urlPath.queryParameters())
            .toStrictEqual(queryParameters);
    });
}

testParse("", "", {});
testParse("/", "/", {});
testParse("/abc", "/abc", {});
testParse("/abc%20def", "/abc def", {});
testParse("/abc/123", "/abc/123", {});

testParse("/abc?def",
    "/abc",
    {
        "def": []
    }
);

testParse("/abc?def=ghi",
    "/abc",
    {
        "def": ["ghi"]
    }
);

testParse("/abc?%20=xyz",
    "/abc",
    {
        " ": ["xyz"]
    }
);

testParse("/abc?def=%20",
    "/abc",
    {
        "def": [" "]
    }
);

testParse(
    "/abc?def=ghi&xyz=123",
    "/abc",
    {
        "def": ["ghi"],
        "xyz": ["123"],
    }
);

testParse("/abc?def=ghi&def=1",
    "/abc",
    {
        "def": ["ghi", "1"]
    }
);

// toQuerystring...............................................................................................................

function testToQueryString(queryParameters, queryString) {
    test("toQueryString " + JSON.stringify(queryParameters), () => {
        expect(UrlPath.toQueryString(queryParameters))
            .toStrictEqual(queryString);
    });
}

testToQueryString(
    {},
    ""
);

testToQueryString(
    {
        "a": []
    },
    "?a"
);

testToQueryString(
    {
        "a": ["1"]
    },
    "?a=1"
);

testToQueryString(
    {
        "x y": ["3 4"]
    },
    "?x%20y=3%204"
);

testToQueryString(
    {
        "a": ["11", "22"]
    },
    "?a=11&a=22"
);

testToQueryString(
    {
        "x": ["1234"],
        "y": ["5678"]
    },
    "?x=1234&y=5678"
);

testToQueryString(
    {
        "a": ["1", "2"],
        "b": ["99"]
    },
    "?a=1&a=2&b=99"
);

// setPath...............................................................................................................

function testSetPath(url, path, toString) {
    test("url setPath " + path, () => {
        expect(UrlPath.parse(url).setPath(path).toString())
            .toStrictEqual(toString);
    });
}

testSetPath(
    "/a/b",
    "/c",
    "/c"
);

testSetPath(
    "/a/b?x=y",
    "/c",
    "/c?x=y"
);

// equals...............................................................................................................

test("equals different path", () => {
    expect(urlPath().equals(UrlPath.parse("/different")))
        .toBeFalse();
});

test("equals different query parameters", () => {
    expect(UrlPath.parse("/same?different=1").equals(UrlPath.parse("/same?different=23")))
        .toBeFalse();
});

// toString...............................................................................................................

function testToString(urlPath, toString) {
    test("toString " + urlPath, () => {
        expect(UrlPath.parse(urlPath).toString())
            .toStrictEqual(toString);
    });
}

testToString("/a/b", "/a/b");
testToString("/a/b?", "/a/b");
testToString("/a/b?x=y", "/a/b?x=y");
