<script>
  import ValueInput from "./components/ValueInput.svelte";

  import { renderValue } from "./utils.js";

  let stakeUsd = 9000;
  let aprPercent = 146;
  let feePercent = 2;

  $: feeUsd = (stakeUsd * feePercent) / 100 || 0;
  $: stakeMinusFee = stakeUsd - feeUsd;
  $: incomePerYear = (stakeMinusFee * aprPercent) / 100;
  $: incomePerDay = incomePerYear / 365;
  $: stakePayback = stakeUsd / incomePerDay;
  $: feePayback = feeUsd / incomePerDay;
</script>

<div id="profit-prediction">
  <p>
    <ValueInput
      input$min={0}
      label="Stake¹"
      prefix="$"
      style="width: 100%"
      bind:value={stakeUsd}
    />
  </p>

  <p class="row">
    <ValueInput
      input$max={999}
      input$min={0}
      input$step={0.1}
      label="APR¹"
      prefix="%"
      style="flex: 1"
      bind:value={aprPercent}
    />

    <ValueInput
      input$max={99}
      input$min={0}
      input$step={0.1}
      label="Fee²"
      prefix="%"
      style="flex: 1"
      bind:value={feePercent}
    />
  </p>

  <dl>
    <dt>Income per year:</dt>
    <dd>{@html renderValue(incomePerYear, "$")}</dd>

    <dt>Income per day:</dt>
    <dd>{@html renderValue(incomePerDay, "$")}</dd>

    <dt>Stake payback period:</dt>
    <dd>{@html renderValue(stakePayback, "days")}</dd>

    <dt>Fee payback period:</dt>
    <dd>{@html renderValue(feePayback, "days")}</dd>
  </dl>

  <p class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
    ¹ Assumed that will remain stable all time
  </p>

  <p class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
    ² Demeter farming on stake fee
  </p>
</div>

<style>
  #profit-prediction {
  }

  dl {
    display: grid;
    gap: 16px;
    grid: auto-flow / auto auto;
  }

  dt {
    margin-inline-end: 0;
    margin-inline-start: 16px;
  }

  dd {
    overflow: hidden;
    align-self: end;
    margin-inline-end: 16px;
    margin-inline-start: 0;
    text-align: right;
  }

  .row {
    display: flex;
    gap: 16px;
  }

  .mdc-text-field-helper-text {
    text-align: center;
  }

  .mdc-text-field-helper-text ~ .mdc-text-field-helper-text {
    margin-bottom: 16px;
  }
</style>
