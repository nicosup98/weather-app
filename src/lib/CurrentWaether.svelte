<script lang="ts">
import { Text } from "@svelteuidev/core"
import type { Current,Location } from "../models/Weather"


export let current: Current
export let location: Location
</script>


<div class="sm:w-1/4 w-3/5 center">
    <div class="rounded p-2">
        <Text size="lg" class="text-center text-white">{current.condition.text}</Text>
        <img class='w-full' src={current.condition.icon} alt=""/>
        <Text class="text-center text-white">{current.temp_c} c</Text>
    
    </div>
    <div class="text-center text-white text-xl mt-3">{location.name} - {location.country}</div>
</div>

