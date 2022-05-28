import { GetServerSidePropsContext } from "next"
import { Component } from "react"
import { listQuestions, Question } from "../../../src/rest/questions"
import { getImage, updateImageTags } from "../../../src/rest/images";
import {
    VStack,
    Divider,
    GridItem,
    Heading,
    Text,
    Link,
    Progress,
    SimpleGrid,
    Image,
    Center,
    Spacer,
    Flex,
    IconButton
} from '@chakra-ui/react';
import QuestionSelect from "../../../src/components/questionselect";
import QuestionComplete from "../../../src/components/questioncomplete";
import Buttons from "../../../src/components/buttons";
import { ServerAddress, ServerProtocol } from "../../../src/rest/constants"
import { FaHome } from 'react-icons/fa'

interface TaggingProps {
    ImageID: string
    Questions: Question[]
    SelectedTags: number[]
    MIMEType: string
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
        await updateImageTags(this.props.ImageID, this.selectedTags, true)
        window.open("/tagging/newimg", "_self")
    }

    goHome() {
        var confirmed = confirm("If you are in the middle of tagging an image, the tags will not be saved. Proceed?");
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

    getImageSection() {
        if (this.props.MIMEType == undefined) {
            return <Text color="white">MIME type is not set!</Text>
        }
        if (this.props.MIMEType.startsWith("video")) {
            return <video width="full" controls loop autoPlay muted>
                <source src={ServerProtocol + ServerAddress + "/images/contents/" + this.props.ImageID} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        } else if (this.props.MIMEType.startsWith("image")) {
            return <Image src={ServerProtocol + ServerAddress + "/images/contents/" + this.props.ImageID} h="100vh" w="full" objectFit="contain" />
        } else {
            return <Text>Unknown MIME type</Text>
        }
    }

    render() {
        return <SimpleGrid columns={2} columnGap={1} height="100vh" width="100vw" bg="gray.900" gridTemplateColumns="1fr auto">
            <GridItem colSpan={1} w="full" flex="1">
                <Center w="full" h="full">
                    {this.getImageSection()}
                </Center>
            </GridItem>
            <GridItem colSpan={1} minW="500px" maxW="500px" bg="gray.300">
                <VStack w="full" padding={3} spacing={10}>
                    <VStack w="full" align="flex-start">
                        <Flex w="full" h="fit-content">
                            <Heading as="h1">Current Image</Heading>
                            <Spacer/>
                            <IconButton icon={<FaHome />} fontSize="30px" aria-label="home" onClick={this.goHome}></IconButton>
                        </Flex>
                        <Progress w="full" value={Math.min(this.state.QuestionIndex / this.props.Questions.length, 1.0)*100} />
                        <Link href="/tagging/newimg">Skip this image for now</Link>
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
    if (context.params == null || context.params.imageid == null || typeof (context.params.imageid) != "string") {
        throw new Error("parameter 'imageid' is required but not provided")
    }
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

    const image = await getImage(context.params.imageid)

    var data: TaggingProps = {
        Questions: questions,
        ImageID: context.params.imageid,
        MIMEType: image.mimeType,
        SelectedTags: image.tags,
    }
    return {
        props: data,
    }
}

export default Tagging