import { GetServerSideProps } from "next"
import { FileQuery, listFiles } from "../../../src/rest/files"

const Index = () => { }

export const getServerSideProps: GetServerSideProps = async (context) => {
    // TODO: select a new random image and redirect to it
    const images = await listFiles(new FileQuery(undefined, undefined, undefined, undefined, false))
    if (images == null) {
        throw new Error("images is null")
    }

    if (images.length == 0) {
        return {
            redirect: {
                destination: "/tagging/nofiles",
                permanent: false,
            }
        }
    }

    const index = Math.min(Math.round(Math.random() * (images.length - 1)), images.length - 1)
    const file = images[index]
    return {
        redirect: {
            destination: file.id,
            permanent: false,
        }
    }
}

export default Index