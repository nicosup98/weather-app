import { writable } from "svelte/store"
import { handleFetch } from "../utils/fetch"
import type { QueryParams } from "../models/QueryParams"
import { BASE_URL } from "../utils/constants"
import type { Weather } from "../models/Weather"

function createStore(){
    const {set,subscribe,update} = writable<Weather>(null)

    async function getWeather(city:string,session_id: string,...params: QueryParams[]){
        loadingWeather.set(true)
        console.log({city})
        const url = new URL(`${BASE_URL}/weather/${city}`)
        
        
        for(let p of params){
            url.searchParams.append(p.key,p.value)
        }
        const resp= await handleFetch(url,{headers:{session_id}});
        const data = await resp.json()
        
        set(data as Weather)
        loadingWeather.set(false)
    }

    return {
        subscribe,
        getWeather,
        set,
        update
    };
}




export const weather = createStore()

export const loadingWeather = writable(false)