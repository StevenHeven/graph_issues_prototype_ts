import * as React from 'react';
import { Component } from 'react';
import { createStyles, withStyles } from '@material-ui/core';

import TypeQuestionsEnum from '../../enum/TypeQuestionsEnum';


interface QuestionNodeSvgProps {
  question: any;
  classes?
}

const ICON_PATH_AND = 'public/img/node_graph_and.svg';

const styles =
  createStyles({
    genericBackgroundConfig: {
      textAlign: 'center',
      paddingBottom: '10px',
      border : "1px solid black",
      borderRadius: '10px',
      backgroundColor: "#fff",
      height: '88px',
    },
    conflictTitle: {
      backgroundColor: '#FF0000',
      color: '#fff',
    },
    unwantedTitle: {
      backgroundColor: '#E68080',
      color: '#fff',
    },
    intermediateTitle: {
      backgroundColor: '#CCFFCC',
      color: '#fff'
    },
    andBackground : {
      height: '100%',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundImage: 'url(' + ICON_PATH_AND + ')'
    },
    titleNode: {
      fontSize: '10px',
      fontWeight: 'bold',
      paddingTop: '3px',
      borderRadius: '9px 9px 0 0',
    },
    textNode: {
      fontSize: '12px',
      padding: '10px'
    }
  });


class QuestionNodeSvg extends Component<QuestionNodeSvgProps, {}> {

  /**
   * Method to set StyleName in function of type
   * @param type - Type of Question
   * @param classes - Classes object
   */
  static checkFamilyToSetClassName(type: string, classes: any) {
    switch (type) {
      case TypeQuestionsEnum.CONFLICT:
        return classes.conflictTitle;
      case TypeQuestionsEnum.UNDESIRED:
        return classes.unwantedTitle;
      case TypeQuestionsEnum.INTERMEDIATE:
        return classes.intermediateTitle;
      case TypeQuestionsEnum.AND:
        return classes.andBackground;
      case TypeQuestionsEnum.FACT:
        return classes.noTypeQuestion;
    }
  }

  render() {

    const { question, classes } = this.props;

    return (
      <div className={question.questionLabel === TypeQuestionsEnum.AND ?  classes.andBackground : classes.genericBackgroundConfig}>
        <div className={[classes.titleNode, QuestionNodeSvg.checkFamilyToSetClassName(question.family, classes)].join(' ')}> {question.family === TypeQuestionsEnum.AND ? '' : question.family} </div>
        <div className={classes.textNode}> {question.questionLabel === TypeQuestionsEnum.AND ? '' : question.questionLabel} </div>
      </div>
    );
  }
}

export default withStyles(styles)(QuestionNodeSvg);
