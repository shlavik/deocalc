<script>
  import Button, { Label } from "@smui/button";
  import Card, { Content } from "@smui/card";
  import Textfield from "@smui/textfield";

  let stakeDollars;
  let aprPercent;
  let feePercent;

  $: feeDollars = (stakeDollars * feePercent) / 100 || 0;
  $: stakeMinusFee = stakeDollars - feeDollars || 0;
  $: incomePerYear = (stakeMinusFee * aprPercent) / 100 || 0;
  $: incomePerDay = incomePerYear / 365;
  $: stakePayback = stakeDollars / incomePerDay || 0;
  $: feePayback = feeDollars / incomePerDay || 0;
</script>

<main>
  <Card>
    <Content>
      <p class="mdc-typography--headline5" style:text-align="center">
        Demeter Farming calculator
      </p>

      <p class="description mdc-typography--caption">
        Allows roughly estimate how much you can earn from farming, providing
        that Stake (LP) currencies prices in USD equivalent, DEO price and APR
        remain stable all time
      </p>

      <p class="row">
        <Textfield
          class="shaped-outlined"
          input$emptyValueUndefined
          input$min={0}
          label="Stake (LP)"
          prefix="$"
          style="flex: 1"
          type="number"
          variant="outlined"
          bind:value={stakeDollars}
        />
      </p>

      <p class="row">
        <Textfield
          class="shaped-outlined"
          input$emptyValueUndefined
          input$max={999}
          input$min={0}
          label="APR"
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
        <dd>${incomePerYear.toFixed(2)}</dd>

        <dt>Income per day:</dt>
        <dd>${incomePerDay.toFixed(2)}</dd>

        <dt>Stake payback period:</dt>
        <dd>{stakePayback.toFixed(1)} days</dd>

        <dt>Fee payback period:</dt>
        <dd>{feePayback.toFixed(1)} days</dd>
      </dl>

      <p style:padding="0 8px">
        <Button href="https://farming.deotoken.io" target="_blank">
          <Label>farming.deotoken.io</Label>
        </Button>
        <Button href="https://polkaswap.io/" target="_blank">
          <Label>polkaswap.io</Label>
        </Button>
      </p>
    </Content>
  </Card>
</main>

<style>
  dl {
    display: grid;
    padding: 16px 0;
    gap: 16px;
    grid: auto-flow / 1fr 1fr;
  }

  dt,
  dd {
    margin-inline-start: 16px;
  }

  main {
    position: absolute;
    max-width: 420px;
  }

  .description {
    padding: 0 16px 24px;
    text-align: justify;
  }

  .row {
    display: flex;
    gap: 16px;
  }
</style>
