<script>
  import Button, { Label } from "@smui/button";
  import Card, { Content } from "@smui/card";
  import Tab from "@smui/tab";
  import TabBar from "@smui/tab-bar";

  import ProfitForecast from "./ProfitForecast.svelte";
  import ImpermanentLoss from "./ImpermanentLoss.svelte";

  const keys = {
    PROFIT_FORECAST: "Profit Forecast",
    IMPERMANENT_LOSS: "Impermanent Loss",
  };
  const tabs = [keys.PROFIT_FORECAST, keys.IMPERMANENT_LOSS];
  const titles = {
    [keys.PROFIT_FORECAST]: "Roughly estimate how much you can earn",
    [keys.IMPERMANENT_LOSS]:
      "Estimate loss in liquidity pool comparing it to holding value",
  };

  let active = keys.PROFIT_FORECAST;
</script>

<main>
  <Card>
    <Content>
      <p class="mdc-typography--button" style:text-align="center">
        <Button
          href="https://farming.deotoken.io"
          target="_blank"
          color="secondary"
        >
          <Label>Demeter&nbsp;Farming</Label>
        </Button>
        <span>&</span>
        <Button href="https://polkaswap.io/#/swap" target="_blank">
          <Label>Polkaswap</Label>
        </Button>
        <span>calculator</span>
      </p>

      <TabBar {tabs} let:tab bind:active>
        <Tab {tab} title={titles[tab]}>
          <Label>{tab}</Label>
        </Tab>
      </TabBar>

      {#if active === keys.PROFIT_FORECAST}
        <ProfitForecast />
      {/if}

      {#if active === keys.IMPERMANENT_LOSS}
        <ImpermanentLoss />
      {/if}
    </Content>
  </Card>
</main>

<style>
  main {
    overflow: hidden;
    width: 420px;
    max-height: 100%;
  }

  @media (max-width: 420px) {
    main {
      width: 100%;
    }
  }
</style>
