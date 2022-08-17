<script>
  import Autocomplete from "@smui-extra/autocomplete";
  import IconButton, { Icon } from "@smui/icon-button";
  import Textfield from "@smui/textfield";
  import { formatISO, parseISO } from "date-fns";
  import DateInput from "./DateInput.svelte";

  import tokens from "./tokens.json";
  import { debounce, fetchPrice, renderValue } from "./utils.js";

  let elAutocompleteA;
  let elAutocompleteB;
  let tokenA = tokens[0];
  let tokenB = tokens[5];
  let a1;
  let a2;
  let b1;
  let b2;
  let dateInitial = parseISO("2022-06-01");
  let dateFuture = new Date();

  async function search(input) {
    if (input === "") return tokens;
    return tokens.filter(({ symbol }) =>
      symbol.toLowerCase().startsWith(input.toLowerCase())
    );
  }

  function getOptionLabel(option) {
    return option?.symbol || "";
  }

  const fetchA1PriceDebounced = debounce(
    (...args) => fetchPrice(...args).then((res) => (a1 = res)),
    800
  );

  const fetchA2PriceDebounced = debounce(
    (...args) => fetchPrice(...args).then((res) => (a2 = res)),
    800
  );

  const fetchB1PriceDebounced = debounce(
    (...args) => fetchPrice(...args).then((res) => (b1 = res)),
    800
  );

  const fetchB2PriceDebounced = debounce(
    (...args) => fetchPrice(...args).then((res) => (b2 = res)),
    800
  );

  $: x1 = 1 / a1;
  $: y1 = 1 / b1;
  $: k = x1 * y1;
  $: r = a2 / b2;
  $: x2 = Math.sqrt(k / r);
  $: y2 = Math.sqrt(k * r);
  $: hodl = x1 * a2 + y1 * b2;
  $: pool = x2 * a2 + y2 * b2;
  $: loss = pool / hodl - 1;
  $: result = renderValue(-100 * loss, "%");
  $: dateInitialString = dateInitial ? formatISO(dateInitial).slice(0, 10) : "";
  $: dateFutureString = dateFuture ? formatISO(dateFuture).slice(0, 10) : "";
  $: fetchA1PriceDebounced(tokenA?.id, dateInitialString);
  $: fetchA2PriceDebounced(tokenA?.id, dateFutureString);
  $: fetchB1PriceDebounced(tokenB?.id, dateInitialString);
  $: fetchB2PriceDebounced(tokenB?.id, dateFutureString);
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
      <DateInput label="Initial date" name="FromDate" bind:date={dateInitial} />
    </dd>
    <dt />
    <dd>
      <DateInput
        label="Future date"
        name="ToDate"
        right
        bind:date={dateFuture}
      />
    </dd>

    <dd>
      <Textfield
        class="shaped-outlined"
        input$emptyValueUndefined
        label={(tokenA?.symbol || "Token A") +
          " price at " +
          (dateInitialString || "initial price")}
        prefix="$"
        variant="outlined"
        bind:value={a1}
      />
    </dd>
    <dt>
      <Icon class="material-icons">keyboard_double_arrow_right</Icon>
    </dt>
    <dd>
      <Textfield
        class="shaped-outlined"
        input$emptyValueUndefined
        label={(tokenA?.symbol || "Token A") +
          " price at " +
          (dateFutureString || "future price")}
        prefix="$"
        variant="outlined"
        bind:value={a2}
      />
    </dd>

    <dd>
      <Textfield
        class="shaped-outlined"
        input$emptyValueUndefined
        label={(tokenB?.symbol || "Token B") +
          " price at " +
          (dateInitialString || "initial price")}
        prefix="$"
        variant="outlined"
        bind:value={b1}
      />
    </dd>
    <dt>
      <Icon class="material-icons">keyboard_double_arrow_right</Icon>
    </dt>
    <dd>
      <Textfield
        class="shaped-outlined"
        input$emptyValueUndefined
        label={(tokenB?.symbol || "Token B") +
          " price at " +
          (dateFutureString || "future price")}
        prefix="$"
        variant="outlined"
        bind:value={b2}
      />
    </dd>
  </dl>

  <p style:text-align="center">
    <span>Impermanent loss:</span>
    {@html result}
    <span
      class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
    >
      (prices provided by CoinGecko)
    </span>
  </p>
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
