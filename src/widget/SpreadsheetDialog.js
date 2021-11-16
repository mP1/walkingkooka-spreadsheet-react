import {withStyles} from "@mui/styles";
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Keys from "../Keys.js";
import PropTypes from 'prop-types';
import React from 'react';
import Slide from "@mui/material/Slide";

const useStyles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * A modal dialog that has a few basic features, like support for ESC key to close the dialog box and a mandatory title
 * and close icon.
 */
class SpreadsheetDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: props.open,
        }
    }

    render() {
        return this.state.open ?
            this.renderDialog() :
            null;
    }

    renderDialog() {
        const {id, classes, children} = this.props;
        const close = this.close.bind(this);

        // children[0] = title
        // children[1] = content
        // children[2...] = actions
        const actions = children.slice();
        const title = actions.shift();
        const content = actions.shift();

        return <Dialog key={id}
                       id={id}
                       fullWidth={true}
                       maxWidth={"md"}
                       open={true}
                       onKeyDownCapture={this.onDialogKeyDown.bind(this)}
                       onClose={close} /*aria-labelledby="form-dialog-title"*/
                       TransitionComponent={Transition}
        >
            <DialogTitle id={id + "-DialogTitle"}>
                {title}
                <IconButton id={id + "-close-Button"}
                            disableTypography
                            aria-label="close"
                            className={classes.closeButton}
                            onClick={close}
                            style={{
                                float: "right",
                                padding: 0,
                                marginTop: "-6px",
                                marginRight: "-8px",
                            //}
                            }}>
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {content}
            </DialogContent>
            <DialogActions>
                {actions}
            </DialogActions>
        </Dialog>
    }

    /**
     * Closes the dialog.
     */
    close() {
        this.setState({
            open: false,
        });
        this.props.onClose();
    }

    /**
     * Supports several keys.
     * <ul>
     * <li>ESCAPE closes the dialog</li>
     * </ul>
     */
    onDialogKeyDown(e) {
        switch(e.key) {
            case Keys.ESCAPE:
                this.onEscape();
                break;
            default:
                break;
        }
    }

    onEscape() {
        this.close();
    }
}

SpreadsheetDialog.propTypes = {
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClose: PropTypes.func.isRequired, // invoked when the dialog is closed
}

export default withStyles(useStyles)(SpreadsheetDialog);