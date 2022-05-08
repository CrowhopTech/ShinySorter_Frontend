import { GetServerSidePropsContext } from "next"

const Index = () => {}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    if (context.params == null || context.params.imageid == null) {
        throw new Error("parameter 'imageid' is required but not provided")
    }
    return {
        redirect: {
            destination: `/tagging/${context.params.imageid}/0`,
            permanent: false
        }
    }
}

export default Index