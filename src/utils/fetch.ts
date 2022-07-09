export async function handleFetch(req: URL, opt?:RequestInit) {
    const resp = await fetch(req,opt);

    return resp;
}