import * as React from 'react';
import { Component } from 'react';
import { createStyles, withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton/IconButton';

const styles = createStyles({
  iconButton: {
    color: 'white',
    margin: '2px auto'
  },
  label: {
    display: 'block'
  }
});

// Action Button Props
interface ActionButtonProps {
  icon: object;
  onClick?: (event) => void;
  label?: string;
  classes?;
}

class ActionButton extends Component<ActionButtonProps, {}> {
  buildLabel(element): object {
    if (this.props.label) {
      return <span className={this.props.classes.label}>{element}</span>;
    }
  }

  render() {
    return (
      <span>
          <IconButton
            aria-label="nav"
            className={this.props.classes.iconButton}
            onClick={event => this.props.onClick(event)}
          >
            {this.props.icon}
          </IconButton>
          {this.buildLabel(this.props.label)}
      </span>
    );
  }
}

export default withStyles(styles)(ActionButton);
