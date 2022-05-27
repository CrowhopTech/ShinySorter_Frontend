const Index = () => {}

export async function getServerSideProps() {
    // Redirect to the newimg endpoint which will select a fresh image to tag
    return {
        redirect: {
            destination: "/tagging/newimg",
            permanent: false
        }
    }
}

export default Index