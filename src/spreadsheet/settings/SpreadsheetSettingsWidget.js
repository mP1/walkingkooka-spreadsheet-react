import {withStyles} from "@material-ui/core/styles";

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Drawer from "@material-ui/core/Drawer";
import Equality from "../../Equality.js";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpressionNumberKind from "../../math/ExpressionNumberKind.js";
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import RoundingMode from "../../math/RoundingMode.js";
import SpreadsheetFormatRequest from "../server/format/SpreadsheetFormatRequest.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetLocaleDefaultDateTimeFormat from "../server/format/SpreadsheetLocaleDefaultDateTimeFormat.js";
import SpreadsheetMetadata from "../meta/SpreadsheetMetadata.js";
import SpreadsheetMultiFormatRequest from "../server/format/SpreadsheetMultiFormatRequest.js";
import SpreadsheetMultiFormatResponse from "../server/format/SpreadsheetMultiFormatResponse.js";
import SpreadsheetSettingsWidgetCharacter from "./SpreadsheetSettingsWidgetCharacter.js";
import SpreadsheetSettingsWidgetDropDownList from "./SpreadsheetSettingsWidgetDropDownList.js";
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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const DEFAULT_VALUE_FORMATTER_LABEL = (v) => v ? v.nameCapitalCase().replace("Half", "½") : "";
const DEFAULT_VALUE_FORMATTER_TOSTRING = (v) => v ? v.toString() : "";

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

function metadataPropertyRow(label, property) {
    return {
        label: label,
        metadataProperty: property,
    };
}

class SpreadsheetSettingsWidget extends React.Component {

    /**
     * The width of the settings in pixels holding settings and tools.
     */
    static WIDTH = 500;

    constructor(props) {
        super(props);

        this.history = props.history;

        this.state = Object.assign(
            {
                spreadsheetMetadata: props.spreadsheetMetadata,
                createDateTimeFormatted: "",
                modifiedDateTimeFormatted: "",
            },
            this.loadHistoryHash(this.history.location.pathname)
        );

        this.formatCreateDateTimeModifiedDateTime = props.formatCreateDateTimeModifiedDateTime;
        this.setSpreadsheetMetadata = props.setSpreadsheetMetadata;
    }

    /**
     * Toggles the open/close of the settings by updating the state.open flag.
     */
    toggle() {
        const state = this.state;
        const open = state ? !state.open : true;

        console.log("toggle to " + open);

        this.setState({
            open: open,
            section: state.toggleSection, // always clear
            toggleSection: state.section,
        });
    }

    componentDidMount() {
        this.historyUnlisten = this.history.listen(this.onHistoryChange.bind(this));
    }

    componentWillUnmount() {
        this.historyUnlisten();
    }

    /**
     * Updates the state from the history.
     */
    onHistoryChange(location) {
        this.setState(this.loadHistoryHash(this.history.location.pathname));
    }

    /**
     * Loads a state with the open history hash token.
     */
    loadHistoryHash(pathname) {
        const tokens = SpreadsheetHistoryHash.parse(pathname);

        return {
            open: tokens[SpreadsheetHistoryHash.SETTINGS],
            section: tokens[SpreadsheetHistoryHash.SETTINGS_SECTION],
        };
    }

    /**
     * If the create-date-time or modified-date-time changed send a format request.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        const state = this.state;
        console.log("componentDidUpdate", "prevState", prevState, "state", state);

        this.historyUpdateFromState(prevState);

        const metadata = state.spreadsheetMetadata;
        const createDateTime = metadata.get(SpreadsheetMetadata.CREATE_DATE_TIME);
        const modifiedDateTime = metadata.get(SpreadsheetMetadata.MODIFIED_DATE_TIME);

        const previousMetadata = prevState.spreadsheetMetadata;

        if(!metadata.equals(previousMetadata)){
            this.setSpreadsheetMetadata(metadata);
        }

        // initiate requests to fetch create & modified date time.......................................................
        if(!Equality.safeEquals(createDateTime, previousMetadata.get(SpreadsheetMetadata.CREATE_DATE_TIME)) ||
            !Equality.safeEquals(modifiedDateTime, previousMetadata.get(SpreadsheetMetadata.MODIFIED_DATE_TIME))
        ){
            const formatRequests = [];
            formatRequests.push(new SpreadsheetFormatRequest(createDateTime, SpreadsheetLocaleDefaultDateTimeFormat.INSTANCE));
            formatRequests.push(new SpreadsheetFormatRequest(modifiedDateTime, SpreadsheetLocaleDefaultDateTimeFormat.INSTANCE));

            this.sendFormatCreateDateTimeModifiedDateTime(new SpreadsheetMultiFormatRequest(formatRequests));
        }
    }

    /**
     * Possibly update the history hash using the current open state.
     */
    historyUpdateFromState(prevState) {
        const state = this.state;

        const openOld = !!prevState.open;
        const openNew = !!state.open;

        const oldSection = prevState.section;
        const newSection = state.section;

        if(openOld !== openNew || oldSection !== newSection){
            const history = this.history;
            const current = history.location.pathname;
            const replacements = {};
            replacements[SpreadsheetHistoryHash.SETTINGS] = openNew;
            replacements[SpreadsheetHistoryHash.SETTINGS_SECTION] = state.section;

            const updatedPathname = SpreadsheetHistoryHash.merge(
                SpreadsheetHistoryHash.parse(current),
                replacements
            );
            console.log("historyUpdateFromState settings open: " + openOld + " to " + openNew + " section: " + state.section + " history " + current + " to " + updatedPathname);

            if(current !== updatedPathname){
                history.push(updatedPathname);
            }
        }
    }

    /**
     * Make a request to the server to format the createDateTime & modifiedDateTime
     */
    sendFormatCreateDateTimeModifiedDateTime(request) {
        this.formatCreateDateTimeModifiedDateTime(request, this.setFormattedCreateDateTimeAndModifiedDateTime.bind(this)); // TODO handle server format errors
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
        const {open, section, spreadsheetMetadata} = this.state;

        // if metadata is empty skip rendering content.
        const children = (!spreadsheetMetadata.isEmpty() && open &&
            [
                this.metadata(classes, SpreadsheetHistoryHash.SETTINGS_METADATA === section),
                this.spreadsheetText(classes, SpreadsheetHistoryHash.SETTINGS_TEXT === section),
                this.spreadsheetNumber(classes, SpreadsheetHistoryHash.SETTINGS_NUMBER === section),
                this.spreadsheetDateTime(classes, SpreadsheetHistoryHash.SETTINGS_DATE_TIME === section),
                this.spreadsheetStyle(classes, SpreadsheetHistoryHash.SETTINGS_STYLE === section)
            ]);

        return <Drawer id={"settings"}
                       anchor={"right"}
                       variant={"persistent"}
                       open={this.state.open}
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
        this.setState(
            {
                open: false,
            }
        )
    }

    // METADATA.........................................................................................................

    /**
     * Displays the following spreadsheet metadata.
     * <ul>
     * <li>spreadsheet-id</li>
     * <li>creator</li>
     * <li>create date time</li>
     * <li>modified by</li>
     * <li>modified date time</li>
     * <ul>
     */
    metadata(classes) {
        const rows = [
            metadataPropertyRow("Id", SpreadsheetMetadata.SPREADSHEET_ID),
            metadataPropertyRow("Creator", SpreadsheetMetadata.CREATOR),
            metadataPropertyRow("Create Date/Time", SpreadsheetMetadata.CREATE_DATE_TIME),
            metadataPropertyRow("Modified by", SpreadsheetMetadata.MODIFIED_BY),
            metadataPropertyRow("Modified Date/Time", SpreadsheetMetadata.MODIFIED_DATE_TIME),
        ];

        return this.accordion(
            SpreadsheetHistoryHash.SETTINGS_METADATA,
            classes,
            "Metadata",
            "",
            "Readonly Spreadsheet Metadata",
            rows,
        );
    }

    // TEXT.............................................................................................................

    /**
     * Displays the text and locale.
     * <ul>
     * <li>locale (Locale) TODO https://github.com/mP1/walkingkooka-spreadsheet-server/issues/124</li>
     * <li>text-format-pattern (pattern)</li>
     * <ul>
     */
    spreadsheetText(classes) {
        const rows = [
            metadataPropertyRow("Locale", SpreadsheetMetadata.LOCALE),
            metadataPropertyRow("Format", SpreadsheetMetadata.TEXT_FORMAT_PATTERN),
            metadataPropertyRow("Width", SpreadsheetMetadata.WIDTH),
        ];

        return this.accordion(
            SpreadsheetHistoryHash.SETTINGS_TEXT,
            classes,
            "Text",
            "",
            "Text",
            rows,
        );
    }

    /**
     * Displays the following editable spreadsheet date/time settings.
     * <ul>
     * <li>date-format-pattern (pattern)</li>
     * <li>date-parse-patterns (pattern)</li>
     * <li>date-time-offset (1900/1904)</li>
     * <li>date-time-format-pattern (pattern)</li>
     * <li>date-time-parse-patterns (pattern)</li>
     * <li>default-year</li>
     * <li>time-format-pattern (pattern)</li>
     * <li>time-parse-patterns (pattern)</li>
     * <li>two-digit-year (int 0-99)</li>
     * <ul>
     */
    spreadsheetDateTime(classes) {
        const rows = [
            metadataPropertyRow("Date Time Offset", SpreadsheetMetadata.DATETIME_OFFSET), // 1900 or 1904 date system
            metadataPropertyRow("Default Year", SpreadsheetMetadata.DEFAULT_YEAR),
            metadataPropertyRow("Two Digit Year", SpreadsheetMetadata.TWO_DIGIT_YEAR),

            metadataPropertyRow("Date Format", SpreadsheetMetadata.DATE_FORMAT_PATTERN),
            metadataPropertyRow("Date Parse", SpreadsheetMetadata.DATE_PARSE_PATTERNS),
            metadataPropertyRow("Date/Time Format", SpreadsheetMetadata.DATETIME_FORMAT_PATTERN),
            metadataPropertyRow("Date/Time Parse", SpreadsheetMetadata.DATETIME_PARSE_PATTERNS),
            metadataPropertyRow("Time Format", SpreadsheetMetadata.TIME_FORMAT_PATTERN),
            metadataPropertyRow("Time Parse", SpreadsheetMetadata.TIME_PARSE_PATTERNS),
        ];

        return this.accordion(
            SpreadsheetHistoryHash.SETTINGS_DATE_TIME,
            classes,
            "Date/Time",
            "",
            "Spreadsheet Date/Time",
            rows
        );
    }

    /**
     * Displays the following editable spreadsheet number settings.
     * <ul>
     * <li>currency (String)</li>
     * <li>decimal-separator (char)</li>
     * <li>exponent-symbol (char)</li>
     * <li>expression-number-kind (BIGDECIMAL, DECIMAL)</li>
     * <li>grouping-symbol (char)</li>
     * <li>negative-sign (char)</li>
     * <li>number-format-pattern (pattern)</li>
     * <li>number-parse-patterns (pattern)</li>
     * <li>percent-symbol (char)</li>
     * <li>positive-sign (char)</li>
     * <li>precision (int) (DECIMAL32, DECIMAL64, DECIMAL128, UNLIMITED)</li>
     * <li>rounding-mode (RoundingMode) (CEILING, DOWN, FLOOR, HALF_DOWN, HALF_EVEN, HALF_UP, UNNECESSARY, UP)</li>
     * <li>value-separator (char)</li>
     * <ul>
     */
    spreadsheetNumber(classes) {
        const rows = [
            metadataPropertyRow("Number kind", SpreadsheetMetadata.EXPRESSION_NUMBER_KIND),
            metadataPropertyRow("Precision", SpreadsheetMetadata.PRECISION),
            metadataPropertyRow("Rounding mode", SpreadsheetMetadata.ROUNDING_MODE),
            metadataPropertyRow("Currency", SpreadsheetMetadata.CURRENCY_SYMBOL),
            metadataPropertyRow("Decimal separator", SpreadsheetMetadata.DECIMAL_SEPARATOR),
            metadataPropertyRow("Exponent separator", SpreadsheetMetadata.EXPONENT_SYMBOL),
            metadataPropertyRow("Grouping symbol", SpreadsheetMetadata.GROUPING_SEPARATOR),
            metadataPropertyRow("Negative sign", SpreadsheetMetadata.NEGATIVE_SIGN),
            metadataPropertyRow("Percent symbol", SpreadsheetMetadata.PERCENTAGE_SYMBOL),
            metadataPropertyRow("Positive sign", SpreadsheetMetadata.POSITIVE_SIGN),
            metadataPropertyRow("Format", SpreadsheetMetadata.NUMBER_FORMAT_PATTERN),
            metadataPropertyRow("Parse", SpreadsheetMetadata.NUMBER_PARSE_PATTERNS),
            metadataPropertyRow("Value separator", SpreadsheetMetadata.VALUE_SEPARATOR),
        ];

        return this.accordion(
            SpreadsheetHistoryHash.SETTINGS_NUMBER,
            classes,
            "Number",
            "",
            "Spreadsheet Number Settings",
            rows,
        );
    }

    /**
     * Displays the style.
     * <ul>
     * <li>style (TextStyle)</li>
     * <ul>
     */
    spreadsheetStyle(classes) {
        // all ids are prefixed with "spreadsheet-"
        const rows = [
            metadataPropertyRow("Style", SpreadsheetMetadata.STYLE),
        ];

        return this.accordion(
            SpreadsheetHistoryHash.SETTINGS_STYLE,
            classes,
            "Default style(s)",
            "",
            "Spreadsheet default Style(s)",
            rows,
        );
    }

    renderRow(row, classes) {
        const {label, metadataProperty} = row;
        return this.renderMetadataPropertyRow(label, metadataProperty, classes);
    }

    renderMetadataPropertyRow(label, property, classes) {
        const id = "spreadsheet-metadata-" + property;

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
                const value = metadata.get(property);

                switch(property) {
                    case SpreadsheetMetadata.SPREADSHEET_ID:
                    case SpreadsheetMetadata.CREATOR:
                    case SpreadsheetMetadata.MODIFIED_BY:
                    case SpreadsheetMetadata.LOCALE:
                    case SpreadsheetMetadata.STYLE:
                        render = <span id={id}>{value ? value.toString() : ""}</span>;
                        break;
                    default:
                        const setValue = function(v) {
                            console.log("saving metadata property " + property + "=" + v);

                            this.setState( // lgtm [js/react/inconsistent-state-update]
                                {
                                    spreadsheetMetadata: null != v ? metadata.set(property, v) : metadata.remove(property),
                                }
                            );
                        }.bind(this);

                        const defaultMetadata = metadata.get(SpreadsheetMetadata.DEFAULTS);
                        const defaultValue = defaultMetadata && defaultMetadata.get(property);

                        switch(property) {
                            case SpreadsheetMetadata.CURRENCY_SYMBOL:
                                render = <SpreadsheetSettingsWidgetString id={id}
                                                                          value={value}
                                                                          defaultValue={defaultValue}
                                                                          defaultValueFormatter={(s) => s}
                                                                          defaultButtonTooltip={false}
                                                                          setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.DATE_FORMAT_PATTERN:
                                render = <SpreadsheetSettingsWidgetSpreadsheetDateFormatPattern id={id}
                                                                                                value={value}
                                                                                                defaultValue={defaultValue}
                                                                                                defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                defaultButtonTooltip={true}
                                                                                                setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.DATE_PARSE_PATTERNS:
                                render = <SpreadsheetSettingsWidgetSpreadsheetDateParsePatterns id={id}
                                                                                                value={value}
                                                                                                defaultValue={defaultValue}
                                                                                                defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                defaultButtonTooltip={true}
                                                                                                setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.DATETIME_FORMAT_PATTERN:
                                render = <SpreadsheetSettingsWidgetSpreadsheetDateTimeFormatPattern id={id}
                                                                                                    value={value}
                                                                                                    defaultValue={defaultValue}
                                                                                                    defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                    defaultButtonTooltip={true}
                                                                                                    setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.DATETIME_PARSE_PATTERNS:
                                render = <SpreadsheetSettingsWidgetSpreadsheetDateTimeParsePatterns id={id}
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
                                                                             key={[id, value]}
                                                                             value={value}
                                                                             defaultValue={defaultValue}
                                                                             defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                             defaultButtonTooltip={false}
                                                                             setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.EXPRESSION_NUMBER_KIND:
                                render = <SpreadsheetSettingsWidgetSlider id={id}
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
                            case SpreadsheetMetadata.DATETIME_OFFSET:
                            case SpreadsheetMetadata.DEFAULT_YEAR:
                            case SpreadsheetMetadata.PRECISION:
                            case SpreadsheetMetadata.TWO_DIGIT_YEAR:
                            case SpreadsheetMetadata.WIDTH:
                                var numberValue; // DATETIME_OFFSET is a java Long in String form, ugly hack to assume can always be converted to a number
                                var min;
                                var max;
                                var marks;
                                var style;
                                var step;
                                switch(property) {
                                    case SpreadsheetMetadata.DATETIME_OFFSET:
                                        numberValue = typeof value == "string" ? parseInt(value) : value;
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
                                    case SpreadsheetMetadata.DEFAULT_YEAR:
                                        numberValue = value;
                                        min = 1900;
                                        max = 2020;
                                        marks = [
                                            {
                                                value: 1900,
                                                label: "1900",
                                            },
                                            {
                                                value: 2000,
                                                label: "2000",
                                            }
                                        ];
                                        step = null;
                                        style = {
                                            marginLeft: "1em",
                                            marginRight: "2em",
                                        };
                                        break;
                                    case SpreadsheetMetadata.PRECISION:
                                        numberValue = value;
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
                                    case SpreadsheetMetadata.TWO_DIGIT_YEAR:
                                        numberValue = value;
                                        min = 0;
                                        max = 99;
                                        marks = [
                                            {
                                                value: 20,
                                                label: "20",
                                            },
                                            {
                                                value: 50,
                                                label: "50",
                                            },
                                            {
                                                value: 70,
                                                label: "70",
                                            },
                                        ];
                                        step = null;
                                        style = {
                                            marginLeft: "2em",
                                            marginRight: "2em",
                                        };
                                        break;
                                    case SpreadsheetMetadata.WIDTH:
                                        numberValue = value;
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
                                    default:
                                        break;
                                }
                                render = <SpreadsheetSettingsWidgetSliderWithNumberTextField id={id}
                                                                                             style={style}
                                                                                             min={min}
                                                                                             max={max}
                                                                                             marks={marks}
                                                                                             step={step}
                                                                                             value={numberValue}
                                                                                             defaultValue={typeof defaultValue === "string" ? parseInt(defaultValue) : defaultValue}
                                                                                             defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                             defaultButtonTooltip={false}
                                                                                             setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.NUMBER_FORMAT_PATTERN:
                                render = <SpreadsheetSettingsWidgetSpreadsheetNumberFormatPattern id={id}
                                                                                                  value={value}
                                                                                                  defaultValue={defaultValue}
                                                                                                  defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                  defaultButtonTooltip={true}
                                                                                                  setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.NUMBER_PARSE_PATTERNS:
                                render = <SpreadsheetSettingsWidgetSpreadsheetNumberParsePatterns id={id}
                                                                                                  value={value}
                                                                                                  defaultValue={defaultValue}
                                                                                                  defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                  defaultButtonTooltip={true}
                                                                                                  setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.ROUNDING_MODE:
                                render = <SpreadsheetSettingsWidgetDropDownList id={id}
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
                                                                                                value={value}
                                                                                                defaultValue={defaultValue}
                                                                                                defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                defaultButtonTooltip={true}
                                                                                                setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.TIME_FORMAT_PATTERN:
                                render = <SpreadsheetSettingsWidgetSpreadsheetTimeFormatPattern id={id}
                                                                                                value={value}
                                                                                                defaultValue={defaultValue}
                                                                                                defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                defaultButtonTooltip={true}
                                                                                                setValue={setValue}
                                />;
                                break;
                            case SpreadsheetMetadata.TIME_PARSE_PATTERNS:
                                render = <SpreadsheetSettingsWidgetSpreadsheetTimeParsePatterns id={id}
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

        // hover = highlight under mouse over
        return (
            <TableRow key={label}
                      hover={true}>
                <TableCell className={classes.label}>{label}</TableCell>
                <TableCell id={id}
                           className={classes.value}>{render}</TableCell>
            </TableRow>);
    }

    // ACCORDION........................................................................................................

    // https://material-ui.com/components/accordion/

    /**
     * Creates the accordion container so all sections in the settings have a common look and feel and history hash management.
     */
    // TODO AccordionSummary aria-control
    accordion(sectionName,
              classes,
              heading,
              secondaryHeading,
              tableAriaLabel,
              rows) {
        const id = "spreadsheet-" + sectionName;

        const state = this.state;
        console.log("accordion: " + id + " sectionName: " + sectionName + " state.section: " + state.section + " expanded: " + (state.section === sectionName), "state", state);

        return <Accordion key={id}
                          id={id}
                          expanded={state.section === sectionName}
                          onChange={(e, expanded) => this.accordionOnChange(expanded, sectionName)}>
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

    accordionOnChange(expanded, sectionName) {
        var stateSectionName = expanded ?
            sectionName :
            null;

        console.log("accordionOnChange expanded: " + expanded + " sectionName: " + sectionName + " new state.section: " + stateSectionName, "state", this.state);

        this.setState({
            section: stateSectionName,
            toggleSection: stateSectionName,
        });
    }
}

SpreadsheetSettingsWidget.propTypes = {
    history: PropTypes.object.isRequired, // history will provide open
    formatCreateDateTimeModifiedDateTime: PropTypes.func.isRequired, // required to format date/times, parameters: SpreadsheetMultiFormatRequest, successHandler => SpreadsheetMultiFormatResponse
    spreadsheetMetadata: PropTypes.instanceOf(SpreadsheetMetadata).isRequired,
    setSpreadsheetMetadata: PropTypes.func.isRequired, // fired when the SpreadsheetMetadata is updated.
}

export default withStyles(useStyles)(SpreadsheetSettingsWidget);
