import { GetServerSidePropsContext } from "next"
import { Component, useState } from "react"
import { listQuestions, Question } from "../../../src/rest/questions"
import { getFile, updateFileTags } from "../../../src/rest/files";
import {
    VStack,
    Divider,
    GridItem,
    Heading,
    Link,
    Progress,
    SimpleGrid,
    Spacer,
    Flex,
    IconButton
} from '@chakra-ui/react';
import QuestionSelect from "../../../src/components/tagging/questionselect";
import QuestionComplete from "../../../src/components/tagging/questioncomplete";
import Buttons from "../../../src/components/tagging/buttons";
import { FaHome } from 'react-icons/fa'
import FileRender from "../../../src/components/filerender";
import { NextRouter, useRouter } from "next/router";

interface TaggingProps {
    FileID: string
    Questions: Question[]
    SelectedTags: number[]
}

const Tagging: React.FC<TaggingProps> = (props: TaggingProps) => {
    const router = useRouter()

    const [questionIndex, setQuestionIndex] = useState(0)
    const incrementQuestionIndex = () => setQuestionIndex(Math.min(questionIndex + 1, props.Questions.length))
    const decrementQuestionIndex = () => setQuestionIndex(Math.max(questionIndex - 1, 0))

    const [selectedTags, setSelectedTags] = useState(props.SelectedTags)
    const addSelection = (t: number) => {
        if (selectedTags.indexOf(t) == -1) {
            setSelectedTags(selectedTags => [...selectedTags, t])
        }
    }
    const removeSelection = (t: number) => {
        if (selectedTags.indexOf(t) != -1) {
            setSelectedTags(selectedTags => selectedTags.splice(selectedTags.indexOf(t), 1))
        }
    }

    const saveClick = (fileID: string, selectedTags: number[], router: NextRouter) => async () => {
        await updateFileTags(fileID, selectedTags, true)
        nextFile(router)
    }

    const goHome = (router: NextRouter) => () => {
        var confirmed = confirm("If you are in the middle of tagging a file, the tags will not be saved. Proceed?");
        if (confirmed) {
            router.push("/")
        }
    }

    const nextFile = (router: NextRouter) => {
        router.push("/tagging/newfile")
    }

    const questionSection = () => {
        if (questionIndex >= props.Questions.length) {
            return <QuestionComplete />
        }
        return <QuestionSelect question={props.Questions[questionIndex]} selectionAdded={addSelection} selectionRemoved={removeSelection} selectedTags={selectedTags} />
    }

    return <SimpleGrid columns={2} columnGap={1} height="100vh" width="100vw" bg="gray.900" gridTemplateColumns="1fr auto">
        <GridItem colSpan={1} w="full" flex="1">
            <FileRender fileID={props.FileID} w="full" h="full" />
        </GridItem>
        <GridItem colSpan={1} minW="500px" maxW="500px" bg="gray.300">
            <VStack w="full" padding={3} spacing={10}>
                <VStack w="full" align="flex-start">
                    <Flex w="full" h="fit-content">
                        <Heading as="h1">Current Image</Heading>
                        <Spacer />
                        <IconButton icon={<FaHome />} fontSize="30px" aria-label="home" onClick={goHome(router)}></IconButton>
                    </Flex>
                    <Progress w="full" value={Math.min(questionIndex / props.Questions.length, 1.0) * 100} />
                    <Link href="/tagging/newfile" onClick={_ => nextFile(router)}>Skip this image for now</Link>
                </VStack>
                <Divider />
                {questionSection()}
                <Divider />
                <Buttons isFinished={questionIndex >= props.Questions.length} canGoBack={questionIndex > 0} onBack={decrementQuestionIndex} onNext={incrementQuestionIndex} onSave={saveClick(props.FileID, selectedTags, router)} />
            </VStack>
        </GridItem>
    </SimpleGrid>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    if (context.params == null || context.params.fileid == null || typeof (context.params.fileid) != "string") {
        throw new Error("parameter 'fileid' is required but not provided")
    }
    // TODO: this can be done client-side
    const questions = await listQuestions()

    if (questions == null) {
        throw new Error("questions is null")
    }

    questions.sort((a, b) => {
        if (a.orderingID > b.orderingID) {
            return 1
        }
        if (a.orderingID < b.orderingID) {
            return -1
        }
        return 0
    })

    // Fetch the file so we know what tags are already set
    // We *could* move this to be client-side but this is data-critical:
    // We don't want to accidentally lose tags because we started editing them before
    // we loaded the original ones.
    //
    // This way we must finish loading the tags at least once before we can start tagging
    const file = await getFile(context.params.fileid)

    var data: TaggingProps = {
        Questions: questions,
        FileID: context.params.fileid,
        SelectedTags: file.tags,
    }
    return {
        props: data,
    }
}

export default Tagging