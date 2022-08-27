import CharSequences from "../../CharSequences.js";
import ListenerCollection from "../../event/ListenerCollection.js";
import MenuItem from "@mui/material/MenuItem";
import Preconditions from "../../Preconditions.js";
import React from 'react';
import SpreadsheetCellClearHistoryHashToken from "../reference/cell/SpreadsheetCellClearHistoryHashToken.js";
import SpreadsheetCellDeleteHistoryHashToken from "../reference/cell/SpreadsheetCellDeleteHistoryHashToken.js";
import SpreadsheetCellFormulaEditHistoryHashToken
    from "../reference/cell/formula/SpreadsheetCellFormulaEditHistoryHashToken.js";
import SpreadsheetCellFormulaSaveHistoryHashToken
    from "../reference/cell/formula/SpreadsheetCellFormulaSaveHistoryHashToken.js";
import SpreadsheetCellFreezeHistoryHashToken from "../reference/cell/SpreadsheetCellFreezeHistoryHashToken.js";
import SpreadsheetCellHistoryHashToken from "../reference/cell/SpreadsheetCellHistoryHashToken.js";
import SpreadsheetCellMenuHistoryHashToken from "../reference/cell/SpreadsheetCellMenuHistoryHashToken.js";
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
import SpreadsheetMetadataHistoryHashToken from "../meta/drawer/SpreadsheetMetadataHistoryHashToken.js";
import SpreadsheetMetadataSaveHistoryHashToken from "../meta/drawer/SpreadsheetMetadataSaveHistoryHashToken.js";
import SpreadsheetMetadataSelectHistoryHashToken from "../meta/drawer/SpreadsheetMetadataSelectHistoryHashToken.js";
import SpreadsheetMetadataWidgetHistoryHashTokens from "../meta/drawer/SpreadsheetMetadataWidgetHistoryHashTokens.js";
import SpreadsheetName from "../meta/name/SpreadsheetName.js";
import SpreadsheetNameEditHistoryHashToken from "../meta/name/SpreadsheetNameEditHistoryHashToken.js";
import SpreadsheetNameHistoryHashToken from "../meta/name/SpreadsheetNameHistoryHashToken.js";
import SpreadsheetNameSaveHistoryHashToken from "../meta/name/SpreadsheetNameSaveHistoryHashToken.js";
import SpreadsheetRowReferenceRange from "../reference/columnrow/SpreadsheetRowReferenceRange.js";
import SpreadsheetSelectionHistoryHashToken from "../reference/SpreadsheetSelectionHistoryHashToken.js";
import SpreadsheetViewportSelection from "../reference/viewport/SpreadsheetViewportSelection.js";
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

                var selection = null;

                var label = null;

                var select = null;

                var metadata = null;

                Loop:
                    do {
                        var token = tokens.shift();

                        if(SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_PATH === token){
                            spreadsheetNameEdit = SpreadsheetNameEditHistoryHashToken.INSTANCE;
                            token = tokens.shift();

                            if(token){
                                // /$id/$name/name/$new-spreadsheet-name
                                spreadsheetNameEdit = new SpreadsheetNameSaveHistoryHashToken(
                                    new SpreadsheetName(
                                        decodeURIComponent(token)
                                    )
                                );
                                token = tokens.shift();
                            }
                        }

                        // /cell/A1.........................................................................................
                        if(!spreadsheetNameEdit){
                            var viewportSelection;

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
                                    viewportSelection = new SpreadsheetViewportSelection(cellOrLabel);

                                    for(const anchor of cellOrLabel.anchors()) {
                                        if(token === anchor.historyHashPath()){
                                            viewportSelection = viewportSelection.setAnchor(anchor);
                                            token = tokens.shift();
                                            break;
                                        }
                                    }

                                    selection = new SpreadsheetCellSelectHistoryHashToken(viewportSelection);

                                    switch(token) {
                                        case SpreadsheetHistoryHashTokens.CLEAR:
                                            selection = new SpreadsheetCellClearHistoryHashToken(viewportSelection);
                                            token = tokens.shift();
                                            break;
                                        case SpreadsheetHistoryHashTokens.DELETE:
                                            selection = new SpreadsheetCellDeleteHistoryHashToken(viewportSelection);
                                            token = tokens.shift();
                                            break;
                                        case SpreadsheetHistoryHashTokens.CELL_FORMULA:
                                            if(cellOrLabel instanceof SpreadsheetCellReference || cellOrLabel instanceof SpreadsheetLabelName){
                                                token = tokens.shift();

                                                if(null == token){
                                                    selection = new SpreadsheetCellFormulaEditHistoryHashToken(viewportSelection);
                                                }else {
                                                    selection = new SpreadsheetCellFormulaSaveHistoryHashToken(
                                                        viewportSelection,
                                                        decodeURIComponent(token)
                                                    );
                                                    token = tokens.shift();
                                                }
                                            }
                                            break;
                                        case SpreadsheetHistoryHashTokens.FREEZE:
                                            if(cellOrLabel.canFreeze()){
                                                selection = new SpreadsheetCellFreezeHistoryHashToken(viewportSelection);
                                                token = tokens.shift();
                                            }
                                            break;
                                        case SpreadsheetHistoryHashTokens.MENU:
                                            selection = new SpreadsheetCellMenuHistoryHashToken(
                                                viewportSelection,
                                                new SpreadsheetContextMenu()
                                            );
                                            token = tokens.shift();
                                            break;
                                        case SpreadsheetHistoryHashTokens.STYLE:
                                            // cell/A1/style/font-style/italics
                                            token = tokens.shift(); // style property name
                                            if(null != token){
                                                const stylePropertyName = token;
                                                if(TextStyle.isProperty(stylePropertyName)){
                                                    if(tokens.length){
                                                        token = tokens.shift(); // style property value
                                                        selection = new SpreadsheetCellStyleSaveHistoryHashToken(
                                                            viewportSelection,
                                                            stylePropertyName,
                                                            TextStyle.parseHistoryHashToken(
                                                                stylePropertyName,
                                                                token
                                                            )
                                                        );
                                                    }else {
                                                        selection = new SpreadsheetCellStyleEditHistoryHashToken(
                                                            viewportSelection,
                                                            stylePropertyName
                                                        );
                                                    }
                                                    token = tokens.shift();
                                                }else {
                                                    tokens.unshift(token);
                                                }
                                            }
                                            break;
                                        case SpreadsheetHistoryHashTokens.UNFREEZE:
                                            if(cellOrLabel.canFreeze()){
                                                selection = new SpreadsheetCellUnFreezeHistoryHashToken(viewportSelection);
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
                                    viewportSelection = new SpreadsheetViewportSelection(columnOrRow);

                                    // column | row then anchor.................................................................
                                    for(const anchor of columnOrRow.anchors()) {
                                        if(token === anchor.historyHashPath()){
                                            viewportSelection = viewportSelection.setAnchor(anchor);
                                            token = tokens.shift();
                                            break;
                                        }
                                    }
                                    selection = new SpreadsheetColumnOrRowSelectHistoryHashToken(viewportSelection);

                                    switch(token) {
                                        case SpreadsheetHistoryHashTokens.CLEAR:
                                            selection = new SpreadsheetColumnOrRowClearHistoryHashToken(viewportSelection);
                                            token = tokens.shift();
                                            break;
                                        case SpreadsheetHistoryHashTokens.DELETE:
                                            selection = new SpreadsheetColumnOrRowDeleteHistoryHashToken(viewportSelection);
                                            token = tokens.shift();
                                            break;
                                        case SpreadsheetHistoryHashTokens.FREEZE:
                                            // column/A/freeze OR /row/1/freeze
                                            if(columnOrRow.canFreeze()){
                                                selection = new SpreadsheetColumnOrRowFreezeHistoryHashToken(viewportSelection);
                                                token = tokens.shift();
                                            }
                                            break;
                                        case SpreadsheetHistoryHashTokens.HIDDEN:
                                            const hiddenValue = tokens.shift();
                                            if(!hiddenValue){
                                                break Loop; // value required but missing.
                                            }
                                            selection = new SpreadsheetColumnOrRowSaveHistoryHashToken(
                                                viewportSelection,
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
                                                selection = new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(
                                                    viewportSelection,
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
                                                selection = new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(
                                                    viewportSelection,
                                                    Number(insertBeforeCount)
                                                );
                                            } catch(invalid) {
                                                errors("Insert before count: " + invalid.message);
                                                break Loop;
                                            }
                                            token = tokens.shift();
                                            break;
                                        case SpreadsheetHistoryHashTokens.MENU:
                                            selection = new SpreadsheetColumnOrRowMenuHistoryHashToken(
                                                viewportSelection,
                                                new SpreadsheetContextMenu(),
                                            );
                                            token = tokens.shift();
                                            break;
                                        case SpreadsheetHistoryHashTokens.UNFREEZE:
                                            if(columnOrRow.canFreeze()){
                                                selection = new SpreadsheetColumnOrRowUnFreezeHistoryHashToken(
                                                    viewportSelection
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
                                    break Loop;
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
                            if((selection instanceof SpreadsheetCellSelectHistoryHashToken || selection instanceof SpreadsheetColumnOrRowSelectHistoryHashToken || !selection) && !label && !select){
                                if(SpreadsheetHistoryHashTokens.METADATA === token){
                                    metadata = null;

                                    // /metadata
                                    token = tokens.shift();
                                    if(null == token){
                                        metadata = SpreadsheetMetadataSelectHistoryHashToken.NOTHING;
                                    }else {
                                        // /metadata/metadata
                                        if(SpreadsheetMetadataWidgetHistoryHashTokens.isToken(token)){
                                            const metadataItemOrMetadataProperty = token;

                                            // /metadata/color/#123456
                                            token = tokens.shift(); // property value
                                            if(null != token){
                                                if(SpreadsheetMetadataWidgetHistoryHashTokens.isProperty(metadataItemOrMetadataProperty)){
                                                    metadata = new SpreadsheetMetadataSaveHistoryHashToken(
                                                        metadataItemOrMetadataProperty,
                                                        SpreadsheetMetadataWidgetHistoryHashTokens.parseHistoryHashToken(
                                                            metadataItemOrMetadataProperty,
                                                            token
                                                        )
                                                    );
                                                    token = tokens.shift();
                                                }else {
                                                    tokens.unshift(token);
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
                        if(selection){
                            historyHashTokens[SpreadsheetHistoryHashTokens.SELECTION] = selection;
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
        var selection = tokens[SpreadsheetHistoryHashTokens.SELECTION];
        var label = tokens[SpreadsheetHistoryHashTokens.LABEL];
        var select = tokens[SpreadsheetHistoryHashTokens.SELECT];
        var metadata = tokens[SpreadsheetHistoryHashTokens.METADATA];

        const verified = {};

        if(spreadsheetId){
            verified[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = spreadsheetId;

            if(spreadsheetName){
                verified[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = spreadsheetName;
                if(spreadsheetNameEdit && (selection || label || select || metadata)){
                    spreadsheetNameEdit = null;
                    selection = false;
                    label = false;
                    select = false;
                }
                if(spreadsheetNameEdit){
                    selection = false;
                    label = false;
                    select = false;
                }
                if(selection || label || select || metadata){
                    spreadsheetNameEdit = null;
                }
                if(spreadsheetNameEdit instanceof SpreadsheetNameHistoryHashToken){
                    verified[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT] = spreadsheetNameEdit;
                }
                if(selection instanceof SpreadsheetSelectionHistoryHashToken){
                    const selectionSelection = selection.viewportSelection()
                        .selection();

                    if(selection instanceof SpreadsheetCellHistoryHashToken){
                        if(selectionSelection.isCellScalarOrRange() || selectionSelection instanceof SpreadsheetLabelName){
                            if(selection instanceof SpreadsheetCellFreezeHistoryHashToken || selection instanceof SpreadsheetCellUnFreezeHistoryHashToken){
                                if(selectionSelection.canFreeze()){
                                    verified[SpreadsheetHistoryHashTokens.SELECTION] = selection;
                                    metadata = null;
                                }
                            }else {
                                verified[SpreadsheetHistoryHashTokens.SELECTION] = selection;

                                if(!(selection instanceof SpreadsheetCellSelectHistoryHashToken)){
                                    metadata = null;
                                }
                            }
                        }
                    }
                    if(selection instanceof SpreadsheetColumnOrRowHistoryHashToken){
                        if(selectionSelection.isColumnOrRowScalarOrRange()){
                            if(selection instanceof SpreadsheetColumnOrRowFreezeHistoryHashToken || selection instanceof SpreadsheetColumnOrRowUnFreezeHistoryHashToken){
                                if(selectionSelection.canFreeze()){
                                    verified[SpreadsheetHistoryHashTokens.SELECTION] = selection;
                                    metadata = null;
                                }
                            }else {
                                verified[SpreadsheetHistoryHashTokens.SELECTION] = selection;
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
        var selection = current[SpreadsheetHistoryHashTokens.SELECTION];
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
                selection = null;
                label = null;
                select = null;
                metadata = null;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SELECTION)){
            selection = delta[SpreadsheetHistoryHashTokens.SELECTION];
            if(selection){
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

                if(selection instanceof SpreadsheetCellHistoryHashToken && !(selection instanceof SpreadsheetCellSelectHistoryHashToken)){
                    metadata = null;
                }
                if(selection instanceof SpreadsheetColumnOrRowHistoryHashToken && !(selection instanceof SpreadsheetColumnOrRowSelectHistoryHashToken)){
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
                    if(selection || label || select || metadata){
                        valid = false;
                    }
                }
            }
        }

        if(valid){
            if(spreadsheetNameEdit){
                merged[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT] = spreadsheetNameEdit;
            }

            if(selection){
                merged[SpreadsheetHistoryHashTokens.SELECTION] = selection;
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
        var selection = tokens[SpreadsheetHistoryHashTokens.SELECTION];
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
                    if(selection || label || select || metadata){
                        valid = false;
                    }
                }
            }
        }

        if(valid){
            if(spreadsheetNameEdit){
                hash = hash + spreadsheetNameEdit.historyHashPath();

                selection = null;
                label = null;
                select = null;
            }

            if(selection){
                hash = hash + "/" + selection.historyHashPath();
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
            listener(Object.assign({}, tokens));
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