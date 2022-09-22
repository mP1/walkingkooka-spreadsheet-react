import FontStyle from "../../../text/FontStyle.js";
import PropTypes from "prop-types";
import React from "react";
import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";
import SpreadsheetCellStylePropertyButtonGroupWidget from "./style/SpreadsheetCellStylePropertyButtonGroupWidget.js";
import SpreadsheetHistoryHash from "../../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetMessengerCrud from "../../message/SpreadsheetMessengerCrud.js";
import SpreadsheetSelectionWidget from "../SpreadsheetSelectionWidget.js";
import TextAlign from "../../../text/TextAlign.js";
import TextDecorationLine from "../../../text/TextDecorationLine.js";
import TextStyle from "../../../text/TextStyle.js";
import VerticalAlign from "../../../text/VerticalAlign.js";
import WordBreak from "../../../text/WordBreak.js";
import WordWrap from "../../../text/WordWrap.js";

/**
 * A container that holds all format and style widgets.
 */
export default class SpreadsheetToolbarWidget extends SpreadsheetSelectionWidget {

    static ID = "toolbar";

    /**
     * Returns true if the given element is a child of the root of this widget.
     */
    static contains(element) {
        return document.getElementById(SpreadsheetToolbarWidget.ID)
            .contains(element);
    }

    init() {
        this.fontStyle = React.createRef();
        this.textAlign = React.createRef();
        this.textDecorationLine = React.createRef();
        this.verticalAlign = React.createRef();
        this.workBreak = React.createRef();
        this.wordWrap = React.createRef();
    }

    initialStateFromProps() {
        return {
            viewportSelection: null,
        };
    }

    stateFromHistoryTokens(historyTokens) {
        return {
            viewportSelection: historyTokens[SpreadsheetHistoryHashTokens.VIEWPORT_SELECTION],
        }
    }

    // SpreadsheetToolbarWidget never updates the history hash tokens.
    historyTokensFromState(prevState) {
        return null;
    }

    // if the viewportSelection is NOT a cell render the outer DIV as hidden.
    // this is necessary so SpreadsheetCellStylePropertyButtonGroupWidget is registered and handles history such as
    // /style/text-align/save/CENTER
    render() {
        const {
            history,
            spreadsheetDeltaCellCrud
        } = this.props;

        const {
            viewportSelection
        } = this.state

        return <div id={SpreadsheetToolbarWidget.ID}
                    style={{
                        border: 0,
                        margin: 0,
                        padding: 0,
                        visibility: viewportSelection instanceof SpreadsheetCellHistoryHashToken ? "visible" : "hidden"
                    }}>
            <SpreadsheetCellStylePropertyButtonGroupWidget ref={this.textAlign}
                                                           variant="contained"
                                                           aria-label="outlined primary button group"
                                                           history={history}
                                                           propertyName={TextStyle.FONT_STYLE}
                                                           labels={["normal", "italic", "oblique"]}
                                                           values={[FontStyle.NORMAL, FontStyle.ITALIC, FontStyle.OBLIQUE]}
                                                           spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}
                                                           spreadsheetToolbarWidget={this}
            />
            <SpreadsheetCellStylePropertyButtonGroupWidget ref={this.textAlign}
                                                           variant="contained"
                                                           aria-label="outlined primary button group"
                                                           history={history}
                                                           propertyName={TextStyle.TEXT_ALIGN}
                                                           labels={["left", "center", "right", "justify"]}
                                                           values={[TextAlign.LEFT, TextAlign.CENTER, TextAlign.RIGHT, TextAlign.JUSTIFY]}
                                                           spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}
                                                           spreadsheetToolbarWidget={this}
            />
            <SpreadsheetCellStylePropertyButtonGroupWidget ref={this.textDecorationLine}
                                                           variant="contained"
                                                           aria-label="outlined primary button group"
                                                           history={history}
                                                           propertyName={TextStyle.TEXT_DECORATION_LINE}
                                                           labels={["none", "line through", "overline", "underline"]}
                                                           values={[TextDecorationLine.NONE, TextDecorationLine.LINE_THROUGH, TextDecorationLine.OVERLINE, TextDecorationLine.UNDERLINE]}
                                                           spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}
                                                           spreadsheetToolbarWidget={this}
            />
            <SpreadsheetCellStylePropertyButtonGroupWidget ref={this.verticalAlign}
                                                           variant="contained"
                                                           aria-label="outlined primary button group"
                                                           history={history}
                                                           propertyName={TextStyle.VERTICAL_ALIGN}
                                                           labels={["top", "middle", "bottom"]}
                                                           values={[VerticalAlign.TOP, VerticalAlign.MIDDLE, VerticalAlign.BOTTOM]}
                                                           spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}
                                                           spreadsheetToolbarWidget={this}
            />
            <SpreadsheetCellStylePropertyButtonGroupWidget ref={this.workBreak}
                                                           variant="contained"
                                                           aria-label="outlined primary button group"
                                                           history={history}
                                                           propertyName={TextStyle.WORD_BREAK}
                                                           labels={["none", "normal", "break all", "break word", "keep all"]}
                                                           values={[WordBreak.NONE, WordBreak.NORMAL, WordBreak.BREAK_ALL, WordBreak.BREAK_WORD, WordBreak.KEEP_ALL]}
                                                           spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}
                                                           spreadsheetToolbarWidget={this}
            />
            <SpreadsheetCellStylePropertyButtonGroupWidget ref={this.wordWrap}
                                                           variant="contained"
                                                           aria-label="outlined primary button group"
                                                           history={history}
                                                           propertyName={TextStyle.WORD_WRAP}
                                                           labels={["normal", "break word"]}
                                                           values={[WordWrap.NORMAL, WordWrap.BREAK_WORD]}
                                                           spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}
                                                           spreadsheetToolbarWidget={this}
            />
        </div>
    }

    onSpreadsheetDelta(method, cellOrLabel, url, requestDelta, responseDelta) {
        // nop
    }

    giveSelectedFocus(propertyName) {
        let style;

        switch(propertyName) {
            case TextStyle.FONT_STYLE:
                style = this.fontStyle.current;
                break;
            case TextStyle.TEXT_ALIGN:
                style = this.textAlign.current;
                break;
            case TextStyle.TEXT_DECORATION_LINE:
                style = this.textDecorationLine.current;
                break;
            case TextStyle.VERTICAL_ALIGN:
                style = this.verticalAlign.current;
                break;
            case TextStyle.WORD_BREAK:
                style = this.workBreak.current;
                break;
            case TextStyle.WORD_WRAP:
                style = this.wordWrap.current;
                break;
            default:
                break;
        }

        style && style.giveFocus(() => style.focusElement());
    }
}

SpreadsheetToolbarWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetDeltaCellCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    showError: PropTypes.func.isRequired,
}
