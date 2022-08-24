<script>
  import {
    addHours,
    compareAsc,
    formatISO,
    parseISO,
    startOfDay,
  } from "date-fns";

  import Textfield from "@smui/textfield";
  import Datepicker from "praecox-datepicker";

  import { clickOutside } from "./actions";

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
  $: if (pickerDone) {
    showDatepicker = false;
  }
  $: invalid =
    compareAsc(
      parseISO(internal),
      addHours(parseISO(new Date().toISOString().slice(0, 10)), 1)
    ) === 1;
</script>

<div
  class="date-input"
  class:right
  style:flex={1}
  use:clickOutside={() => (showDatepicker = false)}
>
  <Textfield
    class="shaped-outlined"
    input$emptyValueUndefined
    {disabled}
    {invalid}
    {label}
    {name}
    type="date"
    variant="outlined"
    on:click={(event) => (event.preventDefault(), (showDatepicker = true))}
    bind:value={internal}
    bind:this={textfieldEl}
  />

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
</div>

<style>
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
