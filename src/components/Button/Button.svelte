<script lang="ts">
  import type { ButtonColor, ButtonSize, ButtonTheme } from './types';

  export let buttonAction: ((event: MouseEvent) => void) | undefined = (...args: unknown[]): void => undefined;
  export let size: ButtonSize = 'm';
  export let type = 'button';
  export let theme: ButtonTheme = 'primary';
  export let disabled = false;
  export let color: ButtonColor = 'black';
  export let buttonText = '';
  export let className = '';
  export let stationName: string | undefined = undefined;
  export let title = '';
  export let round = false;
  export let stopPropagation = false;
</script>

<button
  {title}
  on:click={(buttonAction)}
  class="Button btn-{theme}
  btn-{size}
  btn-{color}
  {stationName ? stationName : ''}
  {className}"
  class:round
  aria-label={buttonText}
  {disabled}
  {type}
  {...stationName && theme === 'station' ? { ['data-brand']: (stationName) } : {}}
>
  <span class="Button-container">
    <slot name="icon" />
    {#if buttonText}
      <span>{buttonText}</span>
    {:else}
      <slot />
    {/if}
  </span>
</button>

<style>
  /*
    TODO Hover and disabled aren't yet defined
  */
  .Button {
    letter-spacing: 0;
    text-align: center;
    border-width: 2px;
    border-style: solid;
    justify-content: center;
    font-weight: 400;
    text-transform: uppercase;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    align-self: center;
    font-family: var(--font-medium);
    display: flex;
    align-items: center;
    overflow: hidden;
    &:focus {
      outline: none;
    }

    &-container {
      display: flex;
      align-items: center;
    }

    :global([slot='icon'] + *) {
      margin-left: var(--space);
    }

    @media (hover: hover) {
      &:hover:not(:disabled) {
        cursor: pointer;
        transform: translateY(-2px);
      }
    }

    &.btn-black {
      color: var(--color-grey-900);
    }

    &.btn-white {
      color: var(--color-white);
    }

    &.btn-grey {
      color: var(--color-grey-200);
    }

    &.btn-s {
      --size: 32px;
      --iconSize: 16px;
      font-size: 12px;
      padding: 0 var(--space);
      border-radius: 16px;
      height: var(--size);
    }

    &.btn-m {
      --size: 48px;
      --iconSize: 20px;
      font-size: 14px;
      padding: 0 var(--space2);
      border-radius: 24px;
      height: var(--size);
    }

    &.btn-l {
      --size: 64px;
      --iconSize: 24px;
      font-size: 16px;
      border-radius: 32px;
      padding: 0 var(--space3);
      height: var(--size);

      :global([slot='icon'] + *) {
        margin-left: var(--space2);
      }
    }

    &:disabled {
      cursor: default;
      box-shadow: none;
      margin-top: 0;
    }

    &.round {
      max-width: var(--size);
    }

    &.btn-primary {
      border-color: transparent;
      @media (hover: hover) {
        &:hover:not(:disabled) {
          box-shadow: 0 7px 20px 0 rgba(0, 0, 0, 0.22);
        }
      }

      &.btn-black {
        color: var(--color-white);
        background-color: var(--color-grey-900);
      }

      &.btn-white {
        color: var(--color-grey-900);
        background-color: var(--color-white);
      }

      &.btn-grey {
        color: var(--color-grey-900);
        background-color: var(--color-grey-200);
      }
    }

    &.btn-secondary {
      background-color: transparent;
      border-color: currentColor;

      @media (hover: hover) {
        &:hover:not(:disabled) {
          box-shadow: 0 7px 20px 0 rgba(0, 0, 0, 0.1);
        }
      }
    }

    &.btn-grey,
    &.btn-black {
      &:disabled {
        color: var(--color-grey-100);
        background-color: var(--color-grey-300);
      }
    }

    &.btn-white {
      &:disabled {
        color: var(--color-grey-500);
        background-color: var(--color-grey-400);
      }
    }
    &.btn-station {
      color: var(--color-white);
      background-color: var(--brand-color);
      border-color: transparent;

      &.franceinfo,
      &.mouv {
        color: var(--color-grey-900);
      }
    }

    :global([slot='icon']) {
      width: var(--iconSize);
      height: var(--iconSize);
    }

    :global([slot='icon']) {
      &:empty {
        background-color: currentColor;
      }
    }

    :global([slot="icon"] svg) {
      width: var(--iconSize);
      height: var(--iconSize);
    }
  }
</style>
