<script lang="ts">
import { Text, Image,Center } from "@svelteuidev/core"

export let weather: any

$: current = weather.current;
$: location = weather.location
</script>


<div class="w-1/4 center">
    <div class="rounded p-2">
        <Text size="lg" class="text-center text-white">{current.condition.text}</Text>
        <img class='w-full' src={current.condition.icon} alt=""/>
        <Text class="text-center text-white">{current.temp_c} c</Text>
    
    </div>
    <div class="text-center text-white text-xl mt-3">{location.name} - {location.country}</div>
</div>

