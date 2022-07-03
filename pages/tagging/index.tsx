const Index = () => { }

export async function getServerSideProps() {
    // Redirect to the newfile endpoint which will select a fresh file to tag
    return {
        redirect: {
            destination: "/tagging/newfile",
            permanent: false
        }
    }
}

export default Index