<script lang="ts">
    import { Affix } from "@svelteuidev/core";
    import { fade } from "svelte/transition"
    import { createEventDispatcher } from 'svelte';
    import type { History as WeatherHistory } from "../models/History"
    import { weather } from "../services/weather"
    import { Divider } from '@svelteuidev/core';

    export let open: boolean
    export let history: WeatherHistory[]

    const eventDispatcher = createEventDispatcher()
    function close(){
        eventDispatcher("closeSideBar",{
            open: !open
        })
    }

    function selectWeather(weatherSelected: WeatherHistory){
        weather.set(weatherSelected.data)
    }

</script>

<div>
    <Affix position={{top:0,left:0}}>
        {#if open}
        <div class="w-screen h-screen">
            <div class="sm:w-1/4 w-1/2 h-full bg-white rounded" transition:fade={{duration:250}}>
                <div class="flex justify-end">
                    <button class="bg-red-500 p-1 px-2  text-white" on:click={close}>X</button>
                </div>
                <div class="flex justify-center">
                    Search History
                </div>
                <Divider />
                <div class="grid grid-cols-1  gap-2 px-2">
                    {#each history as h}
                        <div class="bg-slate-200 rounded p-1 text-center cursor-pointer" on:click={()=>selectWeather(h)}>
                            {h.data.location.name}, {h.data.location.region}, {h.data.location.country} 
                        </div>
                    {/each}
                </div>
                <Divider />
                <div class="flex justify-center items-end">
                    <a href="https://portfolio-psi-weld-21.vercel.app/"target="_blank">My portfolio</a>
                </div>
            </div>
        </div>
        {/if}
    </Affix>
    
</div>