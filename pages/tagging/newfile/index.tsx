import { HStack, Spinner, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { FileQuery, useFiles } from "../../../src/rest/files"

const Index: React.FC = () => {
    const router = useRouter()

    const { files, isLoading, err } = useFiles(new FileQuery(undefined, undefined, undefined, undefined, false))

    if (isLoading) {
        return <Spinner />
    }

    if (!isLoading && err) {
        return <Text>Failed to get untagged files: {err}</Text>
    }

    if (files.length == 0) {
        router.push("/tagging/nofiles")
        return <Spinner />
    }

    const index = Math.min(Math.round(Math.random() * (files.length - 1)), files.length - 1)
    const file = files[index]
    router.push(`/tagging/${file.id}`)
    return <HStack>
        <Text>Taking you to a new page...</Text>
        <Spinner />
    </HStack>
}

export default Index