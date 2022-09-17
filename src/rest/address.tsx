export let ServerAddress = ""
export const ServerProtocol = "http://"

let apiServerPort = 30000
if (process.env.API_SERVER_PORT) {
    apiServerPort = parseInt(process.env.API_SERVER_PORT)
}

let apiServerBasepath = ""
// "%EC_API_SERVER_BASEPATH%" will be replaced at docker runtime
const envApiServerBasepath = "/%EC_API_SERVER_BASEPATH%"
if (envApiServerBasepath) {
    apiServerBasepath = envApiServerBasepath
}

const env = process.env.NODE_ENV
if (env == "development") {
    // Use this block to set whatever your local dev API server is running at (feel free to tweak)
    ServerAddress = `192.168.1.5:${apiServerPort}${apiServerBasepath}`
}
else {
    ServerAddress = `192.168.1.5${apiServerBasepath}`
}

console.log(`Server address is ${ServerAddress}`)