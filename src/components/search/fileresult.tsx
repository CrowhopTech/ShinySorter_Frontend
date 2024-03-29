import { Box, Button, Center, Heading, HStack, Spinner, Text, VStack, Image as ImageElement } from "@chakra-ui/react";
import { Tag, useTag, useTags } from "../../rest/tags";
import { File } from "../../rest/files"
import { ServerAddress, ServerProtocol } from "../../rest/address";

interface FileResultData {
    file: File
    onClick?: (imageID: string) => void
}

function pastelColorForText(text: string) {
    const hash = text.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
    }, 0);
    return `hsl(${hash % 360}, 70%, 70%)`;
}

function generateTag(tags: Tag[], isLoading: boolean, tagID: number) {
    if (!tags) {
        return <Spinner key={tagID} />
    }
    const tagIdx = tags.findIndex(t => t.id == tagID)
    if (tagIdx < 0) {
        return <Text size="sm" color="gray.900">Unknown Tag</Text>
    }
    if (isLoading) {
        return <Spinner key={tagID} />
    }
    const tag = tags[tagIdx]
    return <Box key={tagID} borderWidth="2px" borderColor={pastelColorForText(tag.userFriendlyName)} bg="gray.300" w="fit-content" h="fit-content" padding="3px 10px" rounded="full">
        <Text size="sm" color="gray.900">
            {tag.userFriendlyName}
        </Text>
    </Box>
}

const FileResult: React.FC<FileResultData> = ({ file, onClick }) => {
    const { tags, isLoading } = useTags()

    return <Button w="full" h="150px" colorScheme="whiteAlpha" variant="ghost" onClick={e => onClick && onClick(file.id)}>
        <HStack w="full" h="full" alignItems="flex-start">
            <Center w="fit-content" h="100%">
                <ImageElement maxW="200px" minW="200px" h="100%" src={ServerProtocol + ServerAddress + "/files/contents/" + file.id + "?thumb=true"} fit="contain" />
            </Center>
            <VStack w="full" padding={"8px"} alignItems="flex-start">
                <Heading color="white">{file.id}</Heading>
                <HStack w="full" alignItems="flex-start" flexWrap="wrap">
                    {file.tags.map(t => generateTag(tags, isLoading, t))}
                </HStack>
            </VStack>
        </HStack>
    </Button>
}

export default FileResult;