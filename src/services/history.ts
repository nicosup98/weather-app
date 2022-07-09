import { writable } from "svelte/store"
import { handleFetch } from "../utils/fetch"
import type { QueryParams } from "../models/QueryParams"



function createStore(){
    const { set,update,subscribe} = writable([])

    async function getHistory(params: QueryParams){
        const url = new URL("https://weather-backend-production.up.railway.app/history")
        url.searchParams.set(params.key,params.value)
        const resp = await handleFetch(url)
        set(await resp.json())
        
    }

    function addToHistory(data: any){
        update(h=>[...h,data])
    }

    return {
        subscribe,
        getHistory,
        addToHistory,
        set,
        update
    }
}