import {withStyles} from "@mui/styles";

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Drawer from "@mui/material/Drawer";
import Equality from "../../../Equality.js";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpressionNumberKind from "../../../math/ExpressionNumberKind.js";
import FontFamily from "../../../text/FontFamily.js";
import HttpMethod from "../../../net/HttpMethod.js";
import lengthFromJson from "../../../text/LengthFromJson.js";
import NoneLength from "../../../text/NoneLength.js";
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import RelativeUrl from "../../../net/RelativeUrl.js";
import RoundingMode from "../../../math/RoundingMode.js";
import SpreadsheetFormatRequest from "../../server/format/SpreadsheetFormatRequest.js";
import SpreadsheetHistoryHash from "../../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetLocaleDefaultDateTimeFormat from "../../server/format/SpreadsheetLocaleDefaultDateTimeFormat.js";
import SpreadsheetMessengerCrud from "../../message/SpreadsheetMessengerCrud.js";
import SpreadsheetMetadata from "../SpreadsheetMetadata.js";
import SpreadsheetMetadataWidget from "../SpreadsheetMetadataWidget.js";
import SpreadsheetMultiFormatRequest from "../../server/format/SpreadsheetMultiFormatRequest.js";
import SpreadsheetMultiFormatResponse from "../../server/format/SpreadsheetMultiFormatResponse.js";
import SpreadsheetMetadataPanelWidgetTextFieldCharacter from "./SpreadsheetMetadataPanelWidgetTextFieldCharacter.js";
import SpreadsheetMetadataPanelWidgetTextFieldColor from "./SpreadsheetMetadataPanelWidgetTextFieldColor.js";
import SpreadsheetMetadataPanelWidgetDropDownList from "./SpreadsheetMetadataPanelWidgetDropDownList.js";
import SpreadsheetMetadataPanelWidgetTextFieldNumber from "./SpreadsheetMetadataPanelWidgetTextFieldNumber.js";
import SpreadsheetMetadataPanelWidgetSlider from "./SpreadsheetMetadataPanelWidgetSlider.js";
import SpreadsheetMetadataPanelWidgetSliderAndTextField from "./SpreadsheetMetadataPanelWidgetSliderAndTextField.js";
import SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateFormatPattern
    from "./SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateFormatPattern.js";
import SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateParsePatterns
    from "./SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateParsePatterns.js";
import SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateTimeFormatPattern
    from "./SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateTimeFormatPattern.js";
import SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateTimeParsePatterns
    from "./SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateTimeParsePatterns.js";
import SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetNumberFormatPattern
    from "./SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetNumberFormatPattern.js";
import SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetNumberParsePatterns
    from "./SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetNumberParsePatterns.js";
import SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetTextFormatPattern
    from "./SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetTextFormatPattern.js";
import SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetTimeFormatPattern
    from "./SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetTimeFormatPattern.js";
import SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetTimeParsePatterns
    from "./SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetTimeParsePatterns.js";
import SpreadsheetMetadataPanelWidgetTextFieldString from "./SpreadsheetMetadataPanelWidgetTextFieldString.js";
import SpreadsheetMetadataSaveHistoryHashToken from "./SpreadsheetMetadataSaveHistoryHashToken.js";
import SpreadsheetMetadataSelectHistoryHashToken from "./SpreadsheetMetadataSelectHistoryHashToken.js";
import SpreadsheetMetadataWidgetHistoryHashTokens from "./SpreadsheetMetadataWidgetHistoryHashTokens.js";
import stylePropertyNameToEnum from "../../../text/stylePropertyNameToEnum.js";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TextStyle from "../../../text/TextStyle.js";
import Typography from '@mui/material/Typography';

const DEFAULT_VALUE_FORMATTER_ENUM = (v) => v ? v.nameKebabCase() : "";
const DEFAULT_VALUE_FORMATTER_LABEL = (v) => v ? v.nameCapitalCase().replace("Half", "½") : "";
const DEFAULT_VALUE_FORMATTER_TOSTRING = (v) => null != v ? v.toString() : "";

/**
 * The metadata appears holds all general metadata and tools for a spreadsheet sheet.
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
        width: "175px",
        verticalAlign: "middle",
    },
    value: {
        verticalAlign: "middle",
    },
});

/**
 * Debug option that when false means the drawer will not close when it loses focus to something outside.
 */
const BLUR_CLOSES_DRAWER = true;

class SpreadsheetMetadataPanelWidget extends SpreadsheetMetadataWidget {

    /**
     * The width of the metadata in pixels holding metadata and tools.
     */
    static WIDTH = 750;

    static ID = "metadata-panel";

    static accordionId(accordion) {
        return SpreadsheetMetadataPanelWidget.ID + "-" + accordion;
    }

    /**
     * Returns a selector that fetches the accordion element that can take focus.
     */
    static accordionElementSelector(accordion) {
        return "#" + SpreadsheetMetadataPanelWidget.accordionId(accordion) + " div[tabindex]";
    }

    static drawerId() {
        return SpreadsheetMetadataPanelWidget.ID;
    }

    static expandIconId(accordion) {
        return accordion + "-expand-more-icon";
    }

    // the menu icon which when clicked expands the metadata widget drawer.
    static menuIcon() {
        return SpreadsheetMetadataPanelWidget.ID + "-icon";
    }

    static propertyId(property) {
        return SpreadsheetMetadataPanelWidget.ID + "-" + property;
    }

    init() {
        this.drawer = React.createRef();
    }

    initialStateFromProps(props) {
        const historyHashTokens = props.history.tokens();

        return {
            spreadsheetId: historyHashTokens[SpreadsheetHistoryHash.SPREADSHEET_ID],
            spreadsheetMetadata: null,
            createDateTimeFormatted: "",
            modifiedDateTimeFormatted: "",
            giveMetadataFocus: true,
        };
    }

    stateFromHistoryTokens(tokens) {
        const metadata = tokens[SpreadsheetHistoryHashTokens.METADATA];

        const state = {
            id: tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID],
            metadata: metadata,
        };

        if(!Boolean(metadata)){
            state.giveMetadataFocus = true;
        }

        return state;
    }

    /**
     * Translates the state to history tokens and performs some other updates and checks.
     */
    historyTokensFromState(prevState) {
        const historyTokens = SpreadsheetHistoryHashTokens.emptyTokens();

        const state = this.state;
        const newMetadata = state.metadata;
        const oldMetadata = prevState.metadata;

        if(newMetadata){
            if(!Equality.safeEquals(newMetadata, oldMetadata)){
                if(newMetadata){
                    newMetadata.metadataDrawerWidget(
                        this,
                        oldMetadata
                    );
                }
            }
        }

        return historyTokens;
    }

    /**
     * Returns a function that will accept a value and updates the history hash with a save command.
     */
    saveProperty(property) {
        return (value) => {
            const tokens = SpreadsheetHistoryHashTokens.emptyTokens();
            tokens[SpreadsheetHistoryHashTokens.METADATA] = new SpreadsheetMetadataSaveHistoryHashToken(property, value);
            this.historyParseMergeAndPush(tokens);

            console.log("metadata save " + property + "=" + value, tokens);
        };
    }

    onSpreadsheetMetadata(method, id, url, requestMetadata, responseMetadata) {
        this.setState({
            createDateTimeFormatted: "", // clear forcing reformatting of create/modified timestamps.
            modifiedDateTimeFormatted: "",
            spreadsheetMetadata: responseMetadata,
        });

        this.giveFocus(
            () => {
                const {
                    giveMetadataFocus,
                    metadata,
                } = this.state;

                var element;
                if(giveMetadataFocus && metadata && !metadata.item()){
                    this.setState({
                        giveMetadataFocus: false,
                    });

                    element = this.drawer.current;
                }

                return element;
            }
        );
    }

    render() {
        const {classes} = this.props;
        const {
            metadata,
            spreadsheetMetadata
        } = this.state;

        const metadataItem = metadata && metadata.item();

        // if metadata is empty skip rendering content.
        const children = spreadsheetMetadata &&
            (!spreadsheetMetadata.isEmpty() && metadata &&
                [
                    this.metadataAccordion(classes, SpreadsheetMetadataWidgetHistoryHashTokens.METADATA === metadataItem),
                    this.textPropertiesAccordion(classes, SpreadsheetMetadataWidgetHistoryHashTokens.TEXT === metadataItem),
                    this.numberPropertiesAccordion(classes, SpreadsheetMetadataWidgetHistoryHashTokens.NUMBER === metadataItem),
                    this.dateTimePropertiesAccordion(classes, SpreadsheetMetadataWidgetHistoryHashTokens.DATE_TIME === metadataItem),
                    this.stylePropertiesAccordion(classes, SpreadsheetMetadataWidgetHistoryHashTokens.STYLE === metadataItem)
                ]);

        const onFocus = (e) => {
            const drawer = this.drawer;

            if(!(metadata) && drawer.current && drawer.current.isEqualNode(e.target)){
                console.log("metadata.focus target: ", e.target);

                const tokens = SpreadsheetHistoryHashTokens.emptyTokens();
                tokens[SpreadsheetHistoryHashTokens.METADATA] = SpreadsheetMetadataSelectHistoryHashToken.NOTHING;
                this.historyParseMergeAndPush(tokens);
            }
        };
        const onBlur = (e) => {
            if(BLUR_CLOSES_DRAWER && this.state.metadata){
                const target = e.relatedTarget;
                const drawer = this.drawer;

                if(!drawer.current.contains(target) && !(document.getElementById(SpreadsheetMetadataPanelWidget.menuIcon()).contains(target))){
                    const tokens = SpreadsheetHistoryHashTokens.emptyTokens();
                    tokens[SpreadsheetHistoryHashTokens.METADATA] = null;
                    this.historyParseMergeAndPush(tokens);

                    console.log("metadata.blur", target);
                }
            }
        };

        const onClose = () => {
            const tokens = SpreadsheetHistoryHashTokens.emptyTokens();
            tokens[SpreadsheetHistoryHashTokens.METADATA] = null;

            this.historyParseMergeAndPush(tokens);
        }

        const open = Boolean(metadata);

        return <Drawer id={SpreadsheetMetadataPanelWidget.drawerId()}
                       anchor={"right"}
                       variant={"persistent"}
                       open={open}
                       ref={this.drawer}
                       modal={"false"}
                       onFocus={onFocus}
                       onBlur={onBlur}
                       onClose={onClose}
                       tabIndex={0}
        >
            <div className={classes.root}
                 style={{margin: 0, border: 0, padding: 0, width: SpreadsheetMetadataPanelWidget.WIDTH + "px"}}>
                {children}
            </div>
        </Drawer>;
    }

    // METADATA.........................................................................................................

    /**
     * Renders the metadata accordion, if the createDateTime & modifiedDateTime are not formatted then make a request to format them.
     */
    metadataAccordion(classes) {
        this.formatCreateDateTimeModifiedDateTime();

        return this.renderAccordion(SpreadsheetMetadataWidgetHistoryHashTokens.METADATA,
            classes,
            "Metadata",
            "Readonly Spreadsheet Metadata", SpreadsheetMetadataWidgetHistoryHashTokens.metadataRows()
        );
    }

    /**
     * Make a request to the server to format the createDateTime & modifiedDateTime
     */
    formatCreateDateTimeModifiedDateTime() {
        const state = this.state;
        const metadata = state.metadata;
        const metadataItem = metadata.item();

        if(SpreadsheetMetadataWidgetHistoryHashTokens.METADATA === metadataItem || SpreadsheetMetadataWidgetHistoryHashTokens.METADATA === SpreadsheetMetadataWidgetHistoryHashTokens.parentAccordion(metadataItem)){
            if(!state.createDateTimeFormatted && !state.modifiedDateTimeFormatted){
                const metadata = this.state.spreadsheetMetadata;

                const request = new SpreadsheetMultiFormatRequest(
                    [
                        new SpreadsheetFormatRequest(metadata.getIgnoringDefaults(SpreadsheetMetadata.CREATE_DATE_TIME), SpreadsheetLocaleDefaultDateTimeFormat.INSTANCE),
                        new SpreadsheetFormatRequest(metadata.getIgnoringDefaults(SpreadsheetMetadata.MODIFIED_DATE_TIME), SpreadsheetLocaleDefaultDateTimeFormat.INSTANCE),
                    ]
                );
                const props = this.props;

                props.spreadsheetMetadataCrud.messenger.send(
                    new RelativeUrl("/api/spreadsheet/" + metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID) + "/format", {}),
                    {
                        method: HttpMethod.POST,
                        body: JSON.stringify(request.toJson()),
                    },
                    this.updateFormattedCreateDateTimeAndModifiedDateTime.bind(this),
                    props.showError,
                );
            }
        }
    }

    /**
     * This method should be called by the formatRequest handler when it receives the formatted date/times.
     */
    updateFormattedCreateDateTimeAndModifiedDateTime(multiFormatResponse) {
        const [createDateTime, modifiedDateTime] = SpreadsheetMultiFormatResponse.fromJson(multiFormatResponse).responses();

        this.setState({
            createDateTimeFormatted: createDateTime, // already strings
            modifiedDateTimeFormatted: modifiedDateTime,
        });
    }

    // TEXT.............................................................................................................

    textPropertiesAccordion(classes) {
        return this.renderAccordion(
            SpreadsheetMetadataWidgetHistoryHashTokens.TEXT,
            classes,
            "Text",
            "Text",
            SpreadsheetMetadataWidgetHistoryHashTokens.spreadsheetTextRows()
        );
    }

    dateTimePropertiesAccordion(classes) {
        return this.renderAccordion(
            SpreadsheetMetadataWidgetHistoryHashTokens.DATE_TIME,
            classes,
            "Date/Time",
            "Spreadsheet Date/Time",
            SpreadsheetMetadataWidgetHistoryHashTokens.spreadsheetDateTimeRows()
        );
    }

    numberPropertiesAccordion(classes) {
        return this.renderAccordion(
            SpreadsheetMetadataWidgetHistoryHashTokens.NUMBER,
            classes,
            "Number",
            "Spreadsheet Number Metadata",
            SpreadsheetMetadataWidgetHistoryHashTokens.spreadsheetNumberRows()
        );
    }

    stylePropertiesAccordion(classes) {
        return this.renderAccordion(
            SpreadsheetMetadataWidgetHistoryHashTokens.STYLE,
            classes,
            "Style",
            "Styles",
            SpreadsheetMetadataWidgetHistoryHashTokens.spreadsheetStyleRows()
        );
    }

    renderRow(property, classes) {
        return SpreadsheetMetadata.isProperty(property) ?
            this.renderMetadataPropertyRow(property, classes) :
            this.renderStylePropertyRow(property, classes);
    }

    /**
     * Returns a react component for the given property.
     */
    renderStylePropertyRow(property, classes) {
        const id = SpreadsheetMetadataPanelWidget.propertyId(property);

        const getValue = (metadata) => {
            const style = metadata.getIgnoringDefaults(SpreadsheetMetadata.STYLE);
            return style && style.get(property);
        };

        const setValue = this.saveProperty(property);

        const {history, notificationShow, spreadsheetMetadataCrud} = this.props;
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
                render = <SpreadsheetMetadataPanelWidgetTextFieldColor id={id}
                                                                       key={id}
                                                                       property={property}
                                                                       defaultButtonTooltip={false}
                                                                       defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                       getValue={getValue}
                                                                       setValue={setValue}
                                                                       history={history}
                                                                       notificationShow={notificationShow}
                                                                       spreadsheetMetadataCrud={spreadsheetMetadataCrud}
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
                        render = <SpreadsheetMetadataPanelWidgetSlider id={id}
                                                                       key={id}
                                                                       property={property}
                                                                       values={stylePropertyNameToEnum(property)}
                                                                       getValue={getValue}
                                                                       setValue={setValue}
                                                                       defaultValueFormatter={DEFAULT_VALUE_FORMATTER_ENUM}
                                                                       defaultButtonTooltip={false}
                                                                       history={history}
                                                                       notificationShow={notificationShow}
                                                                       spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                        />;
                        break;
                    case TextStyle.FONT_FAMILY:
                        render = <SpreadsheetMetadataPanelWidgetSlider id={id}
                                                                       key={id}
                                                                       property={property}
                                                                       values={[new FontFamily("Times New Roman")]}
                                                                       getValue={getValue}
                                                                       setValue={setValue}
                                                                       defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                       defaultButtonTooltip={false}
                                                                       history={history}
                                                                       notificationShow={notificationShow}
                                                                       spreadsheetMetadataCrud={spreadsheetMetadataCrud}
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
                                render = this.lengthProperty(property, id, getValue, setValue);
                                break;
                            default:
                                throw new Error("Invalid default style property " + property);
                        }
                        break;
                }
        }

        const label = SpreadsheetMetadataPanelWidget.textStylePropertyLabel(property);
        return this.tableRow(id, label, render, classes);
    }

    /**
     * Factory that creates a component that combines a slider and number text field for entry.
     */
    lengthProperty(property, id, getValue, setValue) {
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

        const {history, notificationShow, spreadsheetMetadataCrud} = this.props;

        return <SpreadsheetMetadataPanelWidgetSliderAndTextField id={id}
                                                                 key={id}
                                                                 property={property}
                                                                 getValue={getValue}
                                                                 valueToNumber={
                                                                (value) => {
                                                                    return value ? value.pixelValue() : 0;
                                                                }
                                                            }
                                                                 numberToValue={
                                                                (value) => {
                                                                    return value === null ?
                                                                        null :
                                                                        isNaN(value) ?
                                                                            NoneLength.INSTANCE :
                                                                            lengthFromJson(value + "px");
                                                                }
                                                            }
                                                                 setValue={setValue}
                                                                 defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                 defaultButtonTooltip={false}
                                                                 history={history}
                                                                 notificationShow={notificationShow}
                                                                 spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                                                 min={min}
                                                                 max={max}
                                                                 marks={marks}
                                                                 step={1}
                                                                 style={{
                                                                marginLeft: "1em",
                                                                marginRight: "1em",
                                                            }}
        />;
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
        const state = this.state;
        const {history, notificationShow, spreadsheetMetadataCrud} = this.props;
        const id = SpreadsheetMetadataPanelWidget.propertyId(property);
        let render;

        switch(property) {
            case SpreadsheetMetadata.CREATE_DATE_TIME:
                render = "" + state.createDateTimeFormatted;
                break;
            case SpreadsheetMetadata.MODIFIED_DATE_TIME:
                render = "" + state.modifiedDateTimeFormatted;
                break;
            default:
                switch(property) {
                    case SpreadsheetMetadata.SPREADSHEET_ID:
                    case SpreadsheetMetadata.CREATOR:
                    case SpreadsheetMetadata.MODIFIED_BY:
                    case SpreadsheetMetadata.LOCALE:
                    case SpreadsheetMetadata.STYLE:
                        const value = state.spreadsheetMetadata.getIgnoringDefaults(property);
                        render =
                            <span property={property} key={[property, value]}>{value ? value.toString() : ""}</span>;
                        break;
                    default:
                        const getValue = (metadata) => {
                            return metadata.getIgnoringDefaults(property);
                        };
                        const setValue = this.saveProperty(property);

                        switch(property) {
                            case SpreadsheetMetadata.CURRENCY_SYMBOL:
                                render = <SpreadsheetMetadataPanelWidgetTextFieldString id={id}
                                                                                        key={property}
                                                                                        property={property}
                                                                                        getValue={getValue}
                                                                                        setValue={setValue}
                                                                                        defaultValueFormatter={(s) => s}
                                                                                        defaultButtonTooltip={false}
                                                                                        history={history}
                                                                                        notificationShow={notificationShow}
                                                                                        spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                                                                        length={10}
                                                                                        maxLength={10}
                                />;
                                break;
                            case SpreadsheetMetadata.DATE_FORMAT_PATTERN:
                                render = <SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateFormatPattern id={id}
                                                                                                              key={property}
                                                                                                              property={property}
                                                                                                              getValue={getValue}
                                                                                                              setValue={setValue}
                                                                                                              defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                              defaultButtonTooltip={true}
                                                                                                              history={history}
                                                                                                              notificationShow={notificationShow}
                                                                                                              spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                />;
                                break;
                            case SpreadsheetMetadata.DATE_PARSE_PATTERNS:
                                render = <SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateParsePatterns id={id}
                                                                                                              key={property}
                                                                                                              property={property}
                                                                                                              getValue={getValue}
                                                                                                              setValue={setValue}
                                                                                                              defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                              defaultButtonTooltip={true}
                                                                                                              history={history}
                                                                                                              notificationShow={notificationShow}
                                                                                                              spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                />;
                                break;
                            case SpreadsheetMetadata.DATETIME_FORMAT_PATTERN:
                                render = <SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateTimeFormatPattern id={id}
                                                                                                                  key={property}
                                                                                                                  property={property}
                                                                                                                  getValue={getValue}
                                                                                                                  setValue={setValue}
                                                                                                                  defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                                  defaultButtonTooltip={true}
                                                                                                                  history={history}
                                                                                                                  notificationShow={notificationShow}
                                                                                                                  spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                />;
                                break;
                            case SpreadsheetMetadata.DATETIME_PARSE_PATTERNS:
                                render = <SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateTimeParsePatterns id={id}
                                                                                                                  key={property}
                                                                                                                  property={property}
                                                                                                                  getValue={getValue}
                                                                                                                  setValue={setValue}
                                                                                                                  defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                                  defaultButtonTooltip={true}
                                                                                                                  history={history}
                                                                                                                  notificationShow={notificationShow}
                                                                                                                  spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                />;
                                break;
                            case SpreadsheetMetadata.DECIMAL_SEPARATOR:
                            case SpreadsheetMetadata.EXPONENT_SYMBOL:
                            case SpreadsheetMetadata.GROUPING_SEPARATOR:
                            case SpreadsheetMetadata.NEGATIVE_SIGN:
                            case SpreadsheetMetadata.PERCENTAGE_SYMBOL:
                            case SpreadsheetMetadata.POSITIVE_SIGN:
                            case SpreadsheetMetadata.VALUE_SEPARATOR:
                                render = <SpreadsheetMetadataPanelWidgetTextFieldCharacter id={id}
                                                                                           key={property}
                                                                                           property={property}
                                                                                           getValue={getValue}
                                                                                           setValue={setValue}
                                                                                           defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                           defaultButtonTooltip={false}
                                                                                           history={history}
                                                                                           notificationShow={notificationShow}
                                                                                           spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                />;
                                break;
                            case SpreadsheetMetadata.EXPRESSION_NUMBER_KIND:
                                render = <SpreadsheetMetadataPanelWidgetSlider id={id}
                                                                               key={property}
                                                                               property={property}
                                                                               values={ExpressionNumberKind.values()}
                                                                               getValue={getValue}
                                                                               setValue={setValue}
                                                                               defaultValueFormatter={DEFAULT_VALUE_FORMATTER_LABEL}
                                                                               defaultButtonTooltip={false}
                                                                               history={history}
                                                                               notificationShow={notificationShow}
                                                                               spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                />;
                                break;
                            case SpreadsheetMetadata.DEFAULT_YEAR:
                            case SpreadsheetMetadata.TWO_DIGIT_YEAR:
                                render = this.number(
                                    property,
                                    id,
                                    getValue,
                                    setValue
                                );
                                break;
                            case SpreadsheetMetadata.CELL_CHARACTER_WIDTH:
                            case SpreadsheetMetadata.DATETIME_OFFSET:
                            case SpreadsheetMetadata.PRECISION:
                                render = this.sliderAndNumber(
                                    property,
                                    id,
                                    getValue,
                                    setValue
                                );
                                break;
                            case SpreadsheetMetadata.NUMBER_FORMAT_PATTERN:
                                render = <SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetNumberFormatPattern id={id}
                                                                                                                key={property}
                                                                                                                property={property}
                                                                                                                getValue={getValue}
                                                                                                                setValue={setValue}
                                                                                                                defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                                defaultButtonTooltip={true}
                                                                                                                history={history}
                                                                                                                notificationShow={notificationShow}
                                                                                                                spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                />;
                                break;
                            case SpreadsheetMetadata.NUMBER_PARSE_PATTERNS:
                                render = <SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetNumberParsePatterns id={id}
                                                                                                                key={property}
                                                                                                                property={property}
                                                                                                                getValue={getValue}
                                                                                                                setValue={setValue}
                                                                                                                defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                                defaultButtonTooltip={true}
                                                                                                                history={history}
                                                                                                                notificationShow={notificationShow}
                                                                                                                spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                />;
                                break;
                            case SpreadsheetMetadata.ROUNDING_MODE:
                                render = <SpreadsheetMetadataPanelWidgetDropDownList id={id}
                                                                                     key={property}
                                                                                     property={property}
                                                                                     values={RoundingMode.values()}
                                                                                     getValue={getValue}
                                                                                     setValue={setValue}
                                                                                     defaultValueFormatter={DEFAULT_VALUE_FORMATTER_LABEL}
                                                                                     defaultButtonTooltip={false}
                                                                                     history={history}
                                                                                     notificationShow={notificationShow}
                                                                                     spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                />;
                                break;
                            case SpreadsheetMetadata.TEXT_FORMAT_PATTERN:
                                render = <SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetTextFormatPattern id={id}
                                                                                                              key={property}
                                                                                                              property={property}
                                                                                                              getValue={getValue}
                                                                                                              setValue={setValue}
                                                                                                              defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                              defaultButtonTooltip={true}
                                                                                                              history={history}
                                                                                                              notificationShow={notificationShow}
                                                                                                              spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                />;
                                break;
                            case SpreadsheetMetadata.TIME_FORMAT_PATTERN:
                                render = <SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetTimeFormatPattern id={id}
                                                                                                              key={property}
                                                                                                              property={property}
                                                                                                              getValue={getValue}
                                                                                                              setValue={setValue}
                                                                                                              defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                              defaultButtonTooltip={true}
                                                                                                              history={history}
                                                                                                              notificationShow={notificationShow}
                                                                                                              spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                />;
                                break;
                            case SpreadsheetMetadata.TIME_PARSE_PATTERNS:
                                render = <SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetTimeParsePatterns id={id}
                                                                                                              key={property}
                                                                                                              property={property}
                                                                                                              getValue={getValue}
                                                                                                              setValue={setValue}
                                                                                                              defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                                                              defaultButtonTooltip={true}
                                                                                                              history={history}
                                                                                                              notificationShow={notificationShow}
                                                                                                              spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                />;
                                break;
                            default:
                                throw new Error("Unknown property " + property);
                        }
                }
                break;
        }

        return this.tableRow(
            id,
            SpreadsheetMetadataPanelWidget.spreadsheetMetadataPropertyLabel(property),
            render,
            classes
        );
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
    number(property, id, getValue, setValue) {
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

        const {history, notificationShow, spreadsheetMetadataCrud} = this.props;

        return <SpreadsheetMetadataPanelWidgetTextFieldNumber id={id}
                                                              key={property}
                                                              property={property}
                                                              style={style}
                                                              length={length}
                                                              maxLength={maxLength}
                                                              min={min}
                                                              max={max}
                                                              getValue={getValue}
                                                              setValue={setValue}
                                                              defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                              defaultButtonTooltip={false}
                                                              history={history}
                                                              notificationShow={notificationShow}
                                                              spreadsheetMetadataCrud={spreadsheetMetadataCrud}
        />;
    }

    /**
     * Factory that creates a slider with number using the property to customized some properties.
     */
    sliderAndNumber(property, id, getValue, setValue) {
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
        const {history, notificationShow, spreadsheetMetadataCrud} = this.props;

        return <SpreadsheetMetadataPanelWidgetSliderAndTextField id={id}
                                                                 key={property}
                                                                 property={property}
                                                                 valueToNumber={(v) => v}
                                                                 numberToValue={(v) => v}
                                                                 getValue={getValue}
                                                                 setValue={setValue}
                                                                 defaultValueFormatter={DEFAULT_VALUE_FORMATTER_TOSTRING}
                                                                 defaultButtonTooltip={false}
                                                                 style={style}
                                                                 min={min}
                                                                 max={max}
                                                                 marks={marks}
                                                                 step={step}
                                                                 history={history}
                                                                 notificationShow={notificationShow}
                                                                 spreadsheetMetadataCrud={spreadsheetMetadataCrud}
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
     * Creates the accordion container so all items in the metadata have a common look and feel and history hash management.
     */
    // TODO AccordionSummary aria-control
    renderAccordion(accordion,
                    classes,
                    heading,
                    tableAriaLabel,
                    rows) {
        const id = SpreadsheetMetadataPanelWidget.accordionId(accordion)

        const state = this.state;
        const metadata = state.metadata;
        const metadataItem = metadata.item();

        const accordingRef = React.createRef();
        const expandIconRef = React.createRef();

        const accordionSelected = metadataItem === accordion;
        const accordionPropertySelected = SpreadsheetMetadataWidgetHistoryHashTokens.parentAccordion(metadataItem) === accordion;

        // give focus to the heading text if history hash = /metadata or /metadata/$accordion
        if(accordionSelected){
            this.giveFocus(
                () => document.querySelector(
                    SpreadsheetMetadataPanelWidget.accordionElementSelector(accordion)
                )
            );
        }

        const onChange = (e, expanded) => {
            console.log("metadata accordion change " + accordion + " " + (expanded ? "expanding" : "collapsing"));

            const historyHashTokens = SpreadsheetHistoryHashTokens.emptyTokens();
            historyHashTokens[SpreadsheetHistoryHashTokens.METADATA] = expanded ? new SpreadsheetMetadataSelectHistoryHashToken(accordion) : SpreadsheetMetadataSelectHistoryHashToken.NOTHING;
            this.historyParseMergeAndPush(historyHashTokens);
        }

        return <Accordion id={id}
                          key={id}
                          ref={accordingRef}
                          expanded={accordionSelected || accordionPropertySelected}
                          onChange={onChange}
                          disableGutters
        ><AccordionSummary ref={expandIconRef}
                           expandIcon={
                               <ExpandMoreIcon id={SpreadsheetMetadataPanelWidget.expandIconId(id)}/>
                           }
        ><Typography className={classes.heading}>{heading}</Typography>
        </AccordionSummary>
            <AccordionDetails id={id + "-content"}>
                <TableContainer key={rows}
                                component={Paper}>
                    <Table className={classes.table}
                           size={"small"}
                           aria-label={tableAriaLabel}>
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
}

SpreadsheetMetadataPanelWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetMetadataCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud).isRequired,
    notificationShow: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
}

export default withStyles(useStyles)(SpreadsheetMetadataPanelWidget);
