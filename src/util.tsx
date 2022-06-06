export function DedupList<T>(input: T[]): T[] {
    let output: T[] = []
    input.forEach((item) => {
        if (output.indexOf(item) === -1) {
            output.push(item)
        }
    })
    return output
}