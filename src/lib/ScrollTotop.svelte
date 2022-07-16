<script lang="ts">
    import { Affix, Button } from "@svelteuidev/core";
    import { ThickArrowUp } from "radix-icons-svelte";
    import { fly } from "svelte/transition";

    export let scrollY: number;
</script>

<Affix zIndex={5} position={{ bottom: 20, right: 20 }}>
    {#if scrollY > 5}
        <div transition:fly={{ y: 20, duration: 250 }}>
            <Button on:click={() => window.scrollTo(0, 0)}>
                <svelte:fragment slot="leftIcon">
                    <ThickArrowUp />
                </svelte:fragment>
                Scroll to top
            </Button>
        </div>
    {/if}
</Affix>
