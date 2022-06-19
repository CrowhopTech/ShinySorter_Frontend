import { Box, Button, Center, Heading, HStack, Spinner, Text, VStack, Image as ImageElement } from "@chakra-ui/react";
import { useTag } from "../../rest/tags";
import { Image } from "../../rest/images"
import { ServerAddress, ServerProtocol } from "../../rest/constants";

interface ImageResultData {
    image: Image
    onClick?: (imageID: string) => void
}

function pastelColorForText(text: string) {
    const hash = text.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
    }, 0);
    return `hsl(${hash % 360}, 70%, 70%)`;
}

function generateTag(tagID: number) {
    const { tag, isLoading } = useTag(tagID)
    if (isLoading) {
        return <Spinner key={tagID} />
    }
    return <Box key={tagID} borderWidth="2px" borderColor={pastelColorForText(tag.userFriendlyName)} bg="gray.300" w="fit-content" h="fit-content" padding="3px 10px" rounded="full">
        <Text size="sm" color="gray.900">
            {tag.userFriendlyName}
        </Text>
    </Box>
}

const ImageResult: React.FC<ImageResultData> = ({ image, onClick }) => {
    return <Button w="full" h="150px" colorScheme="whiteAlpha" variant="ghost" onClick={e => onClick && onClick(image.id)}>
        <HStack w="full" h="full" alignItems="flex-start">
            <Center w="fit-content" h="100%">
                <ImageElement maxW="200px" minW="200px" h="100%" src={ServerProtocol + ServerAddress + "/images/contents/" + image.id + "?thumb=true"} fit="contain" />
            </Center>
            <VStack w="full" padding={"8px"} alignItems="flex-start">
                <Heading color="white">{image.id}</Heading>
                <HStack w="full" alignItems="flex-start" flexWrap="wrap">
                    {image.tags.map(generateTag)}
                </HStack>
            </VStack>
        </HStack>
    </Button>
}

export default ImageResult;