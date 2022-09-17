import { Center, Container, Heading, VStack, Button, Divider } from "@chakra-ui/react"
import { NextRouter, useRouter } from "next/router"

function goToTag(router: NextRouter) {
    router.push("/tagging/newfile")
}

function goToSearch(router: NextRouter) {
    router.push("/search")
}

const Index = () => {
    const router = useRouter()

    return <Center w="full" h="100vh" bg="gray.900">
        <Container w="container.sm" bg="blue.700" padding="10" rounded="20px">
            <VStack>
                <Heading size="lg" colorScheme="blue">What would you like to do?</Heading>
                <Divider />
                <Button w="full" colorScheme="blue" onClick={_ => goToTag(router)}>Tag Files</Button>
                <Button w="full" colorScheme="blue" onClick={_ => goToSearch(router)}>Search Files</Button>
                <Button w="full" colorScheme="blue" disabled>Trim Duplicates</Button>
            </VStack>
        </Container>
    </Center>
}

export default Index