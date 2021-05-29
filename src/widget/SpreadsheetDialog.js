import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import Slide from "@material-ui/core/Slide";
import {withStyles} from "@material-ui/core/styles";

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
                       open={true}
                       onKeyDownCapture={this.onDialogKeyDown.bind(this)}
                       onClose={close} /*aria-labelledby="form-dialog-title"*/
                       TransitionComponent={Transition}
        >
            <DialogTitle id={id + "-DialogTitle"}>
                {title}
                <IconButton id={id + "-close-Button"}
                            aria-label="close"
                            className={classes.closeButton}
                            onClick={close}>
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
            case "Escape":
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