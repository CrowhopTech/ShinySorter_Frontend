import { Center, Container, Text, Heading, VStack, Button, Divider } from "@chakra-ui/react"

function goToTag() {
    window.open("/tagging/newimg", "_self")
}

const Index = () => {
    return <Center w="full" h="100vh" bg="gray.900">
        <Container w="container.sm" bg="blue.700" padding="10" rounded="20px">
            <VStack>
                <Heading size="lg" colorScheme="blue">What would you like to do?</Heading>
                <Divider />
                    <Button w="full" colorScheme="blue" onClick={goToTag}>Tag Images</Button>
                    <Button w="full" colorScheme="blue" disabled>Search Images</Button>
                    <Button w="full" colorScheme="blue" disabled>Trim Duplicates</Button>
            </VStack>
        </Container>
    </Center>
}

export default Index