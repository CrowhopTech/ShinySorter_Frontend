const Index = () => {}

export async function getServerSideProps() {
    // TODO: select a new random image and redirect to it
    return {
        redirect: {
            destination: "/tagging/asdf",
            permanent: false
        }
    }
}

export default Index