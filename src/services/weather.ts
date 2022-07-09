import { writable } from "svelte/store"
import { handleFetch } from "../utils/fetch"
import type { QueryParams } from "../models/QueryParams"
import {  getCookie} from "../utils/navigatorStorage"


function createStore(){
    const {set,subscribe,update} = writable(null)

    async function getWeather(city:string,...params: QueryParams[]){
        loadingWeather.set(true)
        console.log({city})
        const url = new URL(`https://weather-backend-production.up.railway.app/weather/${city}`)
        const itemId = localStorage.getItem("session_id") || ""
        
        
        for(let p of params){
            url.searchParams.append(p.key,p.value)
        }
        const resp= await handleFetch(url,{headers:{session_id:itemId=="null"? "":itemId}});
        const data = await resp.json()
        
        const newItemId= resp.headers.get("session_id")
        
        localStorage.setItem("session_id",newItemId)
        set(data)
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