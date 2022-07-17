import { writable } from "svelte/store"
import { handleFetch } from "../utils/fetch"
import type { QueryParams } from "../models/QueryParams"
import { BASE_URL } from "../utils/constants"
import type { History as WeatherHistory } from "../models/History"
import type { Weather } from "../models/Weather"



function createStore(){
    const { set,update,subscribe} = writable<WeatherHistory[]>([])

    async function getHistory(session_id: string,params?: QueryParams){
        const url = new URL(`${BASE_URL}/history`)
        !!params && url.searchParams.set(params.key,params.value)
        const resp = await handleFetch(url,{headers:{session_id}})
        const data: WeatherHistory[] =await resp.json()
        console.log({data})
        set(data)
        
    }

    function addToHistory(data: Weather,historiSize: number = 3){
        update(h=>{
            if(historiSize === h.length) h.pop();
            return [{data,type:"forecast"},...h]
        })
    }

    return {
        subscribe,
        getHistory,
        addToHistory,
        set,
        update
    }
}

export const history = createStore()