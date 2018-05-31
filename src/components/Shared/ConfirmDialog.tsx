import Button from '@material-ui/core/Button/Button';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import Typography from '@material-ui/core/Typography/Typography';
import * as React from 'react';

interface IConfirmDialogProps {
    title: string;
    body: string;
    onConfirm: () => void;
    onCancel: () => void;
    open: boolean;
}

const ConfirmDialog: React.SFC<IConfirmDialogProps> = props => {
    return (
        <Dialog
            disableBackdropClick={true}
            maxWidth="xs"
            open={props.open}
            disableEscapeKeyDown={true}
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <Typography variant="body2">{props.body}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={props.onConfirm} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
