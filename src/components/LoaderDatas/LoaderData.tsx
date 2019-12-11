import * as React from 'react';
import { Component } from 'react';
import { createStyles, withStyles } from '@material-ui/core';

const styles = createStyles({
  root: {},
  loaderContainer: {
    width: '25%',
    display: 'block',
    margin: '25px auto',
    textAlign: 'center'
  },
  loader: {
    margin: '0 auto',
    display: 'block'
  },
  textLoader: {
    display: 'block',
    fontSize: '20px'
  }
});

interface LoaderDataProps {
  text?: string,
  classes?
}

class LoaderData extends Component<LoaderDataProps, {}> {
  render(): React.ReactNode {

    const { text, classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.loaderContainer}>
          <img className={classes.loader} src="public/img/loader_projects.svg" alt="Loading data"/>
          <p className={classes.textLoader}>{text} <br/> Veuillez patientez ...</p>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(LoaderData);
