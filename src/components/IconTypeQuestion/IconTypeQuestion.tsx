import * as React from 'react';
import className from 'classnames';
import { Component } from 'react';
import { createStyles, withStyles} from '@material-ui/core';
import ConflictIcon from '@material-ui/icons/Shuffle';
import UndisiredIcon from '@material-ui/icons/Warning';
import IntermediateIcon from '@material-ui/icons/SettingsEthernet';
import FactIcon from '@material-ui/icons/TurnedInNot';

import TypeQuestionsEnum from '../../enum/TypeQuestionsEnum';


const styles = createStyles({
  iconGeneral: {
    display: 'inline-block',
    width: '25px',
    height: '25px',
    color: 'black',
    padding: '6px',
    marginRight: '10px',
    border: '1px solid',
    borderRadius: '50%',
    textAlign: 'center'
  },
  iconConflict: {
    borderColor: '#FF0000',
    backgroundColor: 'rgba(255, 0, 0, 0.27)'
  },
  iconUndesired: {
    borderColor: '#e68080',
    backgroundColor: 'rgba(230, 128, 128, 0.27)'
  },
  iconIntermediate: {
    borderColor: '#ccffcc',
    backgroundColor: 'rgba(204, 255, 204, 0.27)'
  },
  iconFact: {
    borderColor: '#e7e7e7',
    backgroundColor: 'rgba(231, 231, 231, 0.27)'
  }
});

// IconTypeQuestion Props
interface IconTypeQuestionProps {
  typeQuestion: string
  classes?;
}

class IconTypeQuestion extends Component<IconTypeQuestionProps> {

  static returnIconInFunctionOfType(type, classes) {
    switch (type) {
      case TypeQuestionsEnum.CONFLICT :
        return (<div className={className(classes.iconConflict, classes.iconGeneral)}>
          <ConflictIcon/>
        </div>);
      case TypeQuestionsEnum.UNDESIRED :
        return (<div className={className(classes.iconUndesired, classes.iconGeneral)}>
          <UndisiredIcon/>
        </div>);
      case TypeQuestionsEnum.INTERMEDIATE :
        return (
          <div className={className(classes.iconIntermediate, classes.iconGeneral)}>
            <IntermediateIcon/>
          </div>
        );
      case TypeQuestionsEnum.FACT :
        return (
          <div className={className(classes.iconFact, classes.iconGeneral)}>
            <FactIcon/>
          </div>
        );
    }
  }

  render() {
    const { typeQuestion, classes } = this.props;

    return IconTypeQuestion.returnIconInFunctionOfType(typeQuestion, classes)
  }
}

export default withStyles(styles)(IconTypeQuestion);
