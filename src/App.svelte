<script lang="ts">
  import "./app.css";
  import {
    Button,
    Loader
  } from "@svelteuidev/core";
  import { weather, loadingWeather } from "./services/weather";
  import { history } from "./services/history"
  import { session } from "./services/session";
  import { location } from "./services/location"
  import { onMount } from "svelte";
  import CurrentWeather from "./lib/CurrentWaether.svelte";
  import { handleFetch } from "./utils/fetch";
  import Autocomplete from "simple-svelte-autocomplete";
  import { fade, fly } from "svelte/transition"
  import { BASE_URL } from "./utils/constants";
  import MoreWeatherInfo from "./lib/MoreWeatherInfo.svelte"
  import ScrollToTop from "./lib/ScrollTotop.svelte"
  import Hamburger from "./lib/Hamburger.svelte";
  import SideBar from "./lib/SideBar.svelte";
  
  let city: any;
  let bgClass: string
  let navBgClass: string
  let scrollY: number
  let bottomBgclass: string
  let openSidebar: boolean = false

  async function handleGetWeather() {
    await weather.getWeather(city.url,$session,{key:"daysForecast",value:"3"});
    history.addToHistory($weather)
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
        bottomBgclass = isDay? "bg-sky-600":"bg-slate-900"
        break
      case "Sunny":
        const color = isDay? "bg-sky-400":"bg-slate-900"
        bgClass= color
        navBgClass = color
        bottomBgclass = color
        break

      case "Cloudy" ,"Overcast":
        bgClass= "bg-zinc-400"
        navBgClass= "bg-zinc-400"
        bottomBgclass= "bg-zinc-400"
        break

      case "Clear":
        bgClass= `${isDay? "bg-sky-500":"bg-slate-900"}`
        navBgClass= `${isDay? "bg-sky-500":"bg-slate-900"}`
        bottomBgclass= `${isDay? "bg-sky-500":"bg-slate-900"}`
        break

      case "Patchy rain possible":
        bgClass = `bg-gradient-to-t from-sky-600 via-slate-400 to-yellow-200`
        navBgClass = `bg-yellow-200`
        bottomBgclass = "bg-sky-600"
        break

      default:
        bgClass= "bg-neutral-500"
        navBgClass= "bg-neutral-500"
        bottomBgclass= "bg-neutral-500"

    }
  }

  
  async function autoComplete(keyword: string) {
    const resp = await handleFetch(
      new URL(
        `${BASE_URL}/autocomplete/${keyword}`
      )
    );
    return await resp.json();
  }

  onMount(async () => {
    await location.getLocation()
    await session.getToken(),
    await weather.getWeather(`${$location?.lat},${$location?.long}`,$session,{key:"daysForecast",value:"3"})
    await history.getHistory($session)
  });

</script>

<main>
  <div class={openSidebar? "opacity-80":""}>
    <nav class={navBgClass + " w-full"}>
      <div class="flex justify-between pt-1 pl-1">
        <button class="bg-white rounded p-2" on:click={()=>{
          openSidebar = !openSidebar
        }}>
          <Hamburger />
        </button>
        <div class="flex justify-center pr-1">
          <Autocomplete
          searchFunction={autoComplete}
          delay={200}
          localFiltering={false}
          labelFunction={item=>`${item.name}, ${item.region}, ${item.country}`}
          bind:selectedItem={city}
          class="w-1/2"
        />
        <Button
          class="bg-teal-500 text-white rounded w-25 h-8 px-2 py-2 ml-2 cursor-pointer"
          on:click={handleGetWeather}
          ripple>search</Button>
        </div>
      </div>
    </nav>
    <div class={bgClass + " h-screen"}>
      {#if !$loadingWeather && $weather != null}
        <div class="flex justify-center items-center h-full" in:fly="{{ y: 300, duration: 1500 }}" out:fade>
          <CurrentWeather {...$weather} />
        </div>
          {#if scrollY > 5}
            <div class={bottomBgclass}  transition:fade>
              <div class="grid sm:grid-cols-3 grid-cols-1 justify-items-center gap-2 px-2 pb-2">
                {#each $weather.forecast.forecastday as forecastDay}
                  <MoreWeatherInfo {...forecastDay} />
                {/each}
              </div>
            </div>
          {/if}
      {:else if $loadingWeather }
      <div class="flex flex-col justify-center items-center h-full" >
        <Loader variant="dots" color="green" />
      </div>
      {/if}
      
    </div>
  </div>

  
</main>
<ScrollToTop {scrollY}  />
<SideBar open={openSidebar} weatherHistory={$history} on:closeSideBar={(e)=> openSidebar = e.detail.open}/>

<svelte:window bind:scrollY={scrollY}/>

