<script>
  import Card, { Content } from "@smui/card";
  import Textfield from "@smui/textfield";

  let stakeDollars = 0;
  let aprPercent = 0;
  let feePercent = 0;

  $: feeDollars = (stakeDollars * feePercent) / 100 || 0;
  $: stakeMinusFee = stakeDollars - feeDollars || 0;
  $: incomePerYear = (stakeMinusFee * aprPercent) / 100 || 0;
  $: incomePerDay = incomePerYear / 365;
  $: stakePayback = stakeDollars / incomePerDay || 0;
  $: feePayback = feeDollars / incomePerDay || 0;
</script>

<main>
  <div class="card-container">
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
      </Content>
    </Card>
  </div>
</main>

<style>
  main {
    display: flex;
    width: 100vw;
    height: 100vh;
    align-items: center;
    justify-content: center;
    background: linear-gradient(90deg, rgb(6 100 82) 0%, rgb(40 235 200) 150%);
  }

  dl {
    display: grid;
    padding-top: 16px;
    gap: 16px;
    grid: auto-flow / 1fr 1fr;
  }

  dt,
  dd {
    margin-inline-start: 16px;
  }

  .card-container {
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
