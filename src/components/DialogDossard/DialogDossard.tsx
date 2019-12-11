import * as React from 'react';
import { Component } from 'react';
import { Col, Row } from 'react-grid-system';
import { createStyles, withStyles, InputLabel, Theme, Button, TextField, Dialog } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';


const styles = (theme: Theme) => createStyles({
  root:{
    zIndex: 4
  },
  dialogTitle: {
    backgroundColor: theme.palette.primary.main,
    fontSize: '20px',
    color: theme.palette.primary.contrastText
  },
  dialogFormEdit: {
    marginTop: '25px',
    width: '425px'
  }
});

// DossardDialog Props
interface DossardProps {
  content: any;
  title: string;
  open: boolean;
  onClose(): void;
  onSubmit(objectToSubmit: object): void;
  classes?;
}


class DossardDialog extends Component<DossardProps, {}> {
  
  render() {
    const { open, onClose, onSubmit, content, title, classes } = this.props;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        className={classes.root}
      >
        <DialogTitle disableTypography
                     className={classes.dialogTitle}>{title}</DialogTitle>
        <DialogContent className={classes.dialogFormEdit}>
          {content}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={onSubmit} color="primary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(DossardDialog);
