import { GetServerSideProps } from "next"
import { listImages } from "../../../src/rest/images"

const Index = () => {}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // TODO: select a new random image and redirect to it
    const images = await listImages(false)
    if (images == null) {
        throw new Error("images is null")
    }

    if (images.length  == 0) {
        return {
            redirect: {
                destination: "/tagging/noimages",
                permanent: false,
            }
        }
    }

    const index = Math.min(Math.round(Math.random() * (images.length-1)), images.length-1)
    const img = images[index]
    return {
        redirect: {
            destination: img.id,
            permanent: false,
        }
    }
}

export default Index