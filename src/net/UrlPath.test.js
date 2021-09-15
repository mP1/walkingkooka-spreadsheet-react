import UrlPath from "./UrlPath";

function urlPath() {
    return UrlPath.parse("/path?a=c");
}

// parse...............................................................................................................

function testParse(url, path, queryParameters) {
    test("Parse " + url, () => {
        const urlPath = UrlPath.parse(url);
        console.log("urlPath\n" + urlPath.path() + "\n" + JSON.stringify(urlPath.queryParameters()));
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

// equals...............................................................................................................

test("equals different path", () => {
    expect(urlPath().equals(UrlPath.parse("/different")))
        .toBeFalse();
});

test("equals different query parameters", () => {
    expect(UrlPath.parse("/same?different=1").equals(UrlPath.parse("/same?different=23")))
        .toBeFalse();
});
