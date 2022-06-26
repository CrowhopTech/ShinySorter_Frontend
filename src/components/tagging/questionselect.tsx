import React, { ChangeEvent, Component } from "react";
import { Question, TagOption } from "../../rest/questions";
import {
  VStack,
  Text,
  Checkbox,
  RadioGroup,
  Radio
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
    this.onChangeRadio = this.onChangeRadio.bind(this)
    this.getQuestionTagsExcluding = this.getQuestionTagsExcluding.bind(this)
    this.getSelectedTagFromQuestion = this.getSelectedTagFromQuestion.bind(this)
  }

  getQuestionTagsExcluding(excluded: number): number[] {
    return this.props.question.tagOptions.
      map((to: TagOption) => to.tagID). // Select the tag ID portion of each option
      filter(tagID => tagID != excluded) // Exclude the tag we're excluding
  }

  getSelectedTagFromQuestion(): number {
    const intersected = this.props.selectedTags.filter(t => this.props.question.tagOptions.findIndex(to => to.tagID == t) !== -1)

    return intersected.length > 0 ? intersected[0] : -1
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

  onChangeRadio(nextValue: string) {
    const newTagID = parseInt(nextValue)

    // Add the new tag ID if not present (if not present, send an update)
    // Remove all other tag IDs from the selected tags
    if (newTagID != -1 && this.props.selectedTags.indexOf(newTagID) == -1) {
      // Selected tag is not already present: add it
      this.onSelectionAdded && this.onSelectionAdded(newTagID)
    }

    const allTagsExcluding = this.getQuestionTagsExcluding(newTagID) // If -1, this will return all
    allTagsExcluding.forEach((tagID: number) => {
      if (this.props.selectedTags.indexOf(tagID) >= 0) {
        // This tag is present but is now removed: remove it
        this.onSelectionRemoved && this.onSelectionRemoved(tagID)
      }
    })
  }

  questionsSection() {
    if (this.props.question.mutuallyExclusive) {
      return <RadioGroup onChange={this.onChangeRadio} value={this.getSelectedTagFromQuestion()}>
        <VStack alignItems="flex-start">
          <Radio key={Math.random()} value={-1}>(none)</Radio>
          {
            this.props.question.tagOptions.map(opt => (
              <Radio key={Math.random()}
                value={opt.tagID}
                isChecked={this.props.selectedTags.indexOf(opt.tagID) != -1}>{opt.optionText}</Radio>
            ))
          }
        </VStack>
      </RadioGroup>
    }

    return this.props.question.tagOptions.map(opt => (
      <Checkbox key={Math.random()}
        onChange={this.onChange}
        value={opt.tagID}
        isChecked={this.props.selectedTags.indexOf(opt.tagID) != -1}>{opt.optionText}</Checkbox>
    ))
  }

  render() {
    return <VStack align="start" w="full">
      <Text fontSize="2xl" fontWeight="bold">{this.props.question.questionText}</Text>
      {this.questionsSection()}
    </VStack>
  }
}

export default QuestionSelect