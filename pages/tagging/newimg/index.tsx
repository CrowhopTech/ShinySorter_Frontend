const Index = () => {}

export async function getServerSideProps() {
    // TODO: select a new random image and redirect to it
    // TODO: separate newimg from the imageid endpoint.
    //       Ideally newimg should only be for getting a new ID, after that it should do it directly by image ID
    return {
        redirect: {
            destination: "/tagging/newimg/asdf",
            permanent: false
        }
    }
}

export default Index