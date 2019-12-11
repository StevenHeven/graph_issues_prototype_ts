import * as React from 'react';
import _ from 'lodash';
import { Component } from 'react';
import { Graph } from 'react-d3-graph';
import { createStyles, withStyles, Dialog, Theme, Button } from '@material-ui/core';
import { ZoomOutMap, Close, Delete, Cancel } from '@material-ui/icons';

import QuestionNodeSvg from './QuestionNodeSvg';
import ActionButton from '../ActionButton/ActionButton';


const styles = (theme: Theme) =>
  createStyles({
    diagram: {
      zIndex: 1
    },
    seeFullDiagramButton: {
      color: '#000',
      position: 'absolute',
      left: '95%',
      marginTop: '-60px',
      zIndex: 2
    },
    closeFullDiagramButton: {
      position: 'absolute',
      left: '96%',
      marginTop: '5px',
      color: theme.palette.secondary.main,
      zIndex: 2
    },
    fullDiagramDialog: {
      zIndex: 1
    },
    multipleDeleteButtonsContainer: {
      position: 'absolute',
      top: '1%',
      left: '80%',
      display: 'flex'
    },
    multipleDeleteButtons:{
      margin: '0 10px'
    }
  });

/**
 * Configuration for react-d3-graph
 */

const myConfig = {
  'automaticRearrangeAfterDropNode': false,
  'collapsible': false,
  'directed': true,
  'focusAnimationDuration': 0.75,
  'height': 700,
  'highlightDegree': 2,
  'highlightOpacity': 0.2,
  'linkHighlightBehavior': true,
  'maxZoom': 12,
  'minZoom': 0.05,
  'nodeHighlightBehavior': true,
  'panAndZoom': false,
  'staticGraph': false,
  'staticGraphWithDragAndDrop': true,
  'd3': {
    'alphaTarget': 0.05,
    'gravity': -100,
    'linkLength': 150,
    'linkStrength': 1
  },
  'node': {
    'mouseCursor': 'grab',
    'opacity': 1,
    'renderLabel': false,
    'size': 1500,
    'viewGenerator': node => <QuestionNodeSvg question={node}/>
  },
  'link': {
    'color': '#000',
    'highlightColor': 'red',
    'mouseCursor': 'pointer',
    'opacity': 1,
    'semanticStrokeWidth': false,
    'strokeWidth': 2
  }
};

interface DiagramResultProps {
  model: GraphDataInterface;
  classes?
}

interface DiagramResultState {
  config: object;
  data: any;
  fullWidth: boolean;
}

class DiagramResult extends Component<DiagramResultProps, DiagramResultState> {
  constructor(props) {
    super(props);


    this.state = {
      config: myConfig,
      data: this.props.model,
      fullWidth: false,
    };
  }

  componentDidMount(): void {
    DiagramResult.setHeightNodeAndArrowHeadStyle();
  }

  /**
   * Method to set Height of Node and Arrowhead styles after graph is built
   */
  static setHeightNodeAndArrowHeadStyle(): void {
    const svgContainer = document.getElementById('treeDiagram-graph-wrapper');
    // @ts-ignore
    const svg = svgContainer.children[0] as HTMLElement;
    const arrowhead = document.getElementById('marker-small');
    const node = document.getElementsByClassName('node');

    svg.style.width = '100%';

    for (let i = 0; i < node.length; i++) {
      node[i].children[0].setAttribute('height', '100px');
    }

    // @ts-ignore
    arrowhead.setAttribute('refX', '30');

  }

  /**
   * Method to open Dialog with graph in full screen
   * @param e - The Click Event
   */
  async openFullDiagram(e): Promise<void> {
    await this.setState({
      fullWidth: true
    });
    DiagramResult.setHeightNodeAndArrowHeadStyle();
  }

  /**
   * Method to close Dialog with graph in full screen
   */
  async closeFullDiagram(): Promise<void> {
    await this.setState({
      fullWidth: false
    });
    DiagramResult.setHeightNodeAndArrowHeadStyle();
  }


  render() {
    const { model, classes } = this.props;
    const { fullWidth } = this.state;


    const graphProps = {
      id: 'treeDiagram',
      data: model,
      config: this.state.config
    };

    if (fullWidth){
      graphProps.config = Object.assign({}, graphProps.config, {
        height: window.innerHeight - 10,
        width: window.innerWidth - 10
      });
    }

    const graph = <Graph {...graphProps} />;

    if (fullWidth) {
      return (
        <Dialog fullScreen onClose={this.closeFullDiagram.bind(this)} open={fullWidth}
                className={classes.fullDiagramDialog}>
          <ActionButton icon={<Close/>} onClick={this.closeFullDiagram.bind(this)}
                        classes={{ iconButton: classes.closeFullDiagramButton }}/>
          {graph}
        </Dialog>
      );
    } else {
      return (
        <div className={classes.diagram}>
          {graph}
          <ActionButton
            icon={<ZoomOutMap/>}
            onClick={this.openFullDiagram.bind(this)}
            classes={{
              iconButton: classes.seeFullDiagramButton
            }}
          />
        </div>
      );
    }
  }
}


export default withStyles(styles)(DiagramResult);
