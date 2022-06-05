import { Box, Button, Center, Grid, GridItem, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { Component } from "react";

interface ImageResultData {

}

function pastelColorForText(text: string) {
    const hash = text.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
    }, 0);
    return `hsl(${hash % 360}, 70%, 70%)`;
}

function generateTag(text: string) {
    return <Box key={text} borderWidth="2px" borderColor={pastelColorForText(text)} bg="gray.300" w="fit-content" h="fit-content" padding="3px 10px" rounded="full">
        <Text size="sm" color="gray.900">
            {text}
        </Text>
    </Box>
}

class ImageResult extends Component<ImageResultData> {
    render() {
        return <Button w="full" h="150px" colorScheme="whiteAlpha" variant="ghost">
            <HStack w="full" h="full" alignItems="flex-start">
                <Center w="fit-content" h="100%">
                    <Box bg="red" w="150px" h="90px" />
                </Center>
                <VStack w="full" padding={"8px"} alignItems="flex-start">
                    <Heading color="white">filename.txt</Heading>
                    <HStack w="full" alignItems="flex-start" flexWrap="wrap">
                        {generateTag("apple")}
                        {generateTag("orange")}
                        {generateTag("pear")}
                        {generateTag("bloober")}
                    </HStack>
                </VStack>
            </HStack>
        </Button>
    }
}

export default ImageResult;