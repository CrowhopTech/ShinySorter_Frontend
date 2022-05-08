import {
  VStack,
  Image,
  SimpleGrid,
  GridItem,
  Heading,
  Progress,
  Text,
  Link,
  Divider,
} from '@chakra-ui/react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import QuestionSelect from '../../../../src/components/questionselect';
import QuestionComplete from '../../../../src/components/questioncomplete';
import { Question, listQuestions } from '../../../../src/rest/questions';
import Buttons from '../../../../src/components/buttons';
import { getQuestionInfo } from './questionutil';

type Data = {
  imageID: string
  percentageFinished: number
  previousQuestion: Question | null
  currentQuestion: Question | null
  nextQuestion: Question | null
}

// Input: page data
// Output: middle section of the sidebar (complete, some question, failed to load text, etc.)
function getSidebarMidsection(data: Data) {
  const failedToLoadText = <Text>Failed to load next question</Text>
  if (data == null) {
    console.error("props is null")
    return failedToLoadText
  }

  if (data.currentQuestion == null) {
    return <QuestionComplete />
  }

  if (data.currentQuestion == null) {
    console.error("question is null")
    return failedToLoadText
  }
  return <QuestionSelect question={data.currentQuestion} />
}

// Input: page data from getServerSideProps (type Data)
// Function: produce main tagging UI
const Tagging = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  function onNext() {
    var questionID = data.nextQuestion?.orderingID
    if (questionID == undefined) {
      // If we don't have a next question, this is the last question: let's just add one to get to the finished page
      questionID = data.currentQuestion?.orderingID + 1
    }
    window.open(`/tagging/${data.imageID}/${questionID}`, "_self")
  }

  function onBack() {
    window.open(`/tagging/${data.imageID}/${data.previousQuestion?.orderingID}`, "_self")
  }

  function onSave() {
    // TODO: persist tags to memory
    window.open(`/tagging/newimg`, "_self")
  }

  const sidebarMidsection = getSidebarMidsection(data)

  return <SimpleGrid columns={2} columnGap={1} height="100vh" width="100vw" bg="gray.900" gridTemplateColumns="1fr auto">
    <GridItem colSpan={1} w="full" flex="1">
      <Image src="https://myvancity.ca/wp-content/uploads/2019/01/Tulips3-1200x800.jpg" h="100vh" w="full" objectFit="contain" />
    </GridItem>
    <GridItem colSpan={1} minW="500px" maxW="500px" bg="gray.300">
      <VStack w="full" padding={3} spacing={10}>
        <VStack w="full" align="flex-start">
          <Heading as="h1">Current Image</Heading>
          <Progress w="full" value={data.percentageFinished} />
          <Link href="/tagging/newimg">Skip this image for now</Link>
        </VStack>
        <Divider />
        {sidebarMidsection}
        <Divider />
        <Buttons isFinished={data.currentQuestion == null} canGoBack={data.previousQuestion != null} onBack={onBack} onNext={onNext} onSave={onSave} />
      </VStack>
    </GridItem>
  </SimpleGrid>
}
// Q extends ParsedUrlQuery = ParsedUrlQuery, D extends PreviewData = PreviewData
// Input: Client request to server
function parseParameters(context: GetServerSidePropsContext): { questionNumber: number, imageID: string } {
  let qnum = 0
  const qnumRaw = context.params?.["qnum"]
  if (typeof (qnumRaw) === 'string') {
    qnum = parseInt(qnumRaw)
  } else {
    console.error("wrong type provided for question number, defaulting to question zero")
  }

  let imageID = ""
  const imageIDRaw = context.params?.["imageid"]
  if (typeof (imageIDRaw) === 'string') {
    imageID = imageIDRaw
  } else {
    console.error("wrong type provided for image id, defaulting to empty string")
  }

  return { questionNumber: qnum, imageID: imageID }
}

// Input: Client request on server
// Output: Data to send to client (input to Tagging())
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const questions = await listQuestions()

  if (questions == null) {
    console.error("questions is null")
    return {
      props: {
        name: "",
        questions: null
      },
    }
  }
  const { questionNumber, imageID } = parseParameters(context)

  const { prevQuestion, currentQuestion, nextQuestion, percentFinished } = getQuestionInfo(questions, questionNumber)

  // Handle redirecting if our URL doesn't match the ordering ID of the question we're looking at
  if (currentQuestion != null && currentQuestion.orderingID != questionNumber) {
    console.debug(`redirecting from ${questionNumber} to ${currentQuestion.orderingID}`)
    return {
      redirect: {
        destination: `/tagging/${imageID}/${currentQuestion.orderingID}`,
        permanent: false
      }
    }
  }
  // Return the data
  var data: Data = {
    imageID: imageID,
    previousQuestion: prevQuestion,
    currentQuestion: currentQuestion,
    nextQuestion: nextQuestion,
    percentageFinished: percentFinished,
  }
  return { props: { data } }
}

export default Tagging;