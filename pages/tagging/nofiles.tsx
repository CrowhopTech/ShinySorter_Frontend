import { Heading, VStack } from "@chakra-ui/react"

const NoFiles = () => {
    return <VStack alignItems="center" margin="50">
        <Heading size="2xl">No more files</Heading>
        <Heading size="xl">Check back later after more files have been added to tag!</Heading>
    </VStack>
}

export default NoFiles