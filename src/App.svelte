<script>
  import Button, { Label } from "@smui/button";
  import Card, { Content } from "@smui/card";
  import Tab from "@smui/tab";
  import TabBar from "@smui/tab-bar";

  import { url } from "./utils";

  import ProfitPrediction from "./ProfitPrediction.svelte";
  import ImpermanentLoss from "./ImpermanentLoss.svelte";

  const keys = {
    PROFIT_PREDICTION: "PROFIT_PREDICTION",
    IMPERMANENT_LOSS: "IMPERMANENT_LOSS",
  };

  const tabs = [keys.PROFIT_PREDICTION, keys.IMPERMANENT_LOSS];

  const labels = {
    [keys.PROFIT_PREDICTION]: "Profit Prediction",
    [keys.IMPERMANENT_LOSS]: "Impermanent Loss",
  };

  const titles = {
    [keys.PROFIT_PREDICTION]: "Roughly estimate how much you can earn",
    [keys.IMPERMANENT_LOSS]:
      "Estimate loss in liquidity pool comparing it to holding value",
  };

  const urls = {
    [keys.PROFIT_PREDICTION]: "profit-prediction",
    [keys.IMPERMANENT_LOSS]: "impermanent-loss",
    "profit-prediction": keys.PROFIT_PREDICTION,
    "impermanent-loss": keys.IMPERMANENT_LOSS,
  };

  let active = keys.PROFIT_PREDICTION;

  $: hash = $url.hash.slice(2);
  $: if (urls[hash]) active = urls[hash];
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
        <Tab {tab} title={titles[tab]} href={"#/" + urls[tab]}>
          <Label>{labels[tab]}</Label>
        </Tab>
      </TabBar>

      {#if active === keys.PROFIT_PREDICTION}
        <ProfitPrediction />
      {/if}

      {#if active === keys.IMPERMANENT_LOSS}
        <ImpermanentLoss />
      {/if}
    </Content>
  </Card>
</main>

<style>
  @media (max-width: 420px) {
    main {
      width: 100%;
    }
  }
</style>
