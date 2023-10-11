import CharSequences from "../../CharSequences.js";
import ListenerCollection from "../../event/ListenerCollection.js";
import MenuItem from "@mui/material/MenuItem";
import Preconditions from "../../Preconditions.js";
import React from 'react';
import SpreadsheetCellClearHistoryHashToken from "../reference/cell/SpreadsheetCellClearHistoryHashToken.js";
import SpreadsheetCellDeleteHistoryHashToken from "../reference/cell/SpreadsheetCellDeleteHistoryHashToken.js";
import SpreadsheetCellFormatPatternEditHistoryHashToken
    from "../format/SpreadsheetCellFormatPatternEditHistoryHashToken.js";
import SpreadsheetCellFormatPatternKind from "../format/SpreadsheetCellFormatPatternKind.js";
import SpreadsheetCellFormatPatternSaveHistoryHashToken
    from "../format/SpreadsheetCellFormatPatternSaveHistoryHashToken.js";
import SpreadsheetCellFormulaEditHistoryHashToken
    from "../reference/cell/formula/SpreadsheetCellFormulaEditHistoryHashToken.js";
import SpreadsheetCellFormulaSaveHistoryHashToken
    from "../reference/cell/formula/SpreadsheetCellFormulaSaveHistoryHashToken.js";
import SpreadsheetCellFreezeHistoryHashToken from "../reference/cell/SpreadsheetCellFreezeHistoryHashToken.js";
import SpreadsheetCellHistoryHashToken from "../reference/cell/SpreadsheetCellHistoryHashToken.js";
import SpreadsheetCellMenuHistoryHashToken from "../reference/cell/SpreadsheetCellMenuHistoryHashToken.js";
import SpreadsheetCellParsePatternEditHistoryHashToken
    from "../format/SpreadsheetCellParsePatternEditHistoryHashToken.js";
import SpreadsheetCellParsePatternKind from "../format/SpreadsheetCellParsePatternKind.js";
import SpreadsheetCellParsePatternSaveHistoryHashToken
    from "../format/SpreadsheetCellParsePatternSaveHistoryHashToken.js";
import spreadsheetCellRangeCellReferenceOrLabelParse
    from "../reference/cell/SpreadsheetCellRangeCellReferenceOrLabelParse.js";
import SpreadsheetCellReference from "../reference/cell/SpreadsheetCellReference.js";
import spreadsheetCellReferenceOrLabelNameParse from "../reference/cell/SpreadsheetCellReferenceOrLabelNameParse.js";
import SpreadsheetCellSelectHistoryHashToken from "../reference/cell/SpreadsheetCellSelectHistoryHashToken.js";
import SpreadsheetCellStyleEditHistoryHashToken
    from "../reference/cell/style/SpreadsheetCellStyleEditHistoryHashToken.js";
import SpreadsheetCellStyleSaveHistoryHashToken
    from "../reference/cell/style/SpreadsheetCellStyleSaveHistoryHashToken.js";
import SpreadsheetCellUnFreezeHistoryHashToken from "../reference/cell/SpreadsheetCellUnFreezeHistoryHashToken.js";
import SpreadsheetColumnOrRowClearHistoryHashToken
    from "../reference/columnrow/SpreadsheetColumnOrRowClearHistoryHashToken.js";
import SpreadsheetColumnOrRowDeleteHistoryHashToken
    from "../reference/columnrow/SpreadsheetColumnOrRowDeleteHistoryHashToken.js";
import SpreadsheetColumnOrRowFreezeHistoryHashToken
    from "../reference/columnrow/SpreadsheetColumnOrRowFreezeHistoryHashToken.js";
import SpreadsheetColumnOrRowHistoryHashToken from "../reference/columnrow/SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertAfterHistoryHashToken
    from "../reference/columnrow/SpreadsheetColumnOrRowInsertAfterHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertBeforeHistoryHashToken
    from "../reference/columnrow/SpreadsheetColumnOrRowInsertBeforeHistoryHashToken.js";
import SpreadsheetColumnOrRowMenuHistoryHashToken
    from "../reference/columnrow/SpreadsheetColumnOrRowMenuHistoryHashToken.js";
import SpreadsheetColumnOrRowSaveHistoryHashToken
    from "../reference/columnrow/SpreadsheetColumnOrRowSaveHistoryHashToken.js";
import SpreadsheetColumnOrRowSelectHistoryHashToken
    from "../reference/columnrow/SpreadsheetColumnOrRowSelectHistoryHashToken.js";
import SpreadsheetColumnOrRowUnFreezeHistoryHashToken
    from "../reference/columnrow/SpreadsheetColumnOrRowUnFreezeHistoryHashToken.js";
import SpreadsheetColumnReferenceRange from "../reference/columnrow/SpreadsheetColumnReferenceRange.js";
import SpreadsheetContextMenu from "../../widget/SpreadsheetContextMenu.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";
import SpreadsheetLabelMappingDeleteHistoryHashToken
    from "../reference/label/SpreadsheetLabelMappingDeleteHistoryHashToken.js";
import SpreadsheetLabelMappingEditHistoryHashToken
    from "../reference/label/SpreadsheetLabelMappingEditHistoryHashToken.js";
import SpreadsheetLabelMappingHistoryHashToken from "../reference/label/SpreadsheetLabelMappingHistoryHashToken.js";
import SpreadsheetLabelMappingSaveHistoryHashToken
    from "../reference/label/SpreadsheetLabelMappingSaveHistoryHashToken.js";
import SpreadsheetLabelName from "../reference/label/SpreadsheetLabelName.js";
import SpreadsheetMetadataDrawerWidgetHistoryHashTokens
    from "../meta/drawer/SpreadsheetMetadataDrawerWidgetHistoryHashTokens.js";
import SpreadsheetMetadataHistoryHashToken from "../meta/drawer/SpreadsheetMetadataHistoryHashToken.js";
import SpreadsheetMetadataSaveHistoryHashToken from "../meta/drawer/SpreadsheetMetadataSaveHistoryHashToken.js";
import SpreadsheetMetadataSelectHistoryHashToken from "../meta/drawer/SpreadsheetMetadataSelectHistoryHashToken.js";
import SpreadsheetName from "../meta/name/SpreadsheetName.js";
import SpreadsheetNameEditHistoryHashToken from "../meta/name/SpreadsheetNameEditHistoryHashToken.js";
import SpreadsheetNameHistoryHashToken from "../meta/name/SpreadsheetNameHistoryHashToken.js";
import SpreadsheetNameSaveHistoryHashToken from "../meta/name/SpreadsheetNameSaveHistoryHashToken.js";
import SpreadsheetRowReferenceRange from "../reference/columnrow/SpreadsheetRowReferenceRange.js";
import SpreadsheetSelectionHistoryHashToken from "../reference/SpreadsheetSelectionHistoryHashToken.js";
import SpreadsheetViewport from "../reference/viewport/SpreadsheetViewport.js";
import TextStyle from "../../text/TextStyle.js";

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

function copyTx(from, to) {
    if(from.hasOwnProperty(SpreadsheetHistoryHashTokens.TX_ID)){
        to[SpreadsheetHistoryHashTokens.TX_ID] = from[SpreadsheetHistoryHashTokens.TX_ID];
    }
    return to;
}

/**
 * A collection of utilities that support history hash.
 */
export default class SpreadsheetHistoryHash extends SpreadsheetHistoryHashTokens {

    /**
     * Parsers the path extracting tokens returning an object with valid tokens. Invalid combination will be removed.
     */
    static parse(hash, errors) {
        Preconditions.requireText(hash, "hash");
        Preconditions.requireFunction(errors, "errors");

        const historyHashTokens = SpreadsheetHistoryHashTokens.emptyTokens();
        const tokens = tokenize(hash);
        const spreadsheetId = tokens.shift();

        if(spreadsheetId){
            historyHashTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = spreadsheetId;

            var name;
            try {
                name = new SpreadsheetName(tokens.shift());
            } catch(ignore) {
            }

            if(name){
                historyHashTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = name;

                var spreadsheetNameEdit = null;

                var viewportToken = null;

                var label = null;

                var select = null;

                var metadata = null;

                Loop:
                    do {
                        var token = tokens.shift();

                        if(SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_PATH === token){
                            spreadsheetNameEdit = SpreadsheetNameEditHistoryHashToken.INSTANCE;
                            token = tokens.shift();

                            if(null != token){
                                switch(token) {
                                    case SpreadsheetHistoryHashTokens.SAVE:
                                        const saveName = tokens.shift();
                                        if(!saveName) {
                                            errors("Missing spreadsheet name");
                                            break Loop;
                                        }

                                        // /$id/$name/name/$new-spreadsheet-name
                                        spreadsheetNameEdit = new SpreadsheetNameSaveHistoryHashToken(
                                            new SpreadsheetName(
                                                decodeURIComponent(saveName)
                                            )
                                        );
                                        token = tokens.shift();
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }

                        // /cell/A1.........................................................................................
                        if(!spreadsheetNameEdit){
                            var viewport;

                            switch(token) {
                                case SpreadsheetHistoryHashTokens.CELL:
                                    var cellOrLabel;

                                    try {
                                        cellOrLabel = spreadsheetCellReferenceOrLabelNameParse(tokens.shift())
                                            .cellOrRange();
                                    } catch(invalid) {
                                        errors("Cell: " + invalid.message);
                                        break Loop;
                                    }
                                    token = tokens.shift();

                                    // /cell/A1:B2/$anchor
                                    viewport = new SpreadsheetViewport(cellOrLabel);

                                    for(const anchor of cellOrLabel.anchors()) {
                                        if(token === anchor.historyHashPath()){
                                            viewport = viewport.setAnchor(anchor);
                                            token = tokens.shift();
                                            break;
                                        }
                                    }

                                    viewportToken = new SpreadsheetCellSelectHistoryHashToken(viewport);

                                    switch(token) {
                                        case SpreadsheetHistoryHashTokens.CLEAR:
                                            viewportToken = new SpreadsheetCellClearHistoryHashToken(viewport);
                                            token = tokens.shift();
                                            break;
                                        case SpreadsheetHistoryHashTokens.DELETE:
                                            viewportToken = new SpreadsheetCellDeleteHistoryHashToken(viewport);
                                            token = tokens.shift();
                                            break;
                                        case SpreadsheetHistoryHashTokens.CELL_FORMULA:
                                            if(cellOrLabel instanceof SpreadsheetCellReference || cellOrLabel instanceof SpreadsheetLabelName){
                                                token = tokens.shift();

                                                if(null == token){
                                                    viewportToken = new SpreadsheetCellFormulaEditHistoryHashToken(viewport);
                                                }else {
                                                    switch(token) {
                                                        case SpreadsheetHistoryHashTokens.SAVE:
                                                            token = tokens.shift();
                                                            if(null == token){
                                                                errors("Missing formula text");
                                                                break Loop;
                                                            }
                                                            viewportToken = new SpreadsheetCellFormulaSaveHistoryHashToken(
                                                                viewport,
                                                                decodeURIComponent(token)
                                                            );
                                                            token = tokens.shift();
                                                            break;
                                                        default:
                                                            // not a formula save
                                                            viewportToken = new SpreadsheetCellFormulaEditHistoryHashToken(viewport);
                                                            break;
                                                    }
                                                }
                                            }
                                            break;
                                        case SpreadsheetHistoryHashTokens.FORMAT_PATTERN:
                                            token = tokens.shift();
                                            if(null == token){
                                                viewportToken = null;
                                                errors("Missing format-pattern kind");
                                                break;
                                            }
                                            var cellFormatPatternKind;

                                            for(const possibleCellFormatPatternKind of SpreadsheetCellFormatPatternKind.values()) {
                                                if(token === possibleCellFormatPatternKind.historyHashPath()){
                                                    cellFormatPatternKind = possibleCellFormatPatternKind;
                                                    break;
                                                }
                                            }

                                            if(!cellFormatPatternKind){
                                                errors("Unknown format-pattern kind: " + token);
                                                break Loop;
                                            }

                                            token = tokens.shift();
                                            if(null == token){
                                                viewportToken = new SpreadsheetCellFormatPatternEditHistoryHashToken(
                                                    viewport,
                                                    cellFormatPatternKind
                                                );
                                                token = tokens.shift();
                                            }else {
                                                switch(token) {
                                                    case SpreadsheetHistoryHashTokens.SAVE:
                                                        token = tokens.shift();
                                                        if(null != token){
                                                            viewportToken = new SpreadsheetCellFormatPatternSaveHistoryHashToken(
                                                                viewport,
                                                                cellFormatPatternKind,
                                                                "" === token ?
                                                                    null :
                                                                    cellFormatPatternKind.createPattern(
                                                                        decodeURIComponent(token)
                                                                    )
                                                            );
                                                            token = tokens.shift();
                                                        }else {
                                                            errors("Missing save value");
                                                            break Loop;
                                                        }
                                                        break;
                                                    default:
                                                        errors("Invalid format-pattern: " + token);
                                                        break Loop;
                                                }
                                            }
                                            break;
                                        case SpreadsheetHistoryHashTokens.FREEZE:
                                            if(cellOrLabel.canFreeze()){
                                                viewportToken = new SpreadsheetCellFreezeHistoryHashToken(viewport);
                                                token = tokens.shift();
                                            }
                                            break;
                                        case SpreadsheetHistoryHashTokens.MENU:
                                            viewportToken = new SpreadsheetCellMenuHistoryHashToken(
                                                viewport,
                                                new SpreadsheetContextMenu()
                                            );
                                            token = tokens.shift();
                                            break;
                                        case SpreadsheetHistoryHashTokens.PARSE_PATTERNS:
                                            token = tokens.shift();
                                            if(null == token){
                                                viewportToken = null;
                                                errors("Missing parse-pattern kind");
                                                break;
                                            }
                                            var cellParsePatternKind;

                                            for(const possibleCellParsePatternKind of SpreadsheetCellParsePatternKind.values()) {
                                                if(token === possibleCellParsePatternKind.historyHashPath()){
                                                    cellParsePatternKind = possibleCellParsePatternKind;
                                                    break;
                                                }
                                            }

                                            if(!cellParsePatternKind){
                                                errors("Unknown parse-pattern kind: " + token);
                                                break Loop;
                                            }

                                            token = tokens.shift();
                                            if(null == token){
                                                viewportToken = new SpreadsheetCellParsePatternEditHistoryHashToken(
                                                    viewport,
                                                    cellParsePatternKind
                                                );
                                                token = tokens.shift();
                                            }else {
                                                switch(token) {
                                                    case SpreadsheetHistoryHashTokens.SAVE:
                                                        token = tokens.shift();
                                                        if(null != token){
                                                            viewportToken = new SpreadsheetCellParsePatternSaveHistoryHashToken(
                                                                viewport,
                                                                cellParsePatternKind,
                                                                "" === token ?
                                                                    null :
                                                                    cellParsePatternKind.createPattern(
                                                                        decodeURIComponent(token)
                                                                    )
                                                            );
                                                            token = tokens.shift();
                                                        }else {
                                                            errors("Missing save value");
                                                            break Loop;
                                                        }
                                                        break;
                                                    default:
                                                        errors("Invalid parse-pattern: " + token);
                                                        break Loop;
                                                }
                                            }
                                            break;    
                                        case SpreadsheetHistoryHashTokens.STYLE:
                                            token = tokens.shift(); // style property name
                                            if(null != token){
                                                // cell/A1/style/font-style/italics etc.
                                                const stylePropertyName = token;

                                                if(TextStyle.isProperty(stylePropertyName)){
                                                    const styleAction = tokens.shift(); // style property command eg save
                                                    if(null == styleAction){
                                                        viewportToken = new SpreadsheetCellStyleEditHistoryHashToken(
                                                            viewport,
                                                            stylePropertyName
                                                        );

                                                        token = null;
                                                    }else {
                                                        switch(styleAction) {
                                                            case SpreadsheetHistoryHashTokens.SAVE:
                                                                token = tokens.shift();
                                                                if(token){
                                                                    viewportToken = new SpreadsheetCellStyleSaveHistoryHashToken(
                                                                        viewport,
                                                                        stylePropertyName,
                                                                        TextStyle.parseHistoryHashToken(
                                                                            stylePropertyName,
                                                                            encodeURIComponent(token)
                                                                        )
                                                                    );
                                                                    token = tokens.shift();
                                                                }else {
                                                                    errors("Missing save value");
                                                                    break Loop;
                                                                }
                                                                break;
                                                            default:
                                                                errors("Invalid style: " + styleAction);
                                                                break Loop;
                                                        }
                                                    }
                                                }else {
                                                    errors("Invalid style property " + CharSequences.quoteAndEscape(stylePropertyName));
                                                    break Loop;
                                                }
                                            } else {
                                                errors("Missing style property");
                                                break Loop;
                                            }
                                            break;
                                        case SpreadsheetHistoryHashTokens.UNFREEZE:
                                            if(cellOrLabel.canFreeze()){
                                                viewportToken = new SpreadsheetCellUnFreezeHistoryHashToken(viewport);
                                                token = tokens.shift();
                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                    break;
                                case SpreadsheetHistoryHashTokens.COLUMN:
                                case SpreadsheetHistoryHashTokens.ROW:
                                    var columnOrRow;
                                    if(SpreadsheetHistoryHashTokens.COLUMN === token){
                                        try {
                                            columnOrRow = SpreadsheetColumnReferenceRange.parse(tokens.shift())
                                                .columnOrRange();
                                        } catch(invalid) {
                                            errors("Column: " + invalid.message);
                                            break Loop;
                                        }
                                        token = tokens.shift();
                                    }else {
                                        try {
                                            columnOrRow = SpreadsheetRowReferenceRange.parse(tokens.shift())
                                                .rowOrRange();
                                        } catch(invalid) {
                                            errors("Row: " + invalid.message);
                                            break Loop;
                                        }
                                        token = tokens.shift();
                                    }
                                    viewport = new SpreadsheetViewport(columnOrRow);

                                    // column | row then anchor.................................................................
                                    for(const anchor of columnOrRow.anchors()) {
                                        if(token === anchor.historyHashPath()){
                                            viewport = viewport.setAnchor(anchor);
                                            token = tokens.shift();
                                            break;
                                        }
                                    }
                                    viewportToken = new SpreadsheetColumnOrRowSelectHistoryHashToken(viewport);

                                    switch(token) {
                                        case SpreadsheetHistoryHashTokens.CLEAR:
                                            viewportToken = new SpreadsheetColumnOrRowClearHistoryHashToken(viewport);
                                            token = tokens.shift();
                                            break;
                                        case SpreadsheetHistoryHashTokens.DELETE:
                                            viewportToken = new SpreadsheetColumnOrRowDeleteHistoryHashToken(viewport);
                                            token = tokens.shift();
                                            break;
                                        case SpreadsheetHistoryHashTokens.FREEZE:
                                            // column/A/freeze OR /row/1/freeze
                                            if(columnOrRow.canFreeze()){
                                                viewportToken = new SpreadsheetColumnOrRowFreezeHistoryHashToken(viewport);
                                                token = tokens.shift();
                                            }
                                            break;
                                        case SpreadsheetHistoryHashTokens.HIDDEN:
                                            const hiddenValue = tokens.shift();
                                            if(!hiddenValue){
                                                break Loop; // value required but missing.
                                            }
                                            viewportToken = new SpreadsheetColumnOrRowSaveHistoryHashToken(
                                                viewport,
                                                token,
                                                "true" === hiddenValue ? true :
                                                    "false" === hiddenValue ? false :
                                                        hiddenValue
                                            );
                                            token = tokens.shift();
                                            break;
                                        case SpreadsheetHistoryHashTokens.INSERT_AFTER:
                                            const insertAfterCount = tokens.shift();
                                            if(!insertAfterCount || Number.isNaN(Number(insertAfterCount))){
                                                break Loop;
                                            }
                                            try {
                                                viewportToken = new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(
                                                    viewport,
                                                    Number(insertAfterCount)
                                                );
                                            } catch(invalid) {
                                                errors("Insert after count: " + invalid.message);
                                                break Loop;
                                            }
                                            token = tokens.shift();
                                            break;
                                        case SpreadsheetHistoryHashTokens.INSERT_BEFORE:
                                            const insertBeforeCount = tokens.shift();
                                            if(!insertBeforeCount || Number.isNaN(Number(insertBeforeCount))){
                                                break Loop;
                                            }
                                            try {
                                                viewportToken = new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(
                                                    viewport,
                                                    Number(insertBeforeCount)
                                                );
                                            } catch(invalid) {
                                                errors("Insert before count: " + invalid.message);
                                                break Loop;
                                            }
                                            token = tokens.shift();
                                            break;
                                        case SpreadsheetHistoryHashTokens.MENU:
                                            viewportToken = new SpreadsheetColumnOrRowMenuHistoryHashToken(
                                                viewport,
                                                new SpreadsheetContextMenu(),
                                            );
                                            token = tokens.shift();
                                            break;
                                        case SpreadsheetHistoryHashTokens.UNFREEZE:
                                            if(columnOrRow.canFreeze()){
                                                viewportToken = new SpreadsheetColumnOrRowUnFreezeHistoryHashToken(
                                                    viewport
                                                );
                                                token = tokens.shift();
                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                    break;
                                default:
                                    break;
                            }

                            if(SpreadsheetHistoryHashTokens.LABEL === token){
                                var labelName;
                                try {
                                    labelName = SpreadsheetLabelName.parse(tokens.shift());
                                } catch(invalid) {
                                    errors("Label: " + invalid.message);
                                    break;
                                }
                                label = new SpreadsheetLabelMappingEditHistoryHashToken(labelName);

                                token = tokens.shift();
                                switch(token) {
                                    case SpreadsheetHistoryHashTokens.DELETE:
                                        label = new SpreadsheetLabelMappingDeleteHistoryHashToken(labelName);
                                        token = tokens.shift();
                                        break;
                                    case SpreadsheetHistoryHashTokens.SAVE:
                                        if(tokens.length < 2){
                                            errors("Label save missing label or cell");
                                            break Loop;
                                        }
                                        label = new SpreadsheetLabelMappingSaveHistoryHashToken(
                                            labelName,
                                            SpreadsheetLabelName.parse(
                                                decodeURIComponent(
                                                    tokens.shift()
                                                )
                                            ),
                                            spreadsheetCellRangeCellReferenceOrLabelParse(
                                                decodeURIComponent(
                                                    tokens.shift()
                                                )
                                            )
                                        );
                                        token = tokens.shift();
                                        break;
                                    default:
                                        break;
                                }
                            }
                            // select
                            if(SpreadsheetHistoryHashTokens.SELECT === token){
                                select = true;
                                token = tokens.shift();
                            }

                            // metadata
                            if((viewportToken instanceof SpreadsheetCellSelectHistoryHashToken || viewportToken instanceof SpreadsheetColumnOrRowSelectHistoryHashToken || !viewportToken) && !label && !select){
                                if(SpreadsheetHistoryHashTokens.METADATA === token){
                                    metadata = null;

                                    // /metadata
                                    token = tokens.shift();
                                    if(null == token){
                                        metadata = SpreadsheetMetadataSelectHistoryHashToken.NOTHING;
                                    }else {
                                        // /metadata/$item-OR-property
                                        if(SpreadsheetMetadataDrawerWidgetHistoryHashTokens.isToken(token)){
                                            const metadataItemOrMetadataProperty = token;

                                            token = tokens.shift();
                                            if(null != token){
                                                switch(token) {
                                                    case SpreadsheetHistoryHashTokens.SAVE:
                                                        // /metadata/color/save/#123456
                                                        if(SpreadsheetMetadataDrawerWidgetHistoryHashTokens.isProperty(metadataItemOrMetadataProperty)){
                                                            token = tokens.shift();
                                                            if(null == token) {
                                                                errors("Missing metadata property " + CharSequences.quoteAndEscape(metadataItemOrMetadataProperty) + " missing value");
                                                                break Loop;
                                                            }

                                                            metadata = new SpreadsheetMetadataSaveHistoryHashToken(
                                                                metadataItemOrMetadataProperty,
                                                                SpreadsheetMetadataDrawerWidgetHistoryHashTokens.parseHistoryHashToken(
                                                                    metadataItemOrMetadataProperty,
                                                                    token
                                                                )
                                                            );
                                                            token = tokens.shift();
                                                        }else {
                                                            errors("Cannot save unknown metadata property " + CharSequences.quoteAndEscape(metadataItemOrMetadataProperty));
                                                        }
                                                        break;
                                                    default:
                                                        tokens.unshift(token);
                                                        break;
                                                }
                                            }else {
                                                metadata = new SpreadsheetMetadataSelectHistoryHashToken(metadataItemOrMetadataProperty);
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if(null != token){
                            errors("Invalid token: " + CharSequences.quoteAndEscape(token));
                            break;
                        }else {
                            if(tokens.length > 0){
                                errors("Invalid token: " + CharSequences.quoteAndEscape(tokens.shift()));
                                break;
                            }
                        }

                        // populate history tokens.........................................................................
                        if(spreadsheetNameEdit){
                            historyHashTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT] = spreadsheetNameEdit;
                        }
                        if(viewportToken){
                            historyHashTokens[SpreadsheetHistoryHashTokens.VIEWPORT] = viewportToken;
                        }
                        if(label instanceof SpreadsheetLabelMappingHistoryHashToken){
                            historyHashTokens[SpreadsheetHistoryHashTokens.LABEL] = label;
                        }
                        if(select){
                            historyHashTokens[SpreadsheetHistoryHashTokens.SELECT] = select;
                        }
                        if(metadata){
                            historyHashTokens[SpreadsheetHistoryHashTokens.METADATA] = metadata;
                        }
                    } while(false);
            }
        }

        return SpreadsheetHistoryHash.validate(historyHashTokens);
    }

    /**
     * Verifies the given tokens are valid, for example formula cannot be set if cell if absent.
     */
    static validate(tokens) {
        var spreadsheetId = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID];
        var spreadsheetName = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME];
        var spreadsheetNameEdit = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT];
        var viewport = tokens[SpreadsheetHistoryHashTokens.VIEWPORT];
        var label = tokens[SpreadsheetHistoryHashTokens.LABEL];
        var select = tokens[SpreadsheetHistoryHashTokens.SELECT];
        var metadata = tokens[SpreadsheetHistoryHashTokens.METADATA];

        const verified = {};

        if(spreadsheetId){
            verified[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = spreadsheetId;

            if(spreadsheetName){
                verified[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = spreadsheetName;
                if(spreadsheetNameEdit && (viewport || label || select || metadata)){
                    spreadsheetNameEdit = null;
                    viewport = false;
                    label = false;
                    select = false;
                }
                if(spreadsheetNameEdit){
                    viewport = false;
                    label = false;
                    select = false;
                }
                if(viewport || label || select || metadata){
                    spreadsheetNameEdit = null;
                }
                if(spreadsheetNameEdit instanceof SpreadsheetNameHistoryHashToken){
                    verified[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT] = spreadsheetNameEdit;
                }
                if(viewport instanceof SpreadsheetSelectionHistoryHashToken){
                    const selection = viewport.viewport()
                        .selection();

                    if(viewport instanceof SpreadsheetCellHistoryHashToken){
                        if(selection.isCellScalarOrRange() || selection instanceof SpreadsheetLabelName){
                            if(viewport instanceof SpreadsheetCellFreezeHistoryHashToken || viewport instanceof SpreadsheetCellUnFreezeHistoryHashToken){
                                if(selection.canFreeze()){
                                    verified[SpreadsheetHistoryHashTokens.VIEWPORT] = viewport;
                                    metadata = null;
                                }
                            }else {
                                verified[SpreadsheetHistoryHashTokens.VIEWPORT] = viewport;

                                if(!(viewport instanceof SpreadsheetCellSelectHistoryHashToken)){
                                    metadata = null;
                                }
                            }
                        }
                    }
                    if(viewport instanceof SpreadsheetColumnOrRowHistoryHashToken){
                        if(selection.isColumnOrRowScalarOrRange()){
                            if(viewport instanceof SpreadsheetColumnOrRowFreezeHistoryHashToken || viewport instanceof SpreadsheetColumnOrRowUnFreezeHistoryHashToken){
                                if(selection.canFreeze()){
                                    verified[SpreadsheetHistoryHashTokens.VIEWPORT] = viewport;
                                    metadata = null;
                                }
                            }else {
                                verified[SpreadsheetHistoryHashTokens.VIEWPORT] = viewport;
                                metadata = null;
                            }
                        }
                    }
                }
                if(label instanceof SpreadsheetLabelMappingHistoryHashToken){
                    verified[SpreadsheetHistoryHashTokens.LABEL] = label;
                }
                if(select){
                    verified[SpreadsheetHistoryHashTokens.SELECT] = select;
                }
                if(metadata instanceof SpreadsheetMetadataHistoryHashToken){
                    verified[SpreadsheetHistoryHashTokens.METADATA] = metadata;
                }
            }
        }

        return copyTx(tokens, verified);
    }

    /**
     * Merges the two history hash objects, using the delta to update and return a new object.
     */
    static merge(current, delta) {
        Preconditions.requireObject(current, "current");
        Preconditions.requireObject(delta, "delta");

        // get the current
        var spreadsheetId = current[SpreadsheetHistoryHashTokens.SPREADSHEET_ID];
        var spreadsheetName = current[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME];
        var spreadsheetNameEdit = current[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT];
        var viewport = current[SpreadsheetHistoryHashTokens.VIEWPORT];
        var label = current[SpreadsheetHistoryHashTokens.LABEL];
        var select = current[SpreadsheetHistoryHashTokens.SELECT];
        var metadata = current[SpreadsheetHistoryHashTokens.METADATA];

        // try replacing...
        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SPREADSHEET_ID)){
            spreadsheetId = delta[SpreadsheetHistoryHashTokens.SPREADSHEET_ID];
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SPREADSHEET_NAME)){
            spreadsheetName = delta[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME];
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT)){
            spreadsheetNameEdit = delta[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT];
            if(spreadsheetNameEdit instanceof SpreadsheetNameHistoryHashToken){
                viewport = null;
                label = null;
                select = null;
                metadata = null;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.VIEWPORT)){
            viewport = delta[SpreadsheetHistoryHashTokens.VIEWPORT];
            if(viewport){
                spreadsheetNameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.LABEL)){
            label = delta[SpreadsheetHistoryHashTokens.LABEL];
            if(label instanceof SpreadsheetLabelMappingHistoryHashToken){
                spreadsheetNameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SELECT)){
            select = delta[SpreadsheetHistoryHashTokens.SELECT];
            if(select){
                spreadsheetNameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.METADATA)){
            metadata = delta[SpreadsheetHistoryHashTokens.METADATA];
            if(metadata){
                spreadsheetNameEdit = false;

                if(viewport instanceof SpreadsheetCellHistoryHashToken && !(viewport instanceof SpreadsheetCellSelectHistoryHashToken)){
                    metadata = null;
                }
                if(viewport instanceof SpreadsheetColumnOrRowHistoryHashToken && !(viewport instanceof SpreadsheetColumnOrRowSelectHistoryHashToken)){
                    metadata = null;
                }
            }
        }

        const merged = SpreadsheetHistoryHashTokens.emptyTokens();
        let valid = false;

        if(null != spreadsheetId){
            merged[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = spreadsheetId;

            if(null != spreadsheetName){
                merged[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = spreadsheetName;

                valid = true;
                if(spreadsheetNameEdit){
                    if(viewport || label || select || metadata){
                        valid = false;
                    }
                }
            }
        }

        if(valid){
            if(spreadsheetNameEdit){
                merged[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT] = spreadsheetNameEdit;
            }

            if(viewport){
                merged[SpreadsheetHistoryHashTokens.VIEWPORT] = viewport;
            }

            if(label){
                merged[SpreadsheetHistoryHashTokens.LABEL] = label;
            }

            if(null != select){
                merged[SpreadsheetHistoryHashTokens.SELECT] = select;
            }

            if(null != metadata){
                merged[SpreadsheetHistoryHashTokens.METADATA] = metadata;
            }
        }

        return SpreadsheetHistoryHash.validate(merged);
    }

    /**
     * Accepts some history tokens, verifies the combinations are valid and returns the hash without the leading hash-sign.
     */
    static stringify(tokens) {
        var spreadsheetId = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID];
        var spreadsheetName = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME];
        var spreadsheetNameEdit = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT];
        var viewport = tokens[SpreadsheetHistoryHashTokens.VIEWPORT];
        var label = tokens[SpreadsheetHistoryHashTokens.LABEL];
        var select = tokens[SpreadsheetHistoryHashTokens.SELECT];
        var metadata = tokens[SpreadsheetHistoryHashTokens.METADATA];

        let hash = "";
        let valid = false;

        if(null != spreadsheetId){
            hash = "/" + spreadsheetId;

            if(null != spreadsheetName){
                hash = hash + "/" + spreadsheetName;

                valid = true;
                if(spreadsheetNameEdit){
                    if(viewport || label || select || metadata){
                        valid = false;
                    }
                }
            }
        }

        if(valid){
            if(spreadsheetNameEdit){
                hash = hash + spreadsheetNameEdit.historyHashPath();

                viewport = null;
                label = null;
                select = null;
            }

            if(viewport){
                hash = hash + "/" + viewport.historyHashPath();
            }

            if(label){
                hash = hash + label.historyHashPath();
            }

            if(select){
                hash = hash + "/" + SpreadsheetHistoryHashTokens.SELECT;
            }

            if(metadata){
                hash = hash + metadata.historyHashPath();
            }
        }

        return hash;
    }

    constructor(hash, setHash, showError) {
        super();
        Preconditions.requireFunction(hash, "hash");
        Preconditions.requireFunction(setHash, "setHash");
        Preconditions.requireFunction(showError, "showError");

        this.hash = hash;
        this.setHash = setHash;
        this.showError = showError;
        this.listeners = new ListenerCollection();
    }

    onHistoryChange(e) {
        SpreadsheetHistoryHashTokens.newTxId();

        const newURL = e.newURL;
        const hashStart = newURL.indexOf("#");
        const hash = hashStart > -1 ? newURL.substring(hashStart + 1) : "";

        var errors = false;
        const tokens = SpreadsheetHistoryHash.parse(
            hash,
            (e) => {
                this.showError(e);
                errors = true;
            }
        );

        if(errors){
            this.push(tokens);
        }

        console.log("onHistoryChange txId:" + tokens[SpreadsheetHistoryHashTokens.TX_ID] + " newUrl: " + newURL + " WAS " + e.oldURL + " " + hash + " tokens: ", tokens);

        for(const listener of this.listeners.listeners.slice()) {
            try {
                listener(Object.assign({}, tokens));
            } catch (e) {
                console.error("listener " + listener.name + " failed", e);
            }
        }
    }

    tokens() {
        return SpreadsheetHistoryHash.parse(
            this.hash(),
            this.showError
        );
    }

    /**
     * Adds a new history hash listener, returning a function which when invoked will remove the added listener.
     */
    addListener(listener) {
        return this.listeners.add(listener);
    }

    /**
     * Accepts some new history tokens and combines them with the current. This may result in some feature being cancelled,
     * eg editing the spreadsheet name turns off cell, label, select and metadata.
     * Note if the merge and push updated the hash that will be returned otherwise null is returned.
     */
    mergeAndPush(tokens) {
        return this.push(
            SpreadsheetHistoryHash.merge(
                this.tokens(),
                tokens
            )
        );
    }

    /**
     * Pushes the given tokens after converting them to a string, returning the hash that was pushed.
     */
    push(tokens) {
        const tokensHash = SpreadsheetHistoryHash.stringify(
            SpreadsheetHistoryHash.validate(tokens)
        );

        this.setHash(tokensHash);

        return tokensHash;
    }

    mergeAndStringify(tokens) {
        return SpreadsheetHistoryHash.stringify(
            SpreadsheetHistoryHash.merge(this.tokens(), tokens)
        );
    }

    /**
     * Filters the given tokens and returns just the spreadsheet id and name if present.
     */
    static spreadsheetIdAndName(tokens) {
        const idAndName = SpreadsheetHistoryHashTokens.emptyTokens();

        idAndName[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID];
        idAndName[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME];

        return idAndName;
    }

    /**
     * Factory that builds a MenuItem with the given text and a link created from the given history hash tokens.
     */
    menuItem(text, id, disabled, historyTokens) {
        const copy = Object.assign({}, historyTokens);

        const href = historyTokens && "#" + SpreadsheetHistoryHash.stringify(historyTokens);

        // unfortunately href is not honoured and does not update history
        return <MenuItem key={id}
                         id={id}
                         disabled={disabled}
                         href={href}
                         onClick={() => this.mergeAndPush(copy)}
                         tabIndex={0}>{
            text
        }</MenuItem>;
    }

    /**
     * Toggles the metadata widget open becomes close and vice versa.
     */
    metadataToggle() {
        const tokens = this.tokens();
        tokens[SpreadsheetHistoryHashTokens.METADATA] = !Boolean(tokens[SpreadsheetHistoryHashTokens.METADATA]);
        this.push(tokens);
    }
}