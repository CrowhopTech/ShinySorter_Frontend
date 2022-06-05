import React, { ChangeEvent, Component } from "react";
import { Question } from "../rest/questions";
import {
  VStack,
  Text,
  Checkbox
} from '@chakra-ui/react';

type SelectionModificationEvent = (t: number) => void

interface QuestionSelectData {
  question: Question
  selectionAdded: SelectionModificationEvent
  selectionRemoved: SelectionModificationEvent
  selectedTags: number[]
}

class QuestionSelect extends Component<QuestionSelectData> {
  onSelectionAdded?: SelectionModificationEvent
  onSelectionRemoved?: SelectionModificationEvent

  constructor(props: QuestionSelectData) {
    super(props);
    this.onSelectionAdded = props.selectionAdded
    this.onSelectionRemoved = props.selectionRemoved
    this.onChange = this.onChange.bind(this)
  }

  onChange(e: ChangeEvent<HTMLInputElement>) {
    const modifiedTagID = parseInt(e.target.value)
    if (e.target.checked) {
      if (this.onSelectionAdded != undefined) {
        this.onSelectionAdded(modifiedTagID)
      }
    } else {
      if (this.onSelectionRemoved != undefined) {
        this.onSelectionRemoved(modifiedTagID)
      }
    }
  }

  render() {
    return <VStack align="start" w="full">
      <Text fontSize="2xl" fontWeight="bold">{this.props.question.questionText}</Text>
      {this.props.question.tagOptions.map(opt => (
        <Checkbox key={Math.random()}
          onChange={this.onChange}
          value={opt.tagID}
          isChecked={this.props.selectedTags.indexOf(opt.tagID) != -1}>{opt.optionText}</Checkbox>
      ))}
    </VStack>
  }
}

export default QuestionSelect