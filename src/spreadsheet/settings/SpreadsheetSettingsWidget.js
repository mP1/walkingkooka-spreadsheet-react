import {withStyles} from "@material-ui/core/styles";

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Color from "../../color/Color.js";
import Drawer from "@material-ui/core/Drawer";
import Equality from "../../Equality.js";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpressionNumberKind from "../../math/ExpressionNumberKind.js";
import FontFamily from "../../text/FontFamily.js";
import lengthFromJson from "../../text/LengthFromJson.js";
import NoneLength from "../../text/NoneLength.js";
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
                this.spreadsheetDefaultCellBox(classes, SpreadsheetHistoryHash.SETTINGS_STYLE === section)
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

    /**
     * Returns the section for the given property.
     */
    static section(property) {
        var section;

        for(;;) {
            if(SpreadsheetSettingsWidget.metadataRows().includes(property)) {
                section = SpreadsheetHistoryHash.SETTINGS_METADATA;
                break;
            }
            if(SpreadsheetSettingsWidget.spreadsheetTextRows().includes(property)) {
                section = SpreadsheetHistoryHash.SETTINGS_TEXT;
                break;
            }
            if(SpreadsheetSettingsWidget.spreadsheetDateTimeRows().includes(property)) {
                section = SpreadsheetHistoryHash.SETTINGS_DATE_TIME;
                break;
            }
            if(SpreadsheetSettingsWidget.spreadsheetNumberRows().includes(property)) {
                section = SpreadsheetHistoryHash.SETTINGS_NUMBER;
                break;
            }
            if(SpreadsheetSettingsWidget.spreadsheetStyleRows().includes(property)) {
                section = SpreadsheetHistoryHash.SETTINGS_STYLE;
                break;
            }
            throw new Error("Unknown property \"" + property + "\"");
        }

        return section;
    }

    // METADATA.........................................................................................................

    metadata(classes) {
        return this.accordion(
            SpreadsheetHistoryHash.SETTINGS_METADATA,
            classes,
            "Metadata",
            "",
            "Readonly Spreadsheet Metadata",
            SpreadsheetSettingsWidget.metadataRows(),
        );
    }

    static metadataRows() {
        return [
            SpreadsheetMetadata.SPREADSHEET_ID,
            SpreadsheetMetadata.CREATOR,
            SpreadsheetMetadata.CREATE_DATE_TIME,
            SpreadsheetMetadata.MODIFIED_BY,
            SpreadsheetMetadata.MODIFIED_DATE_TIME,
        ];
    }

    // TEXT.............................................................................................................

    spreadsheetText(classes) {
        return this.accordion(
            SpreadsheetHistoryHash.SETTINGS_TEXT,
            classes,
            "Text",
            "",
            "Text",
            SpreadsheetSettingsWidget.spreadsheetTextRows(),
        );
    }

    static spreadsheetTextRows() {
        return [
            TextStyle.COLOR,
            //TextStyle.DIRECTION,
            //TextStyle.FONT_FAMILY,
            //TextStyle.FONT_SIZE,
            TextStyle.FONT_STYLE,
            TextStyle.FONT_VARIANT,
            //TextStyle.FONT_WEIGHT,
            TextStyle.TEXT_ALIGN,
            TextStyle.HYPHENS,
            //TextStyle.LINE_HEIGHT,
            TextStyle.VERTICAL_ALIGN,
            //TextStyle.WORD_SPACING,
            TextStyle.WORD_BREAK,
            TextStyle.WORD_WRAP,
            //
            SpreadsheetMetadata.LOCALE,
            SpreadsheetMetadata.TEXT_FORMAT_PATTERN,
            SpreadsheetMetadata.CELL_CHARACTER_WIDTH,
        ];
    }

    spreadsheetDateTime(classes) {
        return this.accordion(
            SpreadsheetHistoryHash.SETTINGS_DATE_TIME,
            classes,
            "Date/Time",
            "",
            "Spreadsheet Date/Time",
            SpreadsheetSettingsWidget.spreadsheetDateTimeRows(),
        );
    }

    static spreadsheetDateTimeRows() {
        return [
            SpreadsheetMetadata.DATETIME_OFFSET,
            SpreadsheetMetadata.DEFAULT_YEAR,
            SpreadsheetMetadata.TWO_DIGIT_YEAR,
            SpreadsheetMetadata.DATE_FORMAT_PATTERN,
            SpreadsheetMetadata.DATE_PARSE_PATTERNS,
            SpreadsheetMetadata.DATETIME_FORMAT_PATTERN,
            SpreadsheetMetadata.DATETIME_PARSE_PATTERNS,
            SpreadsheetMetadata.TIME_FORMAT_PATTERN,
            SpreadsheetMetadata.TIME_PARSE_PATTERNS
        ];
    }

    spreadsheetNumber(classes) {
        return this.accordion(
            SpreadsheetHistoryHash.SETTINGS_NUMBER,
            classes,
            "Number",
            "",
            "Spreadsheet Number Settings",
            SpreadsheetSettingsWidget.spreadsheetNumberRows()
        );
    }

    static spreadsheetNumberRows() {
        return [
            SpreadsheetMetadata.EXPRESSION_NUMBER_KIND,
            SpreadsheetMetadata.PRECISION,
            SpreadsheetMetadata.ROUNDING_MODE,
            SpreadsheetMetadata.CURRENCY_SYMBOL,
            SpreadsheetMetadata.DECIMAL_SEPARATOR,
            SpreadsheetMetadata.EXPONENT_SYMBOL,
            SpreadsheetMetadata.GROUPING_SEPARATOR,
            SpreadsheetMetadata.NEGATIVE_SIGN,
            SpreadsheetMetadata.PERCENTAGE_SYMBOL,
            SpreadsheetMetadata.POSITIVE_SIGN,
            SpreadsheetMetadata.NUMBER_FORMAT_PATTERN,
            SpreadsheetMetadata.NUMBER_PARSE_PATTERNS,
            SpreadsheetMetadata.VALUE_SEPARATOR,
        ];
    }

    spreadsheetDefaultCellBox(classes) {
        return this.accordion(
            SpreadsheetHistoryHash.SETTINGS_STYLE,
            classes,
            "Default Cell style(s)",
            "",
            "Default Cell style(s)",
            SpreadsheetSettingsWidget.spreadsheetStyleRows(),
        );
    }

    static spreadsheetStyleRows() {
        return [
                TextStyle.BACKGROUND_COLOR,
                //
                TextStyle.WIDTH,
                TextStyle.HEIGHT,
                //
                TextStyle.BORDER_LEFT_COLOR,
                TextStyle.BORDER_LEFT_STYLE,
                TextStyle.BORDER_LEFT_WIDTH,
                //
                TextStyle.BORDER_TOP_COLOR,
                TextStyle.BORDER_TOP_STYLE,
                TextStyle.BORDER_TOP_WIDTH,
                //
                TextStyle.BORDER_RIGHT_COLOR,
                TextStyle.BORDER_RIGHT_STYLE,
                TextStyle.BORDER_RIGHT_WIDTH,
                //
                TextStyle.BORDER_BOTTOM_COLOR,
                TextStyle.BORDER_BOTTOM_STYLE,
                TextStyle.BORDER_BOTTOM_WIDTH,
                //
                TextStyle.PADDING_LEFT,
                TextStyle.PADDING_TOP,
                TextStyle.PADDING_RIGHT,
                TextStyle.PADDING_BOTTOM,
        ];
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
        const id = "spreadsheet-metadata-style-" + property;

        const state = this.state;
        const metadata = state.spreadsheetMetadata;
        const style = metadata.get(SpreadsheetMetadata.STYLE) || TextStyle.EMPTY;
        const setValue = function(v) {
            console.log("saving default style property " + property + "=" + v);

            this.setState( // lgtm [js/react/inconsistent-state-update]
                {
                    spreadsheetMetadata: metadata.set(
                        SpreadsheetMetadata.STYLE,
                        null != v ?
                            style.set(property, v) :
                            style.remove(property)
                    ),
                }
            );
        }.bind(this);

        const value = style.get(property);
        const defaultValue = this.defaultStyle(metadata).get(property);

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
                render = <SpreadsheetSettingsWidgetString id={id}
                                                          value={value}
                                                          defaultButtonTooltip={false}
                                                          defaultValue={defaultValue}
                                                          defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                          setValue={(v) => setValue(!!v ? Color.parse(v) : null)}
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
                    case TextStyle.FONT_STYLE:
                    case TextStyle.FONT_VARIANT:
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

                                render = <SpreadsheetSettingsWidgetSliderWithNumberTextField id={id}
                                                                                             style={{
                                                                                                 marginLeft: "1em",
                                                                                                 marginRight: "1em",
                                                                                             }}
                                                                                             min={min}
                                                                                             max={max}
                                                                                             marks={marks}
                                                                                             step={1}
                                                                                             value={value && value.pixelValue()}
                                                                                             defaultValue={null != defaultValue && defaultValue.pixelValue()}
                                                                                             defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                             defaultButtonTooltip={false}
                                                                                             setValue={(v) => setValue(isNaN(v) ? NoneLength.INSTANCE : lengthFromJson(v + "px"))}
                                />;
                                break;
                            default:
                                throw new Error("Invalid default style property " + property);
                        }
                        break;
                }
        }

        const label = this.textStyleLabel(property);
        return this.tableRow(id, label, render, classes);
    }

    /**
     * Returns a style which may be empty if for the given {@link SpreadsheetMetadata}.
     */
    defaultStyle(metadata) {
        const defaultMetadata = metadata.get(SpreadsheetMetadata.DEFAULTS);
        var style = TextStyle.EMPTY;

        if(defaultMetadata){
            style = defaultMetadata.get(SpreadsheetMetadata.STYLE) || TextStyle.EMPTY;
        }

        return style;
    }

    textStyleLabel(property) {
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
            case TextStyle.BORDER_COLLAPSE :
                label = "Border collapse";
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
            case TextStyle.BORDER_SPACING :
                label = "Border spacing";
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
            case TextStyle.DIRECTION :
                label = "Direction";
                break;
            case TextStyle.FONT_FAMILY :
                label = "Font family";
                break;
            case TextStyle.FONT_KERNING :
                label = "Font kerning";
                break;
            case TextStyle.FONT_SIZE :
                label = "Font size";
                break;
            case TextStyle.FONT_STRETCH :
                label = "Font stretch";
                break;
            case TextStyle.FONT_STYLE :
                label = "Font style";
                break;
            case TextStyle.FONT_VARIANT :
                label = "Font variant";
                break;
            case TextStyle.FONT_WEIGHT :
                label = "Font weight";
                break;
            case TextStyle.HANGING_PUNCTUATION :
                label = "Hanging punctuation";
                break;
            case TextStyle.HEIGHT :
                label = "Height";
                break;
            case TextStyle.HYPHENS :
                label = "Hyphens";
                break;
            case TextStyle.LETTER_SPACING :
                label = "Letter spacing";
                break;
            case TextStyle.LINE_HEIGHT :
                label = "Line height";
                break;
            case TextStyle.LIST_STYLE_POSITION :
                label = "List style position";
                break;
            case TextStyle.LIST_STYLE_TYPE :
                label = "List style type";
                break;
            case TextStyle.MARGIN_BOTTOM :
                label = "Margin bottom";
                break;
            case TextStyle.MARGIN_LEFT :
                label = "Margin left";
                break;
            case TextStyle.MARGIN_RIGHT :
                label = "Margin right";
                break;
            case TextStyle.MARGIN_TOP :
                label = "Margin top";
                break;
            case TextStyle.MAX_HEIGHT :
                label = "Max height";
                break;
            case TextStyle.MAX_WIDTH :
                label = "Max width";
                break;
            case TextStyle.MIN_HEIGHT :
                label = "Min height";
                break;
            case TextStyle.MIN_WIDTH :
                label = "Min width";
                break;
            case TextStyle.OPACITY :
                label = "Opacity";
                break;
            case TextStyle.OUTLINE_COLOR :
                label = "Outline color";
                break;
            case TextStyle.OUTLINE_OFFSET :
                label = "Outline offset";
                break;
            case TextStyle.OUTLINE_STYLE :
                label = "Outline style";
                break;
            case TextStyle.OUTLINE_WIDTH :
                label = "Outline width";
                break;
            case TextStyle.OVERFLOW_X :
                label = "Overflow x";
                break;
            case TextStyle.OVERFLOW_Y :
                label = "Overflow y";
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
            case TextStyle.TAB_SIZE :
                label = "Tab size";
                break;
            case TextStyle.TEXT :
                label = "Text";
                break;
            case TextStyle.TEXT_ALIGN :
                label = "Horizontal align";
                break;
            case TextStyle.TEXT_DECORATION_COLOR :
                label = "Text decoration color";
                break;
            case TextStyle.TEXT_DECORATION_LINE :
                label = "Text decoration line";
                break;
            case TextStyle.TEXT_DECORATION_STYLE :
                label = "Text decoration style";
                break;
            case TextStyle.TEXT_DECORATION_THICKNESS :
                label = "Text decoration thickness";
                break;
            case TextStyle.TEXT_INDENT :
                label = "Indent";
                break;
            case TextStyle.TEXT_JUSTIFY :
                label = "Justify";
                break;
            case TextStyle.TEXT_OVERFLOW :
                label = "Text overflow";
                break;
            case TextStyle.TEXT_TRANSFORM :
                label = "Text transform";
                break;
            case TextStyle.TEXT_WRAPPING :
                label = "Text wrapping";
                break;
            case TextStyle.VERTICAL_ALIGN :
                label = "Vertical align";
                break;
            case TextStyle.VISIBILITY :
                label = "Visibility";
                break;
            case TextStyle.WHITE_SPACE :
                label = "Whitespace";
                break;
            case TextStyle.WIDTH :
                label = "Width";
                break;
            case TextStyle.WORD_BREAK :
                label = "Word break";
                break;
            case TextStyle.WORD_SPACING :
                label = "Word spacing";
                break;
            case TextStyle.WORD_WRAP :
                label = "Word wrap";
                break;
            case TextStyle.WRITING_MODE :
                label = "Writing mode";
                break;
            default:
                throw new Error("Unknown TextStyle property \"" + property + "\"");
        }

        return label;
    }

    renderMetadataPropertyRow(property, classes) {
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
                            case SpreadsheetMetadata.CELL_CHARACTER_WIDTH:
                            case SpreadsheetMetadata.DATETIME_OFFSET:
                            case SpreadsheetMetadata.DEFAULT_YEAR:
                            case SpreadsheetMetadata.PRECISION:
                            case SpreadsheetMetadata.TWO_DIGIT_YEAR:
                                var numberValue; // DATETIME_OFFSET is a java Long in String form, ugly hack to assume can always be converted to a number
                                var min;
                                var max;
                                var marks;
                                var style;
                                var step;
                                switch(property) {
                                    case SpreadsheetMetadata.CELL_CHARACTER_WIDTH:
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

        const label = this.spreadsheetMetadataPropertyLabel(property);
        return this.tableRow(id, label, render, classes);
    }

    spreadsheetMetadataPropertyLabel(property) {
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
            case SpreadsheetMetadata.SPREADSHEET_NAME :
                label = "Name";
                break;
            case SpreadsheetMetadata.STYLE :
                label = "Style";
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

    tableRow(id, label, value, classes) {
        return <TableRow key={label}
                         hover={true}>
            <TableCell className={classes.label}>{label}</TableCell>
            <TableCell id={id}
                       className={classes.value}>{value}</TableCell>
        </TableRow>;
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
