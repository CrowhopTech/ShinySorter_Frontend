import { GridItem, SimpleGrid, VStack, Heading, Box } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import ImageResult from "../../src/components/search/imageresult"
import SelectedTagList from "../../src/components/search/tags/selectedtaglist"
import TagSelectList from "../../src/components/search/tags/tagselectlist"
import { parseQueryMode, queryMode } from "../../src/rest/images"

const includeModeParam = "includeMode"
const excludeModeParam = "excludeMode"
const includedTagsParam = "includedTags"
const excludedTagsParam = "excludedTags"

function generateImages(len: number) {
    let arr = []
    for (let i = 0; i < len; i++) {
        arr.push(<ImageResult key={i} />)
    }
    return arr
}

interface IndexProps {
    includeMode: queryMode
    excludeMode: queryMode
    includedTags: number[]
    excludedTags: number[]
}

const Index: React.FC<IndexProps> = ({ includeMode, excludeMode, includedTags, excludedTags }) => {
    return <SimpleGrid columns={3} columnGap={1} height="100vh" width="100vw" maxW="100vw" bg="gray.900" gridTemplateColumns="min-content min-content auto" overflowX="clip" overflowY="hidden">
        <GridItem bg="gray.700" w="fit-content" minW="250px" padding="10px">
            <TagSelectList />
        </GridItem>
        <GridItem bg="gray.700" w="fit-content" minW="250px" padding="10px">
            <VStack alignItems="flex-start">
                <Heading color="white" fontSize="2xl" overflowWrap={"unset"}>Include files with the tags:</Heading>
                <SelectedTagList selectedMode={includeMode} selectedTags={includedTags}></SelectedTagList>

                <Box height="5px"></Box>

                <Heading color="white" fontSize="2xl" overflowWrap={"unset"}>But exclude files with the tags:</Heading>
                <SelectedTagList selectedMode={excludeMode} selectedTags={excludedTags}></SelectedTagList>
            </VStack>
        </GridItem>
        <GridItem bg="gray.700" padding="10px" overflowY="scroll">
            { /* TODO: replace this with a Chakra SimpleGrid to get that nice file grid layout */}
            <VStack alignItems="flex-start" w="full" spacing="1px">
                {generateImages(10)}
            </VStack>
        </GridItem>
    </SimpleGrid>
}

function parseIntParam(input: undefined | string | string[]): number[] {
    if (input === undefined) {
        return []
    }
    if (typeof input === "string") {
        return [parseInt(input)]
    }
    return input.map((str) => parseInt(str))
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    let includeMode: queryMode = "all"
    let excludeMode: queryMode = "all"
    let includedTags: number[] = []
    let excludedTags: number[] = []

    if (includeModeParam in query) {
        includeMode = parseQueryMode(query[includeModeParam])
    }

    if (excludeModeParam in query) {
        excludeMode = parseQueryMode(query[excludeModeParam])
    }

    if (includedTagsParam in query) {
        includedTags = parseIntParam(query[includedTagsParam])
    }

    if (excludedTagsParam in query) {
        excludedTags = parseIntParam(query[excludedTagsParam])
    }

    return {
        props: {
            includeMode: includeMode,
            excludeMode: excludeMode,
            includedTags: includedTags,
            excludedTags: excludedTags
        }
    }
}

export default Index