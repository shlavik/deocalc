<script>
  import { Icon } from "@smui/icon-button";
  import LinearProgress from "@smui/linear-progress";
  import { formatISO, parseISO, subMonths } from "date-fns";

  import DateInput from "./components/DateInput.svelte";
  import ValueInput from "./components/ValueInput.svelte";
  import TokenSelect from "./components/TokenSelect.svelte";

  import tokens from "./tokens.json";
  import { debounce, fetchPrice, renderValue } from "./utils.js";

  let tokenA = tokens[0];
  let tokenB = tokens[5];
  let dateFuture = parseISO(new Date().toISOString().slice(0, 10));
  let dateInitial = subMonths(dateFuture, 3);
  let isLoadingAInitial;
  let isLoadingAFuture;
  let isLoadingBInitial;
  let isLoadingBFuture;
  let priceAInitial;
  let priceAFuture;
  let priceBInitial;
  let priceBFuture;

  const fetchAInitialPriceDebounced = debounce((coinId, dateIso) => {
    if (!coinId || !dateIso) return;
    isLoadingAInitial = true;
    fetchPrice(coinId, dateIso)
      .then((price) => (priceAInitial = price))
      .finally(() => (isLoadingAInitial = false));
  }, 800);

  const fetchAFuturePriceDebounced = debounce((coinId, dateIso) => {
    isLoadingAFuture = true;
    fetchPrice(coinId, dateIso)
      .then((price) => (priceAFuture = price))
      .finally(() => (isLoadingAFuture = false));
  }, 800);

  const fetchBInitialPriceDebounced = debounce((coinId, dateIso) => {
    isLoadingBInitial = true;
    fetchPrice(coinId, dateIso)
      .then((price) => (priceBInitial = price))
      .finally(() => (isLoadingBInitial = false));
  }, 800);

  const fetchBFuturePriceDebounced = debounce((coinId, dateIso) => {
    isLoadingBFuture = true;
    fetchPrice(coinId, dateIso)
      .then((price) => (priceBFuture = price))
      .finally(() => (isLoadingBFuture = false));
  }, 800);

  $: x1 = 1 / priceAInitial;
  $: y1 = 1 / priceBInitial;
  $: k = x1 * y1;
  $: r = priceAFuture / priceBFuture;
  $: x2 = Math.sqrt(k / r);
  $: y2 = Math.sqrt(k * r);
  $: hodl = x1 * priceAFuture + y1 * priceBFuture;
  $: pool = x2 * priceAFuture + y2 * priceBFuture;
  $: loss = pool / hodl - 1;
  $: result = renderValue(-100 * loss, "%");
  $: dateInitialString = dateInitial
    ? formatISO(dateInitial, { representation: "date" })
    : "";
  $: dateFutureString = dateFuture
    ? formatISO(dateFuture, { representation: "date" })
    : "";
  $: fetchAInitialPriceDebounced(tokenA && tokenA.id, dateInitialString);
  $: fetchAFuturePriceDebounced(tokenA && tokenA.id, dateFutureString);
  $: fetchBInitialPriceDebounced(tokenB && tokenB.id, dateInitialString);
  $: fetchBFuturePriceDebounced(tokenB && tokenB.id, dateFutureString);
  $: isLoading =
    isLoadingAInitial ||
    isLoadingAFuture ||
    isLoadingBInitial ||
    isLoadingBFuture;
</script>

<div id="impermanent-loss">
  <dl class="tokens">
    <dt />
    <dd>
      <TokenSelect label="Token A" {tokens} bind:value={tokenA} />
    </dd>
    <dt />

    <dt />
    <dd>
      <TokenSelect label="Token B" {tokens} bind:value={tokenB} />
    </dd>
    <dt />
  </dl>

  <dl>
    <dd>
      <DateInput label="Initial date" bind:date={dateInitial} />
    </dd>
    <dt />
    <dd>
      <DateInput label="Future date" right bind:date={dateFuture} />
    </dd>

    <dd>
      <ValueInput
        label={((tokenA && tokenA.symbol) || "Token A") +
          " @ " +
          dateInitialString}
        prefix="$"
        bind:value={priceAInitial}
      />
    </dd>
    <dt>
      <Icon class="material-icons">keyboard_double_arrow_right</Icon>
    </dt>
    <dd>
      <ValueInput
        label={((tokenA && tokenA.symbol) || "Token A") +
          " @ " +
          dateFutureString}
        prefix="$"
        bind:value={priceAFuture}
      />
    </dd>

    <dd>
      <ValueInput
        label={((tokenB && tokenB.symbol) || "Token B") +
          " @ " +
          dateInitialString}
        prefix="$"
        bind:value={priceBInitial}
      />
    </dd>
    <dt>
      <Icon class="material-icons">keyboard_double_arrow_right</Icon>
    </dt>
    <dd>
      <ValueInput
        label={((tokenB && tokenB.symbol) || "Token B") +
          " @ " +
          dateFutureString}
        prefix="$"
        bind:value={priceBFuture}
      />
    </dd>
  </dl>

  <p style:text-align="center">
    <span class="mdc-typography--headline6">
      Impermanent loss: {@html result}
    </span>

    <span
      class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
    >
      prices provided by CoinGecko
    </span>
  </p>

  <LinearProgress indeterminate closed={!isLoading} />
</div>

<style>
  #impermanent-loss {
  }

  :global(#impermanent-loss dt .material-icons) {
    position: absolute;
    top: 16px;
    left: -12px;
  }

  :global(#impermanent-loss .smui-autocomplete__menu) {
    margin-top: -2px;
    border: 2px solid var(--color-orange);
  }

  :global(#impermanent-loss li.mdc-deprecated-list-item) {
    height: 32px;
  }

  :global(#impermanent-loss .mdc-linear-progress) {
    position: absolute;
    bottom: 0;
    margin-left: -16px;
    border-radius: var(--mdc-shape-medium, 4px);
  }

  dl {
    display: grid;
    gap: 16px;
    grid: auto-flow / 1fr 0 1fr;
  }

  dl.tokens {
    grid: auto-flow / 0.5fr 1fr 0.5fr;
  }

  dt {
    position: relative;
  }

  dd {
    position: relative;
    margin-inline-start: 0;
  }
</style>
