<script>
  import IconButton, { Icon } from "@smui/icon-button";
  import {
    compareAsc,
    formatISO,
    isSameDay,
    parseISO,
    startOfDay,
  } from "date-fns";

  import Textfield from "@smui/textfield";
  import Datepicker from "praecox-datepicker";

  export let style = undefined;
  export let disabled = false;
  export let label = "";
  export let name = "";

  export let right = false;
  export let date = new Date();

  let textfieldEl;
  let internal;

  let selected = startOfDay(date).valueOf();
  let showDatepicker = true;
  let pickerDone = true;

  function clickOutside(node, cb) {
    function click(event) {
      if (event.composedPath().some((el) => el === node)) return;
      cb(event);
    }
    document.body.addEventListener("click", click);
    return {
      update(newCb) {
        cb = newCb;
      },
      destroy() {
        document.body.removeEventListener("click", click);
      },
    };
  }

  function input(date) {
    internal = formatISO(date, { representation: "date" });
  }

  function output(iso) {
    if (!iso) return input(date);
    date = parseISO(iso);
    selected = startOfDay(date).valueOf();
  }

  function onSelected(selected) {
    if (!selected) return;
    date = new Date(selected);
    showDatepicker = false;
  }

  $: input(date);
  $: output(internal);
  $: onSelected(selected);
  $: if (pickerDone) showDatepicker = false;
  $: today = ((_) => parseISO(new Date().toISOString().slice(0, 10)))(internal);
  $: invalid = compareAsc(parseISO(internal), today) === 1;
</script>

<wrapper
  class="date-input"
  class:right
  {style}
  style:position="relative"
  use:clickOutside={() => (showDatepicker = false)}
>
  <Textfield
    {disabled}
    input$emptyValueUndefined
    {invalid}
    {label}
    {name}
    type="date"
    variant="outlined"
    on:click={(event) => (event.preventDefault(), (showDatepicker = true))}
    bind:value={internal}
    bind:this={textfieldEl}
  />

  {#if !isSameDay(date, today)}
    <IconButton
      class="clear"
      size="button"
      title="Reset to today"
      on:click={() => ((selected = today.valueOf()), textfieldEl.focus())}
    >
      <Icon class="material-icons">restore</Icon>
    </IconButton>
  {/if}

  {#if showDatepicker}
    <div class="drop" on:click={() => textfieldEl.focus()}>
      <Datepicker
        {disabled}
        viewDate={internal}
        bind:selected
        bind:pickerDone
      />
    </div>
  {/if}
</wrapper>

<style>
  :global(.date-input .mdc-text-field ~ .clear) {
    position: absolute;
    top: 0;
    right: 8px;
    bottom: 0;
    margin: auto;
  }

  .drop {
    --praecox-calendar-custom-height: 290px;
    --praecox-calendar-custom-border-radius: 4px;
    --praecox-calendar-custom-main-color: var(--color-orange);
    --praecox-calendar-custom-main-color-hover: var(--color-orange);
    --praecox-calendar-custom-main-color-active: var(--color-orange);
    --praecox-calendar-custom-secondary-color: #fc6c0932;
    --praecox-calendar-custom-selected-color: var(--color-orange);
    --praecox-calendar-custom-adjunctive-color: #fc6c0932;
    --praecox-calendar-custom-background-hover: #fc6c0932;
    --praecox-calendar-custom-border: 2px solid var(--color-orange);

    position: absolute;
    z-index: 1;
    margin-top: -2px;

    box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%),
      0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
  }

  .right .drop {
    right: -1px;
  }
</style>
