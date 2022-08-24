<script>
  import Autocomplete from "@smui-extra/autocomplete";
  import IconButton, { Icon } from "@smui/icon-button";
  import LinearProgress from "@smui/linear-progress";
  import Textfield from "@smui/textfield";
  import { addHours, formatISO, parseISO, subHours } from "date-fns";
  import DateInput from "./DateInput.svelte";

  import tokens from "./tokens.json";
  import { debounce, fetchPrice, renderValue } from "./utils.js";

  let elAutocompleteA;
  let elAutocompleteB;
  let tokenA = tokens[0];
  let tokenB = tokens[5];
  let dateInitial = parseISO("2022-06-01");
  let dateFuture = addHours(parseISO(new Date().toISOString().slice(0, 10)), 1);
  let aInitialPrice;
  let aInitialLoading;
  let aFuturePrice;
  let aFutureLoading;
  let bInitialPrice;
  let bInitialLoading;
  let bFuturePrice;
  let bFutureLoading;

  async function search(input) {
    if (input === "") return tokens;
    return tokens.filter(({ symbol }) =>
      symbol.toLowerCase().includes(input.toLowerCase())
    );
  }

  function getOptionLabel(option) {
    return option?.symbol || "";
  }

  const fetchAInitialPriceDebounced = debounce((coinId, dateIso) => {
    aInitialLoading = true;
    fetchPrice(coinId, dateIso)
      .then((price) => (aInitialPrice = price))
      .catch(() => (aInitialPrice = undefined))
      .finally(() => (aInitialLoading = false));
  }, 800);

  const fetchAFuturePriceDebounced = debounce((coinId, dateIso) => {
    aFutureLoading = true;
    fetchPrice(coinId, dateIso)
      .then((price) => (aFuturePrice = price))
      .catch(() => (aFuturePrice = undefined))
      .finally(() => (aFutureLoading = false));
  }, 800);

  const fetchBInitialPriceDebounced = debounce((coinId, dateIso) => {
    bInitialLoading = true;
    fetchPrice(coinId, dateIso)
      .then((price) => (bInitialPrice = price))
      .catch(() => (bInitialPrice = undefined))
      .finally(() => (bInitialLoading = false));
  }, 800);

  const fetchBFuturePriceDebounced = debounce((coinId, dateIso) => {
    bFutureLoading = true;
    fetchPrice(coinId, dateIso)
      .then((price) => (bFuturePrice = price))
      .catch(() => (bFuturePrice = undefined))
      .finally(() => (bFutureLoading = false));
  }, 800);

  $: x1 = 1 / aInitialPrice;
  $: y1 = 1 / bInitialPrice;
  $: k = x1 * y1;
  $: r = aFuturePrice / bFuturePrice;
  $: x2 = Math.sqrt(k / r);
  $: y2 = Math.sqrt(k * r);
  $: hodl = x1 * aFuturePrice + y1 * bFuturePrice;
  $: pool = x2 * aFuturePrice + y2 * bFuturePrice;
  $: loss = pool / hodl - 1;
  $: result = renderValue(-100 * loss, "%");
  $: dateInitialString = dateInitial
    ? formatISO(dateInitial, { representation: "date" })
    : "";
  $: dateFutureString = dateFuture
    ? formatISO(dateFuture, { representation: "date" })
    : "";
  $: fetchAInitialPriceDebounced(tokenA?.id, dateInitialString);
  $: fetchAFuturePriceDebounced(tokenA?.id, dateFutureString);
  $: fetchBInitialPriceDebounced(tokenB?.id, dateInitialString);
  $: fetchBFuturePriceDebounced(tokenB?.id, dateFutureString);
  $: isLoading =
    aInitialLoading || aFutureLoading || bInitialLoading || bFutureLoading;
</script>

<div id="impermanent-loss">
  <dl class="tokens">
    <dt />
    <dd>
      <Autocomplete
        {search}
        {getOptionLabel}
        textfield$label="Token A"
        textfield$spellcheck="false"
        textfield$variant="outlined"
        bind:value={tokenA}
        bind:this={elAutocompleteA}
      />
      {#if tokenA !== undefined}
        <IconButton
          class="clear"
          size="button"
          on:click={() => (elAutocompleteA.focus(), (tokenA = undefined))}
        >
          <Icon class="material-icons">clear</Icon>
        </IconButton>
      {/if}
    </dd>
    <dt />

    <dt />
    <dd>
      <Autocomplete
        {search}
        {getOptionLabel}
        textfield$label="Token B"
        textfield$spellcheck="false"
        textfield$variant="outlined"
        bind:value={tokenB}
        bind:this={elAutocompleteB}
      />
      {#if tokenB !== undefined}
        <IconButton
          class="clear"
          size="button"
          on:click={() => (elAutocompleteB.focus(), (tokenB = undefined))}
        >
          <Icon class="material-icons">clear</Icon>
        </IconButton>
      {/if}
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
      <Textfield
        class="shaped-outlined"
        input$emptyValueUndefined
        label={(tokenA?.symbol || "Token A") + " @ " + dateInitialString}
        prefix="$"
        variant="outlined"
        invalid={aInitialPrice === undefined}
        bind:value={aInitialPrice}
      />
    </dd>
    <dt>
      <Icon class="material-icons">keyboard_double_arrow_right</Icon>
    </dt>
    <dd>
      <Textfield
        class="shaped-outlined"
        input$emptyValueUndefined
        label={(tokenA?.symbol || "Token A") + " @ " + dateFutureString}
        prefix="$"
        variant="outlined"
        invalid={aFuturePrice === undefined}
        bind:value={aFuturePrice}
      />
    </dd>

    <dd>
      <Textfield
        class="shaped-outlined"
        input$emptyValueUndefined
        label={(tokenB?.symbol || "Token B") + " @ " + dateInitialString}
        prefix="$"
        variant="outlined"
        invalid={bInitialPrice === undefined}
        bind:value={bInitialPrice}
      />
    </dd>
    <dt>
      <Icon class="material-icons">keyboard_double_arrow_right</Icon>
    </dt>
    <dd>
      <Textfield
        class="shaped-outlined"
        input$emptyValueUndefined
        label={(tokenB?.symbol || "Token B") + " @ " + dateFutureString}
        prefix="$"
        variant="outlined"
        invalid={bFuturePrice === undefined}
        bind:value={bFuturePrice}
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

  :global(#impermanent-loss .mdc-icon-button__icon) {
    font-size: 16px;
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
