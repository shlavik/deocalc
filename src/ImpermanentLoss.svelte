<script>
  import { Icon } from "@smui/button";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";

  let a1;
  let b1;
  let a2;
  let b2;

  $: x1 = 1 / a1;
  $: y1 = 1 / b1;
  $: k = x1 * y1;
  $: r = a2 / b2;
  $: x2 = Math.sqrt(k / r);
  $: y2 = Math.sqrt(k * r);
  $: hodl = x1 * a2 + y1 * b2;
  $: pool = x2 * a2 + y2 * b2;
  $: loss = pool / hodl - 1;
  $: result = -100 * loss;
</script>

<div id="impermanent-loss">
  <dl>
    <dd>
      <Textfield
        class="shaped-outlined"
        input$emptyValueUndefined
        input$min={0}
        label="A t₁"
        prefix="$"
        type="number"
        variant="outlined"
        bind:value={a1}
      >
        <HelperText persistent slot="helper">Token A initial price</HelperText>
      </Textfield>
    </dd>
    <dt>
      <Icon class="material-icons">keyboard_double_arrow_right</Icon>
    </dt>
    <dd>
      <Textfield
        class="shaped-outlined"
        input$emptyValueUndefined
        input$min={0}
        label="A t₂"
        prefix="$"
        type="number"
        variant="outlined"
        bind:value={a2}
      >
        <HelperText persistent slot="helper">Token A future price</HelperText>
      </Textfield>
    </dd>

    <dd>
      <Textfield
        class="shaped-outlined"
        input$emptyValueUndefined
        input$min={0}
        label="B t₁"
        prefix="$"
        type="number"
        variant="outlined"
        bind:value={b1}
      >
        <HelperText persistent slot="helper">Token B initial price</HelperText>
      </Textfield>
    </dd>
    <dt>
      <Icon class="material-icons">keyboard_double_arrow_right</Icon>
    </dt>
    <dd>
      <Textfield
        class="shaped-outlined"
        input$emptyValueUndefined
        input$min={0}
        label="B t₂"
        prefix="$"
        type="number"
        variant="outlined"
        bind:value={b2}
      >
        <HelperText persistent slot="helper">Token B future price</HelperText>
      </Textfield>
    </dd>
  </dl>

  <p style:text-align="center">
    <span>Impermanent loss:</span>
    {#if Number.isNaN(result)}
      <strong>N/A</strong>
    {:else}
      <strong>{result.toFixed(2)}</strong>&nbsp;<span>%</span>
      <div
        class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
      >
        (fees are not included)
      </div>
    {/if}
  </p>
</div>

<style>
  #impermanent-loss {
  }

  :global(#impermanent-loss .material-icons) {
    position: absolute;
    top: 16px;
    left: -12px;
  }

  dl {
    display: grid;
    gap: 16px;
    grid: auto-flow / 1fr 0 1fr;
  }

  dt {
    position: relative;
  }

  dd {
    margin-inline-start: 0;
  }
</style>
