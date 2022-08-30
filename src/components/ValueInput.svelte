<script>
  import IconButton, { Icon } from "@smui/icon-button";
  import Textfield from "@smui/textfield";

  export let style = undefined;
  export let label = undefined;
  export let prefix = undefined;
  export let value = undefined;

  let element;

  $: isValid = !Number.isNaN(+value);
  $: isValidOrUndefined = isValid || value === undefined;
  $: props = {
    input$emptyValueUndefined: true,
    invalid: !isValid,
    label,
    prefix: isValidOrUndefined ? prefix : undefined,
    variant: "outlined",
    ...$$restProps,
  };
</script>

<wrapper class="value-input" {style} style:position="relative">
  {#if isValidOrUndefined}
    <Textfield {...props} bind:value bind:this={element} type="number" />
  {:else}
    <Textfield {...props} disabled bind:value />
  {/if}

  {#if value !== undefined}
    <IconButton
      class="clear"
      size="button"
      title="Clear value"
      on:click={() => {
        value = undefined;
        setTimeout(() => element && element.focus());
      }}
    >
      <Icon class="material-icons">clear</Icon>
    </IconButton>
  {/if}
</wrapper>

<style>
  :global(.value-input .mdc-text-field ~ .clear) {
    position: absolute;
    top: 0;
    right: 8px;
    bottom: 0;
    margin: auto;
  }
</style>
