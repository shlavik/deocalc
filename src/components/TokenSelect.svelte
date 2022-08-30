<script>
  import Autocomplete from "@smui-extra/autocomplete";
  import IconButton, { Icon } from "@smui/icon-button";

  export let style = undefined;
  export let label = undefined;
  export let value = undefined;
  export let tokens = [];

  let element;

  async function search(input) {
    if (input === "") return tokens;
    return tokens.filter(({ symbol }) =>
      symbol.toLowerCase().includes(input.toLowerCase())
    );
  }

  function getOptionLabel(option) {
    return (option && option.symbol) || "";
  }
</script>

<wrapper class="token-select" {style} style:position="relative">
  <Autocomplete
    {search}
    {getOptionLabel}
    textfield$invalid={!value}
    textfield$label={label}
    textfield$spellcheck="false"
    textfield$variant="outlined"
    bind:value
    bind:this={element}
  />

  {#if value !== undefined}
    <IconButton
      class="clear"
      size="button"
      title="Clear value"
      on:click={() => ((value = undefined), element.focus())}
    >
      <Icon class="material-icons">clear</Icon>
    </IconButton>
  {/if}
</wrapper>

<style>
  :global(.token-select .smui-autocomplete ~ .clear) {
    position: absolute;
    top: 0;
    right: 8px;
    bottom: 0;
    margin: auto;
  }
</style>
