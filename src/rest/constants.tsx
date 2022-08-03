export let ServerAddress = ""
export const ServerProtocol = "http://"

const env = process.env.NODE_ENV
if (env == "development") {
    ServerAddress = "localhost:10000"
}
else {
    ServerAddress = "192.168.1.5:30000"
}