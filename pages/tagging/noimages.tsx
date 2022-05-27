import { Heading, VStack } from "@chakra-ui/react"

const NoImages = () => {
    return <VStack alignItems="center" margin="50">
        <Heading size="2xl">No more images</Heading>
        <Heading size="xl">Check back later after more images have been added to tag!</Heading>
    </VStack>
}

export default NoImages