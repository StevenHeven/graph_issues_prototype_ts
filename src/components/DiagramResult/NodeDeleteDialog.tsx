import * as React from 'react';
import { Component } from 'react';
import DossardDialog from '../DialogDossard/DialogDossard';

// ProjectActionsDialog Props
interface NodeDeleteDialogProps {
  numberNodes: number;
  open: boolean;
  onClose(): void;
  onSubmit(): void
  classes?;
}


class NodeDeleteDialog extends Component<NodeDeleteDialogProps, {}> {


  render() {
    const { numberNodes, open, onClose, onSubmit } = this.props;

    return (
      <DossardDialog
        title={numberNodes > 1 ? "Supprimer noeuds" : "Supprimer noeud"}
        content={
          numberNodes > 1
        ? ' Voulez-vous supprimer ces '+ numberNodes +' noeuds ?'
        : 'Voulez-vous supprimer ce noeud ?'}
        onSubmit={onSubmit}
        onClose={onClose}
        open={open}
        />
    );
  }
}


export default NodeDeleteDialog;
