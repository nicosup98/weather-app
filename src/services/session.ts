import { writable } from "svelte/store"
import { handleFetch } from "../utils/fetch"
import { BASE_URL } from "../utils/constants"

function createStore(){
    let { set, subscribe, update } = writable("")
    async function getToken(){
        const token = localStorage.getItem("session_id")

        if(!token){
            const resp =await handleFetch(new URL(`${BASE_URL}/getToken`)) 
            const newToken = await resp.text()

            setToken(newToken)
            return
        }

        set(token)
        return

    }

    async function deleteToken(session_id: string){
        const url = new URL(`${BASE_URL}/deleteToken`)
        const resp = await handleFetch(url,{headers:{session_id}})

        if(resp.status === 200){
            set("")
            localStorage.removeItem("session_id")
        }
    }

    function setToken(session_id: string){
        localStorage.setItem("session_id",session_id)
        set(session_id)
    }

    return {
        subscribe,
        update,
        set,
        getToken,
        deleteToken,
        setToken
    }
}

export const session = createStore()