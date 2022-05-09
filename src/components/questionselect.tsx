import React from "react";
import { Question } from "../rest/questions";
import {
  VStack,
  HStack,
  Text,
  Checkbox,
  FormControl
} from '@chakra-ui/react';

interface QuestionSelectData {
  question: Question
}

const QuestionSelect = ({ question }: QuestionSelectData) => {
  const q: Question = question

  return <VStack align="start" w="full">
    <Text fontSize="2xl" fontWeight="bold">{q.questionText}</Text>
    {q.tagOptions.map(opt => (
      <FormControl key={opt.tagID}>
        <Checkbox>{opt.optionText}</Checkbox>
      </FormControl>
    ))}
  </VStack>
}

export default QuestionSelect