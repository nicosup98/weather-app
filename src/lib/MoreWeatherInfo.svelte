<script lang="ts">
import type { Day } from "../models/Weather"
import dayjs from "dayjs"
import Celcius from "./Celcius.svelte"
export let day: Day
export let date_epoch: number

$: {
    console.log({day,date_epoch})
}

</script>


<div class="bg-white rounded-md w-full p-1">
    <div class="grid grid-cols-2">
        <img src={day.condition.icon} alt="">
        <div class="flex justify-end">
            {dayjs.unix(date_epoch).format("ddd, MMM D h:mm A")}
        </div>
    </div>
    <div class="flex justify-between">
        <div>{day.condition.text}</div>
        <div class="flex justify-end">
            <div>{day.avgtemp_c} avg </div>
            <div class="pb-1 pr-1">
                <Celcius />
            </div>
        </div>
    </div>
</div>