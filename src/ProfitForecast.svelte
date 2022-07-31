<script>
  import Textfield from "@smui/textfield";

  let stakeUsd;
  let aprPercent;
  let feePercent;

  $: feeUsd = (stakeUsd * feePercent) / 100 || 0;
  $: stakeMinusFee = stakeUsd - feeUsd || 0;
  $: incomePerYear = (stakeMinusFee * aprPercent) / 100 || 0;
  $: incomePerDay = incomePerYear / 365;
  $: stakePayback = stakeUsd / incomePerDay || 0;
  $: feePayback = feeUsd / incomePerDay || 0;
</script>

<div id="profit-forecast">
  <p>
    <Textfield
      class="shaped-outlined"
      input$emptyValueUndefined
      input$min={0}
      label="LP sum or Stake *"
      prefix="$"
      style="width: 100%"
      type="number"
      variant="outlined"
      bind:value={stakeUsd}
    />
  </p>

  <p class="row">
    <Textfield
      class="shaped-outlined"
      input$emptyValueUndefined
      input$max={999}
      input$min={0}
      label="APR *"
      prefix="%"
      style="flex: 1"
      type="number"
      variant="outlined"
      bind:value={aprPercent}
    />

    <Textfield
      class="shaped-outlined"
      input$emptyValueUndefined
      input$max={99}
      input$min={0}
      label="Fee"
      prefix="%"
      style="flex: 1"
      type="number"
      variant="outlined"
      bind:value={feePercent}
    />
  </p>

  <dl>
    <dt>Income per year:</dt>
    <dd>
      <span>$</span>&nbsp;<strong>{incomePerYear.toFixed(2)}</strong>
    </dd>

    <dt>Income per day:</dt>
    <dd>
      <span>$</span>&nbsp;<strong>{incomePerDay.toFixed(2)}</strong>
    </dd>

    <dt>Stake payback period:</dt>
    <dd>
      <strong>{stakePayback.toFixed(1)}</strong>
      <span>days</span>
    </dd>

    <dt>Fee payback period:</dt>
    <dd>
      <strong>{feePayback.toFixed(1)}</strong>
      <span>days</span>
    </dd>
  </dl>

  <p class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
    * Assumed that will remain stable all time
  </p>
</div>

<style>
  #profit-forecast {
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
    margin: 16px 0;
    text-align: center;
  }
</style>
