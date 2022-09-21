import { Heading, Link, VStack } from "@chakra-ui/react"
import { useRouter } from "next/router"

const NoFiles = () => {
    const router = useRouter();

    return <VStack alignItems="center" margin="50">
        <Heading size="2xl">No more files</Heading>
        <Heading size="xl">Check back later after more files have been added to tag!</Heading>
        <Link size="xl" color="blue.500" onClick={() => router.push("/")}>Go back home</Link>
    </VStack>
}

export default NoFiles