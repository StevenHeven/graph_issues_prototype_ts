import * as React from 'react';
import { Component } from 'react';
import { Col, Row } from 'react-grid-system';
import { createStyles, withStyles, InputLabel, TextField } from '@material-ui/core';
import DossardDialog from '../DialogDossard/DialogDossard';


const styles = createStyles({
  labelAlign: {
    marginTop: '15px',
    paddingRight: 0
  }
});

// NodeEditDialog Props
interface NodeEditDialogProps {
  open: boolean;
  node: NodeInterface;
  onClose(): void;
  onSubmit(newNode: NodeInterface): void;
  classes?;
}

// NodeEditDialog State
interface NodeEditDialogState {
  nodeFound: NodeInterface;
}


class NodeEditDialog extends Component<NodeEditDialogProps, NodeEditDialogState> {

  constructor(props) {
    super(props);

    this.state = {
      nodeFound: null
    };
  }

  componentWillReceiveProps(nextProps: Readonly<NodeEditDialogProps>, nextContext: any): void {
    this.setState({
      nodeFound: nextProps.node
    });
  }

  /**
   * Method to change project property on state
   * @param name - property name
   */
  handleChange(name): any {
    return (event) => {
      const { nodeFound } = this.state;
      const newNode = {
        ...nodeFound,
        [name]: event.target.value
      };
      this.setState({
        nodeFound: newNode
      });
    };
  }

  buildContentDialog(nodeFound, classes, onSubmit) {
    return (
      <Row>
        <Col xl={4} className={classes.labelAlign}>
          <InputLabel required> Nouveau label </InputLabel>
        </Col>

        <Col xl={8}>
          <TextField
            id="name"
            value={nodeFound.questionLabel}
            onChange={this.handleChange('questionLabel').bind(this)}
            onKeyDown={event => event.key === 'Enter' && onSubmit(nodeFound)}
            margin="dense"
            error={nodeFound.questionLabel.length === 0}
            fullWidth
          />
        </Col>
      </Row>
    );
  }


  render() {
    const { node, open, onClose, onSubmit, classes } = this.props;
    const { nodeFound } = this.state;

    if (nodeFound === null) {
      return <div/>;
    }

    return (
      <DossardDialog title="Modifier nom du noeud" content={this.buildContentDialog(nodeFound, classes, onSubmit)} open={open} onClose={onClose}
                     onSubmit={nodeFound.questionLabel !== node.questionLabel ? () => onSubmit(nodeFound) : onClose}/>
    );
  }
}

export default withStyles(styles)(NodeEditDialog);
