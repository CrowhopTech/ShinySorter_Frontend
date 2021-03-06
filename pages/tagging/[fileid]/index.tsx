import { GetServerSidePropsContext } from "next"
import { Component } from "react"
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

interface TaggingProps {
    FileID: string
    Questions: Question[]
    SelectedTags: number[]
}

interface TaggingState {
    QuestionIndex: number // Which index we're at in the list of questions
    SelectedTags: number[]
}

class Tagging extends Component<TaggingProps, TaggingState> {
    // Local copy of the selected tags, we then mirror to the state every time we hit next/previous
    selectedTags: number[]

    constructor(props: TaggingProps) {
        super(props);
        this.selectedTags = props.SelectedTags
        this.state = {
            QuestionIndex: 0,
            SelectedTags: this.selectedTags,
        }

        this.nextClick = this.nextClick.bind(this);
        this.prevClick = this.prevClick.bind(this);
        this.saveClick = this.saveClick.bind(this);
        this.selectionAdded = this.selectionAdded.bind(this);
        this.selectionRemoved = this.selectionRemoved.bind(this);
        this.render = this.render.bind(this);
    }

    nextClick() {
        this.setState({
            ...this.state,
            QuestionIndex: Math.min(this.state.QuestionIndex + 1, this.props.Questions.length),
        })
    }

    prevClick() {
        this.setState({
            ...this.state,
            QuestionIndex: Math.max(this.state.QuestionIndex - 1, 0)
        })
    }

    async saveClick() {
        await updateFileTags(this.props.FileID, this.selectedTags, true)
        window.open("/tagging/newfile", "_self")
    }

    goHome() {
        var confirmed = confirm("If you are in the middle of tagging a file, the tags will not be saved. Proceed?");
        if (confirmed) {
            window.open("/", "_self")
        }
    }

    selectionAdded(t: number) {
        if (this.selectedTags.indexOf(t) == -1) {
            this.selectedTags.push(t)
        }
        this.setState({
            ...this.state,
            SelectedTags: this.selectedTags,
        })
    }

    selectionRemoved(t: number) {
        if (this.selectedTags.indexOf(t) != -1) {
            this.selectedTags.splice(this.selectedTags.indexOf(t), 1)
        }
        this.setState({
            ...this.state,
            SelectedTags: this.selectedTags,
        })
    }

    getQuestionSection() {
        if (this.state.QuestionIndex >= this.props.Questions.length) {
            return <QuestionComplete />
        }
        return <QuestionSelect question={this.props.Questions[this.state.QuestionIndex]} selectionAdded={this.selectionAdded} selectionRemoved={this.selectionRemoved} selectedTags={this.state.SelectedTags} />
    }

    render() {
        return <SimpleGrid columns={2} columnGap={1} height="100vh" width="100vw" bg="gray.900" gridTemplateColumns="1fr auto">
            <GridItem colSpan={1} w="full" flex="1">
                <FileRender fileID={this.props.FileID} w="full" h="full" />
            </GridItem>
            <GridItem colSpan={1} minW="500px" maxW="500px" bg="gray.300">
                <VStack w="full" padding={3} spacing={10}>
                    <VStack w="full" align="flex-start">
                        <Flex w="full" h="fit-content">
                            <Heading as="h1">Current Image</Heading>
                            <Spacer />
                            <IconButton icon={<FaHome />} fontSize="30px" aria-label="home" onClick={this.goHome}></IconButton>
                        </Flex>
                        <Progress w="full" value={Math.min(this.state.QuestionIndex / this.props.Questions.length, 1.0) * 100} />
                        <Link href="/tagging/newfile">Skip this image for now</Link>
                    </VStack>
                    <Divider />
                    {this.getQuestionSection()}
                    <Divider />
                    <Buttons isFinished={this.state.QuestionIndex >= this.props.Questions.length} canGoBack={this.state.QuestionIndex > 0} onBack={this.prevClick} onNext={this.nextClick} onSave={this.saveClick} />
                </VStack>
            </GridItem>
        </SimpleGrid>
    }
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