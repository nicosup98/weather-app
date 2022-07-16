import type { Coordinates } from "src/models/Coordinates"
import { writable } from "svelte/store"

function createStore(){
    const { subscribe,set } = writable<Coordinates>(null)
    async function getLocation(){
        try{
            const position = await getCoordinates()
            set({lat:position.coords.latitude, long: position.coords.longitude})
        } catch(err){
            console.error({err})
        }
    }

    return {
        subscribe,
        getLocation
    }
}

function getCoordinates(): Promise<GeolocationPosition>{
    return new Promise((resolve,reject)=>{
        navigator.geolocation.getCurrentPosition(resolve,reject)
    })
}

export const location = createStore()