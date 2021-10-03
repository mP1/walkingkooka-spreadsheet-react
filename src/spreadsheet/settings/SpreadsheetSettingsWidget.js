import {withStyles} from "@material-ui/core/styles";

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Drawer from "@material-ui/core/Drawer";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpressionNumberKind from "../../math/ExpressionNumberKind.js";
import FontFamily from "../../text/FontFamily.js";
import lengthFromJson from "../../text/LengthFromJson.js";
import NoneLength from "../../text/NoneLength.js";
import Paper from '@material-ui/core/Paper';
import Preconditions from "../../Preconditions.js";
import PropTypes from 'prop-types';
import React from 'react';
import RelativeUrl from "../../net/RelativeUrl.js";
import RoundingMode from "../../math/RoundingMode.js";
import SpreadsheetFormatRequest from "../server/format/SpreadsheetFormatRequest.js";
import SpreadsheetHistoryAwareStateWidget from "../history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetLocaleDefaultDateTimeFormat from "../server/format/SpreadsheetLocaleDefaultDateTimeFormat.js";
import SpreadsheetMessengerCrud from "../message/SpreadsheetMessengerCrud.js";
import SpreadsheetMetadata from "../meta/SpreadsheetMetadata.js";
import SpreadsheetMultiFormatRequest from "../server/format/SpreadsheetMultiFormatRequest.js";
import SpreadsheetMultiFormatResponse from "../server/format/SpreadsheetMultiFormatResponse.js";
import SpreadsheetSettingsWidgetCharacter from "./SpreadsheetSettingsWidgetCharacter.js";
import SpreadsheetSettingsWidgetColor from "./SpreadsheetSettingsWidgetColor.js";
import SpreadsheetSettingsWidgetDropDownList from "./SpreadsheetSettingsWidgetDropDownList.js";
import SpreadsheetSettingsWidgetItems from "./SpreadsheetSettingsWidgetItems.js";
import SpreadsheetSettingsWidgetNumber from "./SpreadsheetSettingsWidgetNumber.js";
import SpreadsheetSettingsWidgetSlider from "./SpreadsheetSettingsWidgetSlider.js";
import SpreadsheetSettingsWidgetSliderWithNumberTextField
    from "./SpreadsheetSettingsWidgetSliderWithNumberTextField.js";
import SpreadsheetSettingsWidgetSpreadsheetDateFormatPattern
    from "./SpreadsheetSettingsWidgetSpreadsheetDateFormatPattern.js";
import SpreadsheetSettingsWidgetSpreadsheetDateParsePatterns
    from "./SpreadsheetSettingsWidgetSpreadsheetDateParsePatterns.js";
import SpreadsheetSettingsWidgetSpreadsheetDateTimeFormatPattern
    from "./SpreadsheetSettingsWidgetSpreadsheetDateTimeFormatPattern.js";
import SpreadsheetSettingsWidgetSpreadsheetDateTimeParsePatterns
    from "./SpreadsheetSettingsWidgetSpreadsheetDateTimeParsePatterns.js";
import SpreadsheetSettingsWidgetSpreadsheetNumberFormatPattern
    from "./SpreadsheetSettingsWidgetSpreadsheetNumberFormatPattern.js";
import SpreadsheetSettingsWidgetSpreadsheetNumberParsePatterns
    from "./SpreadsheetSettingsWidgetSpreadsheetNumberParsePatterns.js";
import SpreadsheetSettingsWidgetSpreadsheetTextFormatPattern
    from "./SpreadsheetSettingsWidgetSpreadsheetTextFormatPattern.js";
import SpreadsheetSettingsWidgetSpreadsheetTimeFormatPattern
    from "./SpreadsheetSettingsWidgetSpreadsheetTimeFormatPattern.js";
import SpreadsheetSettingsWidgetSpreadsheetTimeParsePatterns
    from "./SpreadsheetSettingsWidgetSpreadsheetTimeParsePatterns.js";
import SpreadsheetSettingsWidgetString from "./SpreadsheetSettingsWidgetString.js";
import stylePropertyNameToEnum from "../../text/stylePropertyNameToEnum.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TextStyle from "../../text/TextStyle.js";
import Typography from '@material-ui/core/Typography';

const DEFAULT_VALUE_FORMATTER_ENUM = (v) => v ? v.nameKebabCase() : "";
const DEFAULT_VALUE_FORMATTER_LABEL = (v) => v ? v.nameCapitalCase().replace("Half", "½") : "";
const DEFAULT_VALUE_FORMATTER_TOSTRING = (v) => null != v ? v.toString() : "";

/**
 * The settings appears holds all general settings and tools for a spreadsheet sheet.
 */
const useStyles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontWeight: 700,
    },
    secondaryHeading: {
        color: theme.palette.text.secondary,
    },
    label: {
        fontWeight: 700,
        width: "125px",
        verticalAlign: "middle",
    },
    value: {
        verticalAlign: "middle",
    },
});

class SpreadsheetSettingsWidget extends SpreadsheetHistoryAwareStateWidget {

    /**
     * The width of the settings in pixels holding settings and tools.
     */
    static WIDTH = 500;

    init() {
    }

    initialStateFromProps(props) {
        return {
            spreadsheetMetadata: null, //props.spreadsheetMetadata,
            createDateTimeFormatted: "",
            modifiedDateTimeFormatted: "",
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.onSpreadsheetMetadataRemover = this.props.spreadsheetMetadataCrud.addListener(this.onSpreadsheetMetadata.bind(this));
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this.onSpreadsheetMetadataRemover && this.onSpreadsheetMetadataRemover();
        delete this.onSpreadsheetMetadataRemover;
    }

    stateFromHistoryTokens(tokens) {
        return {
            settings: tokens[SpreadsheetHistoryHashTokens.SETTINGS],
            settingsItem: tokens[SpreadsheetHistoryHashTokens.SETTINGS_ITEM],
        };
    }

    /**
     * Translates the state to history tokens and performs some other updates and checks.
     */
    historyTokensFromState(prevState) {
        const historyTokens = {};
        const state = this.state;

        console.log("componentDidUpdate", "prevState", prevState, "state", state);

        const settingsNew = !!state.settings;

        const oldSettingsItem = prevState.settingsItem;
        const newSettingsItem = state.settingsItem;

        const metadata = state.spreadsheetMetadata;

        historyTokens[SpreadsheetHistoryHashTokens.SETTINGS] = settingsNew;
        historyTokens[SpreadsheetHistoryHashTokens.SETTINGS_ITEM] = newSettingsItem;

        // if now showing metadata load formatted createDateTime/modifiedDateTime
        if(settingsNew &&
            newSettingsItem === SpreadsheetSettingsWidgetItems.METADATA &&
            oldSettingsItem !== SpreadsheetSettingsWidgetItems.METADATA
        ){
            const createDateTime = metadata.getIgnoringDefaults(SpreadsheetMetadata.CREATE_DATE_TIME);
            const modifiedDateTime = metadata.getIgnoringDefaults(SpreadsheetMetadata.MODIFIED_DATE_TIME);

            if(createDateTime && modifiedDateTime && !(state.createDateTimeFormatted) && !(state.modifiedDateTimeFormatted)){
                const formatRequests = [];
                formatRequests.push(new SpreadsheetFormatRequest(createDateTime, SpreadsheetLocaleDefaultDateTimeFormat.INSTANCE));
                formatRequests.push(new SpreadsheetFormatRequest(modifiedDateTime, SpreadsheetLocaleDefaultDateTimeFormat.INSTANCE));

                this.metadataFormatCreateDateTimeModifiedDateTime(new SpreadsheetMultiFormatRequest(formatRequests));
            }
        }

        return historyTokens;
    }

    onSpreadsheetMetadata(method, id, url, requestMetadata, responseMetadata) {
        this.setState({
            spreadsheetMetadata: responseMetadata,
        });
    }

    /**
     * Make a request to the server to format the createDateTime & modifiedDateTime
     */
    metadataFormatCreateDateTimeModifiedDateTime(request) {
        this.props.spreadsheetMetadataCrud.messenger.send(
            new RelativeUrl("/api/spreadsheet/" + this.state.spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID) + "/format", {}),
            {
                method: "POST",
                body: JSON.stringify(request.toJson()),
            },
            this.setFormattedCreateDateTimeAndModifiedDateTime.bind(this),
            this.props.showError,
        );
    }

    /**
     * This method should be called by the formatRequest handler when it receives the formatted date/times.
     */
    setFormattedCreateDateTimeAndModifiedDateTime(multiFormatResponse) {
        console.log("setFormattedCreateDateTimeAndModifiedDateTime", multiFormatResponse);

        const [createDateTime, modifiedDateTime] = SpreadsheetMultiFormatResponse.fromJson(multiFormatResponse).responses();

        this.setState({
            createDateTimeFormatted: createDateTime, // already strings
            modifiedDateTimeFormatted: modifiedDateTime,
        });
    }

    render() {
        const {classes} = this.props;
        const {settings, settingsItem, spreadsheetMetadata} = this.state;

        // if metadata is empty skip rendering content.
        const children = spreadsheetMetadata && (!spreadsheetMetadata.isEmpty() && settings &&
            [
                this.metadataAccordion(classes, SpreadsheetSettingsWidgetItems.METADATA === settingsItem),
                this.spreadsheetTextAccordion(classes, SpreadsheetSettingsWidgetItems.TEXT === settingsItem),
                this.spreadsheetNumberAccordion(classes, SpreadsheetSettingsWidgetItems.NUMBER === settingsItem),
                this.spreadsheetDateTimeAccordion(classes, SpreadsheetSettingsWidgetItems.DATE_TIME === settingsItem),
                this.spreadsheetStyleAccordion(classes, SpreadsheetSettingsWidgetItems.STYLE === settingsItem)
            ]);

        return <Drawer id={"settings"}
                       anchor={"right"}
                       variant={"persistent"}
                       open={Boolean(this.state.settings)}
                       modal={"false"}
                       onClose={this.onClose}
        >
            <div className={classes.root}
                 style={{margin: 0, border: 0, padding: 0, width: SpreadsheetSettingsWidget.WIDTH + "px"}}>
                {children}
            </div>
        </Drawer>;
    }

    onDrawerClose() {
        const tokens = {};
        tokens[SpreadsheetHistoryHashTokens.SETTINGS] = false;

        this.historyParseMergeAndPush(tokens);
    }

    // METADATA.........................................................................................................

    metadataAccordion(classes) {
        return this.accordion(
            SpreadsheetSettingsWidgetItems.METADATA,
            classes,
            "Metadata",
            "",
            "Readonly Spreadsheet Metadata",
            SpreadsheetSettingsWidgetItems.metadataRows(),
        );
    }

    // TEXT.............................................................................................................

    spreadsheetTextAccordion(classes) {
        return this.accordion(
            SpreadsheetSettingsWidgetItems.TEXT,
            classes,
            "Text",
            "",
            "Text",
            SpreadsheetSettingsWidgetItems.spreadsheetTextRows(),
        );
    }

    spreadsheetDateTimeAccordion(classes) {
        return this.accordion(
            SpreadsheetSettingsWidgetItems.DATE_TIME,
            classes,
            "Date/Time",
            "",
            "Spreadsheet Date/Time",
            SpreadsheetSettingsWidgetItems.spreadsheetDateTimeRows(),
        );
    }

    spreadsheetNumberAccordion(classes) {
        return this.accordion(
            SpreadsheetSettingsWidgetItems.NUMBER,
            classes,
            "Number",
            "",
            "Spreadsheet Number Settings",
            SpreadsheetSettingsWidgetItems.spreadsheetNumberRows()
        );
    }

    spreadsheetStyleAccordion(classes) {
        return this.accordion(
            SpreadsheetSettingsWidgetItems.STYLE,
            classes,
            "Default Cell style(s)",
            "",
            "Default Cell style(s)",
            SpreadsheetSettingsWidgetItems.spreadsheetStyleRows(),
        );
    }

    renderRow(property, classes) {
        return SpreadsheetMetadata.isProperty(property) ?
            this.renderMetadataPropertyRow(property, classes) :
            this.renderDefaultStylePropertyRow(property, classes);
    }

    /**
     * Returns a react component for the given property.
     */
    renderDefaultStylePropertyRow(property, classes) {
        const id = "settings-spreadsheet-metadata-style-" + property;

        const state = this.state;
        const metadata = state.spreadsheetMetadata;
        const style = metadata.getIgnoringDefaults(SpreadsheetMetadata.STYLE) || TextStyle.EMPTY;
        const setValue = function(v) {
            console.log("saving default style property " + property + "=" + v);

            this.spreadsheetMetadataSave(
                metadata.set(
                    SpreadsheetMetadata.STYLE,
                    null != v ?
                        style.set(property, v) :
                        style.remove(property)
                )
            );
        }.bind(this);

        const value = style.get(property);
        const defaultValue = this.defaultStyle(metadata).get(property);

        const notificationShow = this.props.notificationShow;

        let render;

        switch(property) {
            case TextStyle.BACKGROUND_COLOR:
            case TextStyle.BORDER_BOTTOM_COLOR:
            case TextStyle.BORDER_LEFT_COLOR:
            case TextStyle.BORDER_RIGHT_COLOR:
            case TextStyle.BORDER_TOP_COLOR:
            case TextStyle.COLOR:
            case TextStyle.OUTLINE_COLOR:
            case TextStyle.TEXT_DECORATION_COLOR:
                render = <SpreadsheetSettingsWidgetColor id={id}
                                                         key={id}
                                                         value={value}
                                                         defaultButtonTooltip={false}
                                                         defaultValue={defaultValue}
                                                         defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                         setValue={setValue}
                                                         notificationShow={notificationShow}
                />;
                break;
            default:
                switch(property) {
                    case TextStyle.BORDER_BOTTOM_STYLE:
                    case TextStyle.BORDER_LEFT_STYLE:
                    case TextStyle.BORDER_RIGHT_STYLE:
                    case TextStyle.BORDER_TOP_STYLE:
                    case TextStyle.BORDER_COLLAPSE:
                    case TextStyle.BORDER_SPACING:
                    case TextStyle.DIRECTION:
                    case TextStyle.FONT_KERNING:
                    case TextStyle.FONT_SIZE:
                    case TextStyle.FONT_STRETCH:
                    case TextStyle.FONT_WEIGHT:
                    case TextStyle.HANGING_PUNCTUATION:
                    case TextStyle.HYPHENS:
                    case TextStyle.LETTER_SPACING:
                    case TextStyle.LIST_STYLE_POSITION:
                    case TextStyle.LIST_STYLE_TYPE:
                    case TextStyle.OUTLINE_STYLE:
                    case TextStyle.OUTLINE_WIDTH:
                    case TextStyle.OVERFLOW_X:
                    case TextStyle.OVERFLOW_Y:
                    case TextStyle.TEXT_ALIGN:
                    case TextStyle.TEXT_DECORATION_LINE:
                    case TextStyle.TEXT_DECORATION_STYLE:
                    case TextStyle.TEXT_INDENT:
                    case TextStyle.TEXT_JUSTIFY:
                    case TextStyle.TEXT_OVERFLOW:
                    case TextStyle.TEXT_TRANSFORM:
                    case TextStyle.TEXT_WRAPPING:
                    case TextStyle.VERTICAL_ALIGN:
                    case TextStyle.VISIBILITY:
                    case TextStyle.WHITE_SPACE:
                    case TextStyle.WORD_BREAK:
                    case TextStyle.WORD_SPACING:
                    case TextStyle.WORD_WRAP:
                    case TextStyle.WRITING_MODE:
                        render = <SpreadsheetSettingsWidgetSlider id={id}
                                                                  key={id}
                                                                  style={{
                                                                      marginLeft: "2.5em",
                                                                      marginRight: "2.5em",
                                                                  }}
                                                                  values={stylePropertyNameToEnum(property)}
                                                                  value={value}
                                                                  defaultValue={defaultValue}
                                                                  defaultValueFormatter={DEFAULT_VALUE_FORMATTER_ENUM}
                                                                  defaultButtonTooltip={false}
                                                                  setValue={setValue}
                        />;
                        break;
                    case TextStyle.FONT_FAMILY:
                        render = <SpreadsheetSettingsWidgetSlider id={id}
                                                                  key={id}
                                                                  style={{
                                                                      marginLeft: "2.5em",
                                                                      marginRight: "2.5em",
                                                                  }}
                                                                  values={[new FontFamily("Times New Roman")]}
                                                                  value={value}
                                                                  defaultValue={defaultValue}
                                                                  defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                  defaultButtonTooltip={false}
                                                                  setValue={setValue}
                        />;
                        break;
                    default:
                        switch(property) {
                            case TextStyle.BORDER_LEFT_WIDTH:
                            case TextStyle.BORDER_RIGHT_WIDTH:
                            case TextStyle.BORDER_BOTTOM_WIDTH:
                            case TextStyle.BORDER_TOP_WIDTH:
                            case TextStyle.HEIGHT:
                            case TextStyle.OUTLINE_OFFSET:
                            case TextStyle.PADDING_BOTTOM:
                            case TextStyle.PADDING_LEFT:
                            case TextStyle.PADDING_RIGHT:
                            case TextStyle.PADDING_TOP:
                            case TextStyle.TAB_SIZE:
                            case TextStyle.TEXT_DECORATION_THICKNESS:
                            case TextStyle.WIDTH:
                                render = this.lengthProperty(property, id, value, defaultValue, setValue);
                                break;
                            default:
                                throw new Error("Invalid default style property " + property);
                        }
                        break;
                }
        }

        const label = SpreadsheetSettingsWidget.textStylePropertyLabel(property);
        return this.tableRow(id, label, render, classes);
    }

    /**
     * Factory that creates a component that combines a slider and number text field for entry.
     */
    lengthProperty(property, id, value, defaultValue, setValue) {
        let min = 0;
        let max = 0;

        switch(property) {
            case TextStyle.BORDER_LEFT_WIDTH:
            case TextStyle.BORDER_RIGHT_WIDTH:
            case TextStyle.BORDER_BOTTOM_WIDTH:
            case TextStyle.BORDER_TOP_WIDTH:
                max = 2;
                break;
            case TextStyle.HEIGHT:
                min = 20;
                max = 30;
                break;
            case TextStyle.OUTLINE_OFFSET:
                max = 10;
                break;
            case TextStyle.PADDING_BOTTOM:
            case TextStyle.PADDING_LEFT:
            case TextStyle.PADDING_RIGHT:
            case TextStyle.PADDING_TOP:
                max = 10;
                break;
            case TextStyle.TAB_SIZE:
                max = 10;
                break;
            case TextStyle.TEXT_DECORATION_THICKNESS:
                max = 10;
                break;
            case TextStyle.WIDTH:
                min = 20;
                max = 200;
                break;
            default:
                break;
        }
        const marks = [
            {
                value: min,
                label: "" + min,
            },
            {
                value: max,
                label: "" + max,
            },
        ];

        return <SpreadsheetSettingsWidgetSliderWithNumberTextField id={id}
                                                                   key={id}
                                                                   style={{
                                                                       marginLeft: "1em",
                                                                       marginRight: "1em",
                                                                   }}
                                                                   min={min}
                                                                   max={max}
                                                                   marks={marks}
                                                                   step={1}
                                                                   value={value ? value.pixelValue() : ""}
                                                                   defaultValue={null != defaultValue ? defaultValue.pixelValue() : ""}
                                                                   defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                   defaultButtonTooltip={false}
                                                                   setValue={(v) => setValue(v == null ? null : isNaN(v) ? NoneLength.INSTANCE : lengthFromJson(v + "px"))}
        />;
    }

    /**
     * Returns a style which may be empty if for the given {@link SpreadsheetMetadata}.
     */
    defaultStyle(metadata) {
        const defaultMetadata = metadata.getIgnoringDefaults(SpreadsheetMetadata.DEFAULTS);
        var style = TextStyle.EMPTY;

        if(defaultMetadata){
            style = defaultMetadata.getIgnoringDefaults(SpreadsheetMetadata.STYLE) || TextStyle.EMPTY;
        }

        return style;
    }

    static textStylePropertyLabel(property) {
        var label;

        switch(property) {
            case TextStyle.BACKGROUND_COLOR :
                label = "Background color";
                break;
            case TextStyle.BORDER_BOTTOM_COLOR :
                label = "Border bottom color";
                break;
            case TextStyle.BORDER_BOTTOM_STYLE :
                label = "Border bottom style";
                break;
            case TextStyle.BORDER_BOTTOM_WIDTH :
                label = "Border bottom width";
                break;
            case TextStyle.BORDER_LEFT_COLOR :
                label = "Border left color";
                break;
            case TextStyle.BORDER_LEFT_STYLE :
                label = "Border left style";
                break;
            case TextStyle.BORDER_LEFT_WIDTH :
                label = "Border left width";
                break;
            case TextStyle.BORDER_RIGHT_COLOR :
                label = "Border right color";
                break;
            case TextStyle.BORDER_RIGHT_STYLE :
                label = "Border right style";
                break;
            case TextStyle.BORDER_RIGHT_WIDTH :
                label = "Border right width";
                break;
            case TextStyle.BORDER_TOP_COLOR :
                label = "Border top color";
                break;
            case TextStyle.BORDER_TOP_STYLE :
                label = "Border top style";
                break;
            case TextStyle.BORDER_TOP_WIDTH :
                label = "Border top width";
                break;
            case TextStyle.COLOR :
                label = "Color";
                break;
            case TextStyle.HEIGHT :
                label = "Height";
                break;
            case TextStyle.HYPHENS :
                label = "Hyphens";
                break;
            case TextStyle.PADDING_BOTTOM :
                label = "Padding bottom";
                break;
            case TextStyle.PADDING_LEFT :
                label = "Padding left";
                break;
            case TextStyle.PADDING_RIGHT :
                label = "Padding right";
                break;
            case TextStyle.PADDING_TOP :
                label = "Padding top";
                break;
            case TextStyle.TEXT_ALIGN :
                label = "Horizontal align";
                break;
            case TextStyle.VERTICAL_ALIGN :
                label = "Vertical align";
                break;
            case TextStyle.WIDTH :
                label = "Width";
                break;
            case TextStyle.WORD_BREAK :
                label = "Word break";
                break;
            case TextStyle.WORD_WRAP :
                label = "Word wrap";
                break;
            default:
                throw new Error("Unknown TextStyle property \"" + property + "\"");
        }

        return label;
    }

    renderMetadataPropertyRow(property, classes) {
        const id = "settings-spreadsheet-metadata-" + property;

        const state = this.state;
        let render;

        switch(property) {
            case SpreadsheetMetadata.CREATE_DATE_TIME:
                render = "" + state.createDateTimeFormatted;
                break;
            case SpreadsheetMetadata.MODIFIED_DATE_TIME:
                render = "" + state.modifiedDateTimeFormatted;
                break;
            default:
                const metadata = state.spreadsheetMetadata;
                const value = metadata.getIgnoringDefaults(property);

                switch(property) {
                    case SpreadsheetMetadata.SPREADSHEET_ID:
                    case SpreadsheetMetadata.CREATOR:
                    case SpreadsheetMetadata.MODIFIED_BY:
                    case SpreadsheetMetadata.LOCALE:
                    case SpreadsheetMetadata.STYLE:
                        render = <span id={id} key={[id, value]}>{value ? value.toString() : ""}</span>;
                        break;
                    default:
                        const setValue = (v) => {
                            console.log("saving metadata property " + property + "=" + v);

                            this.spreadsheetMetadataSave(metadata.setOrRemove(property, v));
                        };

                        const defaultMetadata = metadata.getIgnoringDefaults(SpreadsheetMetadata.DEFAULTS);
                        const defaultValue = defaultMetadata && defaultMetadata.getIgnoringDefaults(property);

                        switch(property) {
                            case SpreadsheetMetadata.CURRENCY_SYMBOL:
                                render = <SpreadsheetSettingsWidgetString id={id}
                                                                          key={id}
                                                                          length={10}
                                                                          maxLength={10}
                                                                          value={value}
                                                                          defaultValue={defaultValue}
                                                                          defaultValueFormatter={(s) => s}
                                                                          defaultButtonTooltip={false}
                                                                          setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.DATE_FORMAT_PATTERN:
                                render = <SpreadsheetSettingsWidgetSpreadsheetDateFormatPattern id={id}
                                                                                                key={id}
                                                                                                value={value}
                                                                                                defaultValue={defaultValue}
                                                                                                defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                defaultButtonTooltip={true}
                                                                                                setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.DATE_PARSE_PATTERNS:
                                render = <SpreadsheetSettingsWidgetSpreadsheetDateParsePatterns id={id}
                                                                                                key={id}
                                                                                                value={value}
                                                                                                defaultValue={defaultValue}
                                                                                                defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                defaultButtonTooltip={true}
                                                                                                setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.DATETIME_FORMAT_PATTERN:
                                render = <SpreadsheetSettingsWidgetSpreadsheetDateTimeFormatPattern id={id}
                                                                                                    key={id}
                                                                                                    value={value}
                                                                                                    defaultValue={defaultValue}
                                                                                                    defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                    defaultButtonTooltip={true}
                                                                                                    setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.DATETIME_PARSE_PATTERNS:
                                render = <SpreadsheetSettingsWidgetSpreadsheetDateTimeParsePatterns id={id}
                                                                                                    key={id}
                                                                                                    value={value}
                                                                                                    defaultValue={defaultValue}
                                                                                                    defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                    defaultButtonTooltip={true}
                                                                                                    setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.DECIMAL_SEPARATOR:
                            case SpreadsheetMetadata.EXPONENT_SYMBOL:
                            case SpreadsheetMetadata.GROUPING_SEPARATOR:
                            case SpreadsheetMetadata.NEGATIVE_SIGN:
                            case SpreadsheetMetadata.PERCENTAGE_SYMBOL:
                            case SpreadsheetMetadata.POSITIVE_SIGN:
                            case SpreadsheetMetadata.VALUE_SEPARATOR:
                                render = <SpreadsheetSettingsWidgetCharacter id={id}
                                                                             key={[id, value, defaultValue]}
                                                                             value={value}
                                                                             defaultValue={defaultValue}
                                                                             defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                             defaultButtonTooltip={false}
                                                                             setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.EXPRESSION_NUMBER_KIND:
                                render = <SpreadsheetSettingsWidgetSlider id={id}
                                                                          key={id}
                                                                          style={{
                                                                              marginLeft: "2.5em",
                                                                              marginRight: "2.5em",
                                                                          }}
                                                                          values={ExpressionNumberKind.values()}
                                                                          value={value}
                                                                          defaultValue={defaultValue}
                                                                          defaultValueFormatter={DEFAULT_VALUE_FORMATTER_LABEL}
                                                                          defaultButtonTooltip={false}
                                                                          setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.DEFAULT_YEAR:
                            case SpreadsheetMetadata.TWO_DIGIT_YEAR:
                                render = this.number(property, value, id, defaultValue, setValue);
                                break;
                            case SpreadsheetMetadata.CELL_CHARACTER_WIDTH:
                            case SpreadsheetMetadata.DATETIME_OFFSET:
                            case SpreadsheetMetadata.PRECISION:
                                render = this.sliderAndNumber(property, value, id, defaultValue, setValue);
                                break;
                            case SpreadsheetMetadata.NUMBER_FORMAT_PATTERN:
                                render = <SpreadsheetSettingsWidgetSpreadsheetNumberFormatPattern id={id}
                                                                                                  key={id}
                                                                                                  value={value}
                                                                                                  defaultValue={defaultValue}
                                                                                                  defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                  defaultButtonTooltip={true}
                                                                                                  setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.NUMBER_PARSE_PATTERNS:
                                render = <SpreadsheetSettingsWidgetSpreadsheetNumberParsePatterns id={id}
                                                                                                  key={id}
                                                                                                  value={value}
                                                                                                  defaultValue={defaultValue}
                                                                                                  defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                  defaultButtonTooltip={true}
                                                                                                  setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.ROUNDING_MODE:
                                render = <SpreadsheetSettingsWidgetDropDownList id={id}
                                                                                key={id}
                                                                                values={RoundingMode.values()}
                                                                                value={value}
                                                                                defaultValue={defaultValue}
                                                                                defaultValueFormatter={DEFAULT_VALUE_FORMATTER_LABEL}
                                                                                defaultButtonTooltip={false}
                                                                                setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.TEXT_FORMAT_PATTERN:
                                render = <SpreadsheetSettingsWidgetSpreadsheetTextFormatPattern id={id}
                                                                                                key={id}
                                                                                                value={value}
                                                                                                defaultValue={defaultValue}
                                                                                                defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                defaultButtonTooltip={true}
                                                                                                setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.TIME_FORMAT_PATTERN:
                                render = <SpreadsheetSettingsWidgetSpreadsheetTimeFormatPattern id={id}
                                                                                                key={id}
                                                                                                value={value}
                                                                                                defaultValue={defaultValue}
                                                                                                defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                defaultButtonTooltip={true}
                                                                                                setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.TIME_PARSE_PATTERNS:
                                render = <SpreadsheetSettingsWidgetSpreadsheetTimeParsePatterns id={id}
                                                                                                key={id}
                                                                                                value={value}
                                                                                                defaultValue={defaultValue}
                                                                                                defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                defaultButtonTooltip={true}
                                                                                                setValue={setValue}
                                />;
                                break;
                            default:
                                throw new Error("Unknown property " + property);
                        }
                }
                break;
        }

        const label = SpreadsheetSettingsWidget.spreadsheetMetadataPropertyLabel(property);
        return this.tableRow(id, label, render, classes);
    }

    static spreadsheetMetadataPropertyLabel(property) {
        let label;

        switch(property) {
            case SpreadsheetMetadata.CELL_CHARACTER_WIDTH :
                label = "Cell character width";
                break;
            case SpreadsheetMetadata.CREATOR :
                label = "Creator";
                break;
            case SpreadsheetMetadata.CREATE_DATE_TIME :
                label = "Create date/time";
                break;
            case SpreadsheetMetadata.CURRENCY_SYMBOL :
                label = "Currency";
                break;
            case SpreadsheetMetadata.DATE_FORMAT_PATTERN :
                label = "Date format";
                break;
            case SpreadsheetMetadata.DATE_PARSE_PATTERNS :
                label = "Date parse";
                break;
            case SpreadsheetMetadata.DATETIME_OFFSET :
                label = "Date/Time offset";
                break;
            case SpreadsheetMetadata.DATETIME_FORMAT_PATTERN :
                label = "Date/Time format";
                break;
            case SpreadsheetMetadata.DATETIME_PARSE_PATTERNS :
                label = "Date/Time parse";
                break;
            case SpreadsheetMetadata.DECIMAL_SEPARATOR :
                label = "Decimal separator";
                break;
            case SpreadsheetMetadata.DEFAULT_YEAR :
                label = "Default year";
                break;
            case SpreadsheetMetadata.EXPONENT_SYMBOL :
                label = "Exponent symbol";
                break;
            case SpreadsheetMetadata.EXPRESSION_NUMBER_KIND :
                label = "Number";
                break;
            case SpreadsheetMetadata.GROUPING_SEPARATOR :
                label = "Grouping separator";
                break;
            case SpreadsheetMetadata.LOCALE :
                label = "Locale";
                break;
            case SpreadsheetMetadata.MODIFIED_BY :
                label = "Modified by";
                break;
            case SpreadsheetMetadata.MODIFIED_DATE_TIME :
                label = "Modified date/time";
                break;
            case SpreadsheetMetadata.NEGATIVE_SIGN :
                label = "Negative sign";
                break;
            case SpreadsheetMetadata.NUMBER_FORMAT_PATTERN :
                label = "Number format";
                break;
            case SpreadsheetMetadata.NUMBER_PARSE_PATTERNS :
                label = "Number parse";
                break;
            case SpreadsheetMetadata.PERCENTAGE_SYMBOL :
                label = "Percentage sign";
                break;
            case SpreadsheetMetadata.POSITIVE_SIGN :
                label = "Positive sign";
                break;
            case SpreadsheetMetadata.ROUNDING_MODE :
                label = "Rounding mode";
                break;
            case SpreadsheetMetadata.PRECISION :
                label = "Precision";
                break;
            case SpreadsheetMetadata.SPREADSHEET_ID :
                label = "Id";
                break;
            case SpreadsheetMetadata.TEXT_FORMAT_PATTERN :
                label = "Text format";
                break;
            case SpreadsheetMetadata.TIME_FORMAT_PATTERN :
                label = "Time format";
                break;
            case SpreadsheetMetadata.TIME_PARSE_PATTERNS :
                label = "Time parse";
                break;
            case SpreadsheetMetadata.TWO_DIGIT_YEAR :
                label = "Two digit year";
                break;
            case SpreadsheetMetadata.VALUE_SEPARATOR :
                label = "Value separator";
                break;
            default:
                throw new Error("Unknown property \"" + property + "\"");
        }

        return label;
    }

    /**
     * Factory that creates a number widget customising based on the property.
     */
    number(property, value, id, defaultValue, setValue) {
        const numberValue = Number.isNaN(Number(value)) ? null : Number(value);
        var length;
        var maxLength;
        var min;
        var max;
        var style;

        switch(property) {
            case SpreadsheetMetadata.DEFAULT_YEAR:
                length = 4;
                maxLength = 4;
                min = 0;
                max = 2000;
                style = {};
                break;
            case SpreadsheetMetadata.TWO_DIGIT_YEAR:
                length = 2;
                maxLength = 2;
                min = 0;
                max = 99;
                style = {};
                break;
            default:
                break;
        }

        return <SpreadsheetSettingsWidgetNumber id={id}
                                                key={id}
                                                style={style}
                                                length={length}
                                                maxLength={maxLength}
                                                min={min}
                                                max={max}
                                                value={numberValue}
                                                defaultValue={typeof defaultValue === "string" ? parseInt(defaultValue, 10) : defaultValue}
                                                defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                defaultButtonTooltip={false}
                                                setValue={setValue}
        />;
    }

    /**
     * Factory that creates a slider with number using the property to customized some properties.
     */
    sliderAndNumber(property, value, id, defaultValue, setValue) {
        const numberValue = Number.isNaN(Number(value)) ? null : Number(value);
        var min;
        var max;
        var marks;
        var style;
        var step;
        switch(property) {
            case SpreadsheetMetadata.CELL_CHARACTER_WIDTH:
                min = 0;
                max = 20;
                marks = [
                    {
                        value: 1,
                        label: "1",
                    },
                    {
                        value: 10,
                        label: "10",
                    },
                    {
                        value: 20,
                        label: "20",
                    },
                ];
                step = null;
                style = {
                    marginLeft: 0,
                    marginRight: "2em",
                };
                break;
            case SpreadsheetMetadata.DATETIME_OFFSET:
                min = -25569;
                max = -24107;
                marks = [
                    {
                        value: -25569,
                        label: "1900",
                    },
                    {
                        value: -24107,
                        label: "1904",
                    }
                ];
                step = null;
                style = {
                    marginLeft: "1em",
                    marginRight: "2em",
                };
                break;
            case SpreadsheetMetadata.PRECISION:
                min = 0;
                max = 128;
                marks = [
                    {
                        value: 0,
                        label: "∞",
                    },
                    {
                        value: 32,
                        label: "32",
                    },
                    {
                        value: 64,
                        label: "64",
                    },
                    {
                        value: 128,
                        label: "128",
                    },
                ];
                step = null;
                style = {
                    marginLeft: "2em",
                    marginRight: "2em",
                };
                break;
            default:
                break;
        }
        return <SpreadsheetSettingsWidgetSliderWithNumberTextField id={id}
                                                                   key={id}
                                                                   style={style}
                                                                   min={min}
                                                                   max={max}
                                                                   marks={marks}
                                                                   step={step}
                                                                   value={numberValue}
                                                                   defaultValue={typeof defaultValue === "string" ? parseInt(defaultValue, 10) : defaultValue}
                                                                   defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                   defaultButtonTooltip={false}
                                                                   setValue={setValue}
        />;
    }

    tableRow(id, label, value, classes) {
        return <TableRow key={label}
                         hover={true}>
            <TableCell className={classes.label}>{label}</TableCell>
            <TableCell id={id}
                       key={id}
                       className={classes.value}>{value}</TableCell>
        </TableRow>;
    }

    // ACCORDION........................................................................................................

    // https://material-ui.com/components/accordion/

    /**
     * Creates the accordion container so all settingsItems in the settings have a common look and feel and history hash management.
     */
    // TODO AccordionSummary aria-control
    accordion(settingsItem,
              classes,
              heading,
              secondaryHeading,
              tableAriaLabel,
              rows) {
        const id = "settings-spreadsheet-" + settingsItem;

        const state = this.state;
        console.log("accordion: " + id + " settingsItem: " + settingsItem + " state.settingsItem: " + state.settingsItem + " expanded: " + (state.settingsItem === settingsItem), "state", state);

        return <Accordion id={id}
                          key={id}
                          tabIndex={0}
                          expanded={state.settingsItem === settingsItem}
                          onChange={(e, expanded) => this.accordionOnChange(expanded, settingsItem)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon id={id + "-expand-more-icon"}/>}
                              id={id + "-icon"}
            >
                <Typography className={classes.heading}>{heading}</Typography>
                <Typography className={classes.secondaryHeading}>{secondaryHeading}</Typography>
            </AccordionSummary>
            <AccordionDetails id={id + "-content"}>
                <TableContainer key={rows}
                                component={Paper}>
                    <Table className={classes.table}
                           size={"small"}
                           aria-label="{tableAriaLabel}">
                        <TableBody>
                            {
                                rows.map(r => this.renderRow(r, classes))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </AccordionDetails>
        </Accordion>;
    }

    accordionOnChange(expanded, settingsItem) {
        var updated = expanded ?
            settingsItem :
            null;

        console.log("accordionOnChange expanded: " + expanded + " settingsItem: " + settingsItem);

        const tokens = this.props.history.tokens();
        tokens[SpreadsheetHistoryHashTokens.SETTINGS_ITEM] = updated;

        this.historyParseMergeAndPush(tokens);
    }

    /**
     * Unconditionally saves the given SpreadsheetMetadata
     */
    spreadsheetMetadataSave(metadata) {
        Preconditions.requireInstance(metadata, SpreadsheetMetadata, "metadata");

        this.props.spreadsheetMetadataCrud.post(
            metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID),
            metadata,
            this.props.showError,
        );

        this.setState({
            spreadsheetMetadata: metadata,
        });
    }
}

SpreadsheetSettingsWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetMetadataCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud).isRequired,
    notificationShow: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
}

export default withStyles(useStyles)(SpreadsheetSettingsWidget);
