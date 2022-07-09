<script lang="ts">
  import "./app.css";
  import {
    Container,
    Center,
    Group,
    TextInput,
    Button,
    Loader
  } from "@svelteuidev/core";
  import { weather, loadingWeather } from "./services/weather";
  import { onMount } from "svelte";
  import CurrentWeather from "./lib/CurrentWaether.svelte";
  import { handleFetch } from "./utils/fetch";
  import Autocomplete from "simple-svelte-autocomplete";
  import { fade, fly } from "svelte/transition"

  let city: any;
  let bgClass: string
  let navBgClass: string

  function handleGetWeather() {
    weather.getWeather(city.url);
  }

  $: {
    console.log($weather);
  }

  $: isDay = Boolean($weather?.current.is_day)

  $: if($weather != null){
    switch($weather.current.condition.text){
      case "Partly cloudy":
        bgClass= `bg-gradient-to-t ${isDay? "from-sky-600 to-slate-200" : "from-slate-900 to-zinc-400"}`
        navBgClass = isDay? "bg-slate-200" : "bg-zinc-400"
        break
      case "Sunny":
        bgClass= "bg-sky-400"
        navBgClass = "bg-sky-400"
        break

      case "Cloudy" ,"Overcast":
        bgClass= "bg-zinc-400"
        navBgClass= "bg-zinc-400"
        break

      case "Clear":
        bgClass= `${isDay? "bg-sky-500":"bg-slate-900"}`
        navBgClass= `${isDay? "bg-sky-500":"bg-slate-900"}`
        break

      default:
        bgClass= "bg-neutral-500"
        navBgClass= "bg-neutral-500"

    }
  }



  onMount(() => {
    weather.getWeather("auto:ip");
  });

  async function autoComplete(keyword: string) {
    const resp = await handleFetch(
      new URL(
        `https://weather-backend-production.up.railway.app/autocomplete/${keyword}`
      )
    );
    return await resp.json();
  }
</script>

<main>
  <nav class={navBgClass + " w-full"}>
    <div class="flex justify-center pt-1">
      <Autocomplete
          searchFunction={autoComplete}
          delay={200}
          localFiltering={false}
          labelFunction={item=>`${item.name}, ${item.region}, ${item.country}`}
          bind:selectedItem={city}
        />
        <Button
          class="bg-teal-400 text-white rounded w-25 h-8 px-2 py-2 ml-2"
          on:click={handleGetWeather}
          ripple>search</Button 
        >
    </div>
  </nav>
  <div class={bgClass + " h-screen"}>
    {#if !$loadingWeather && $weather != null}
    <div class="flex justify-center items-center h-full" in:fly="{{ y: 300, duration: 1500 }}" out:fade>
      <CurrentWeather weather={$weather} />
    </div>
    {:else if $loadingWeather }
    <div class="flex flex-col justify-center items-center h-full" >
      <Loader variant="dots" color="green" />
    </div>
    {/if}
  </div>
</main>

