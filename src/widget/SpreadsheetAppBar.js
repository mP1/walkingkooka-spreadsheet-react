import {makeStyles} from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PropTypes from "prop-types";
import React from 'react';
import SpreadsheetHistoryAwareStateWidget from "../spreadsheet/history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "../spreadsheet/history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../spreadsheet/history/SpreadsheetHistoryHashTokens.js";
import Toolbar from '@mui/material/Toolbar';
import SpreadsheetSettingsSelectHistoryHashToken
    from "../spreadsheet/history/SpreadsheetSettingsSelectHistoryHashToken.js";

function computeSettingsLink(historyHashTokens) {
    // flip the settings token.
    historyHashTokens[SpreadsheetHistoryHashTokens.SETTINGS] = historyHashTokens[SpreadsheetHistoryHashTokens.SETTINGS] ?
        null :
        SpreadsheetSettingsSelectHistoryHashToken.NOTHING;
    return "#" + SpreadsheetHistoryHash.stringify(historyHashTokens);
}

/**
 * An header that displays a menu, followed by an any children which will include the spreadsheet name.
 */
export default class SpreadsheetAppBar extends SpreadsheetHistoryAwareStateWidget {

    static classes = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }));

    init() {
    }

    initialStateFromProps(props) {
        return {
            settingsLink: computeSettingsLink(props.history.tokens())
        };
    }

    /**
     * Re-compute the settings link url.
     */
    stateFromHistoryTokens(historyHashTokens) {
        return {
            settingsLink: computeSettingsLink(historyHashTokens)
        };
    }

    /**
     * Never updates the history tokens.
     */
    historyTokensFromState(prevState) {
        return SpreadsheetHistoryHashTokens.emptyTokens();
    }

    render() {
        return (<AppBar position="static">
            <Toolbar>
                <IconButton id="settings-icon"
                            edge="start"
                            className={SpreadsheetAppBar.classes.menuButton}
                            color="inherit"
                            aria-label="menu"
                            href={this.state.settingsLink}>
                    <MenuIcon/>
                </IconButton>
                {this.props.children}
            </Toolbar>
        </AppBar>);
    }
}

SpreadsheetAppBar.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
}
