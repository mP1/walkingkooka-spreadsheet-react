import SpreadsheetCellReference from "../reference/SpreadsheetCellReference.js";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";

function tokenize(pathname) {
    return pathname && pathname.startsWith("/") ?
        split(pathname) :
        [];
}

function split(pathname) {
    const components = pathname.split("/");
    components.shift();
    return components;
}

function join(tokens) {
    if(!tokens){
        throw new Error("Missing tokens");
    }
    var s = "";
    for(var i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        // stop joining if a undefined/null token is found.
        if(!token && token !== ""){
            break;
        }
        s = s + "/" + token;
    }

    return s === "" ? "/" : s;
}

function isSettingsToken(token) {
    var valid;

    switch(token) {
        case SpreadsheetHistoryHash.SETTINGS_METADATA:
        case SpreadsheetHistoryHash.SETTINGS_TEXT:
        case SpreadsheetHistoryHash.SETTINGS_NUMBER:
        case SpreadsheetHistoryHash.SETTINGS_DATE_TIME:
        case SpreadsheetHistoryHash.SETTINGS_STYLE:
            valid = true;
            break;
        default:
            valid = false;
            break;
    }
    return valid;
}

/**
 * A collection of utilities that support history hash.
 */
export default class SpreadsheetHistoryHash {

    static SPREADSHEET_ID = "spreadsheet-id";
    static SPREADSHEET_NAME = "spreadsheet-name";
    static SPREADSHEET_NAME_EDIT = "name";
    static CELL = "cell";
    static CELL_FORMULA = "formula";
    static LABEL = "label";
    static NAVIGATE = "navigate";
    static SETTINGS = "settings";
    static SETTINGS_SECTION = "settings-section";

    // these tokens are optional and only one may appear after SETTINGS
    static SETTINGS_METADATA = "metadata";
    static SETTINGS_TEXT = "text";
    static SETTINGS_NUMBER = "number";
    static SETTINGS_DATE_TIME = "date-time";
    static SETTINGS_STYLE = "style";

    /**
     * Parsers the path extracting tokens returning an object with valid tokens. Invalid combination will be removed.
     */
    static parse(pathname) {
        const sourceTokens = tokenize(pathname);

        var valid = true;

        var spreadsheetId = sourceTokens.shift();
        var spreadsheetName;
        var nameEdit;
        var cell;
        var formula;
        var label;
        var navigate;
        var settings;
        var settingsSection;

        if(null != spreadsheetId){
            spreadsheetName = sourceTokens.shift();
            if(null != spreadsheetName){

                while(sourceTokens.length > 0 && valid) {
                    const token = sourceTokens.shift();

                    switch(token) {
                        case SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT:
                            if(cell){
                                valid = false;
                                break;
                            }
                            nameEdit = true;
                            break;
                        case SpreadsheetHistoryHash.CELL:
                            if(nameEdit || sourceTokens.length === 0){
                                valid = false;
                                break;
                            }

                            try {
                                cell = SpreadsheetCellReference.parse(sourceTokens.shift());
                            } catch(invalid) {
                                valid = false;
                            }
                            break;
                        case SpreadsheetHistoryHash.CELL_FORMULA:
                            if(!cell){
                                valid = false;
                                break;
                            }
                            formula = true;
                            break;
                        case SpreadsheetHistoryHash.LABEL:
                            if(nameEdit || sourceTokens.length === 0){
                                valid = false;
                                break;
                            }

                            try {
                                label = SpreadsheetLabelName.parse(sourceTokens.shift());
                            } catch(invalid) {
                                valid = false;
                            }
                            break;
                        case SpreadsheetHistoryHash.NAVIGATE:
                            navigate = true;
                            break;
                        case SpreadsheetHistoryHash.SETTINGS:
                            settings = true;
                            const possibleSection = sourceTokens.shift();
                            if(null != possibleSection){
                                if(isSettingsToken(possibleSection)){
                                    settingsSection = possibleSection;
                                }
                            }
                            valid = true;
                            break;
                        default:
                            valid = false;
                            break;
                    }
                }
            }
        }

        const destTokens = {};

        if(spreadsheetId){
            destTokens[SpreadsheetHistoryHash.SPREADSHEET_ID] = spreadsheetId;

            if(spreadsheetName){
                destTokens[SpreadsheetHistoryHash.SPREADSHEET_NAME] = spreadsheetName;

                if(valid){
                    if(nameEdit){
                        destTokens[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT] = nameEdit;
                    }
                    if(cell){
                        destTokens[SpreadsheetHistoryHash.CELL] = cell;
                        if(formula){
                            destTokens[SpreadsheetHistoryHash.CELL_FORMULA] = formula;
                        }
                    }
                    if(label){
                        destTokens[SpreadsheetHistoryHash.LABEL] = label;
                    }
                    if(navigate){
                        destTokens[SpreadsheetHistoryHash.NAVIGATE] = navigate;
                    }
                    if(settings){
                        destTokens[SpreadsheetHistoryHash.SETTINGS] = settings;

                        if(settingsSection){
                            destTokens[SpreadsheetHistoryHash.SETTINGS_SECTION] = settingsSection;
                        }
                    }
                }
            }
        }

        return destTokens;
    }

    /**
     * Merges the tokens from the given current history hash tokens and the updates.
     */
    static merge(current, replacements) {
        // get the current
        var spreadsheetId = current[SpreadsheetHistoryHash.SPREADSHEET_ID];
        var spreadsheetName = current[SpreadsheetHistoryHash.SPREADSHEET_NAME];
        var nameEdit = current[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT];
        var cell = current[SpreadsheetHistoryHash.CELL];
        var formula = current[SpreadsheetHistoryHash.CELL_FORMULA];
        var label = current[SpreadsheetHistoryHash.LABEL];
        var navigate = current[SpreadsheetHistoryHash.NAVIGATE];
        var settings = current[SpreadsheetHistoryHash.SETTINGS];
        var settingsSection = current[SpreadsheetHistoryHash.SETTINGS_SECTION];

        // try replacing...
        if(replacements.hasOwnProperty(SpreadsheetHistoryHash.SPREADSHEET_ID)){
            spreadsheetId = replacements[SpreadsheetHistoryHash.SPREADSHEET_ID];
        }

        if(replacements.hasOwnProperty(SpreadsheetHistoryHash.SPREADSHEET_NAME)){
            spreadsheetName = replacements[SpreadsheetHistoryHash.SPREADSHEET_NAME];
        }

        if(replacements.hasOwnProperty(SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT)){
            nameEdit = !!replacements[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT];
            if(nameEdit){
                cell = null;
                formula = null;
                label = null;
                navigate = null;
            }
        }

        if(replacements.hasOwnProperty(SpreadsheetHistoryHash.CELL)){
            cell = replacements[SpreadsheetHistoryHash.CELL];
        }

        if(replacements.hasOwnProperty(SpreadsheetHistoryHash.CELL_FORMULA)){
            formula = replacements[SpreadsheetHistoryHash.CELL_FORMULA];
        }

        if(replacements.hasOwnProperty(SpreadsheetHistoryHash.LABEL)){
            label = replacements[SpreadsheetHistoryHash.LABEL];
        }

        if(replacements.hasOwnProperty(SpreadsheetHistoryHash.NAVIGATE)){
            navigate = replacements[SpreadsheetHistoryHash.NAVIGATE];
        }

        if(replacements.hasOwnProperty(SpreadsheetHistoryHash.SETTINGS)){
            settings = replacements[SpreadsheetHistoryHash.SETTINGS];
            settingsSection = replacements[SpreadsheetHistoryHash.SETTINGS_SECTION];
            if(settingsSection && !isSettingsToken(settingsSection)){
                settingsSection = null;
            }
        }

        var valid = true;

        // create the resulting verified history token pathname
        const verified = [];
        if(null != spreadsheetId){
            verified.push(spreadsheetId);
            if(null != spreadsheetName){
                verified.push(spreadsheetName);
            }
        }

        if(valid){
            if(nameEdit){
                verified.push(SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT);
            }

            if(cell){
                verified.push(SpreadsheetHistoryHash.CELL);
                verified.push(cell.toString());
            }

            if(!!formula){
                verified.push(SpreadsheetHistoryHash.CELL_FORMULA);
            }

            if(label){
                verified.push(SpreadsheetHistoryHash.LABEL);
                verified.push(label.toString());
            }

            if(navigate){
                verified.push(SpreadsheetHistoryHash.NAVIGATE);
            }

            if(!!settings){
                verified.push(SpreadsheetHistoryHash.SETTINGS);

                if(settingsSection){
                    verified.push(settingsSection);
                }
            }
        }

        return join(verified);
    }

    /**
     * Parses the current history hash, merges the replacements and pushes the new hash.
     */
    static parseMergeAndPush(history, replacements) {
        if(null == history){
            throw new Error("Missing history");
        }

        const currentPathname = history.location.pathname;
        const tokens = SpreadsheetHistoryHash.parse(currentPathname);

        const updatedPathname = SpreadsheetHistoryHash.merge(
            tokens,
            replacements
        );
        if(currentPathname !== updatedPathname){
            console.log("parseMergeAndPush history push \"" + currentPathname + "\"");
            history.push(updatedPathname);
        }else {
            console.log("parseMergeAndPush history unchanged \"" + currentPathname + "\" new \"" + updatedPathname + "\"");
        }
    }

    constructor(history) {
        if(null == history){
            throw new Error("Missing history");
        }
        this.history = history;
    }
}