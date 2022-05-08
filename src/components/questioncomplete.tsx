import React from "react";
import { VStack } from "@chakra-ui/layout";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Heading } from "@chakra-ui/react";

const QuestionComplete = () => {
    return <VStack w="full">
        TODO: use a proper image/SVG
        <CheckCircleIcon w="full" h="full" maxBlockSize={256} color="green.400"/>
        <Heading>All done!</Heading>
    </VStack>
}

export default QuestionComplete;