# Solid Pre-render possible regression

## Shared setup

I have put together a custom build, based on vite, to pre-render to HTML on a production build and hydrate once in the browser. In development, I use only client side rendering. The build flow is defined in `./scripts/prerender.ts` and goes as follows:

1. Build the app for the client and "server" in parallel.
2. Read the transformed `index.html` from the client build output
3. Further transform the HTML by calling the `render` function exposed by the "server" build from the earlier step to inject the hydration script in the head and inject the HTML returned by `render` into the HTML body.
4. Write the HTML files to disk in the `./dist` directory.

The bug seems to be related to how child textNodes are rendered within a `<label/>` in this case.

In Solid 1.4.7 for the `RadioGroup` component, found at `apps/www/src/components/radio-group.tsx`, I could pass a string prop to the `Radio` component, which would show up as a textNode of a `<label/>` element as expected and render appropriately in development and production.

```tsx
// radio-group.tsx
<label for={linkingId}>{props.label}</label>
```

In Solid 1.5.4, this began to break. In development, everything is the same, but after pre-rendering and hydrating, I found that the textNode of the `<label/>` was removed after hydration. Notably though, the pre-rendered HTML does contain the textNode as expected. To work around this issue, I used the `textContent` prop. No errors appeared in the console on build or within the browser.

```tsx
// radio-group.tsx
<label for={linkingId} textContent={props.label} />
```

## Current

Build and preview with `pnpm build && pnpm preview`

Dependencies:

- solid-js@1.5.4
- vite-plugin-solid@2.3.0

Pre-rendered HTML:

```html
<!--#-->
<ul data-hk="0-1-0-0-1-1-0">
  <li data-hk="0-1-0-0-1-1-1-0-1">
    <label for="0-1-0-0-1-1-1-0-0">6</label
    ><input
      type="radio"
      id="0-1-0-0-1-1-1-0-0"
      name="PHRASE_COUNT_KEY"
      value="6"
    />
  </li>
  <li data-hk="0-1-0-0-1-1-1-1-1">
    <label for="0-1-0-0-1-1-1-1-0">7</label
    ><input
      type="radio"
      id="0-1-0-0-1-1-1-1-0"
      name="PHRASE_COUNT_KEY"
      value="7"
    />
  </li>
  <li data-hk="0-1-0-0-1-1-1-2-1">
    <label for="0-1-0-0-1-1-1-2-0">8</label
    ><input
      type="radio"
      checked
      id="0-1-0-0-1-1-1-2-0"
      name="PHRASE_COUNT_KEY"
      value="8"
    />
  </li>
  <li data-hk="0-1-0-0-1-1-1-3-1">
    <label for="0-1-0-0-1-1-1-3-0">9</label
    ><input
      type="radio"
      id="0-1-0-0-1-1-1-3-0"
      name="PHRASE_COUNT_KEY"
      value="9"
    />
  </li>
  <li data-hk="0-1-0-0-1-1-1-4-1">
    <label for="0-1-0-0-1-1-1-4-0">10</label
    ><input
      type="radio"
      id="0-1-0-0-1-1-1-4-0"
      name="PHRASE_COUNT_KEY"
      value="10"
    />
  </li>
</ul>
<!--/-->
```

Post-hydration HTML (captured by Chrome's DevTools):

```html
<ul>
  <li>
    <label for="0-0-0-0-1-0-0-0-0"></label
    ><input
      type="radio"
      id="0-0-0-0-1-0-0-0-0"
      name="PHRASE_COUNT_KEY"
      value="6"
    />
  </li>
  <li>
    <label for="0-0-0-0-1-0-0-1-0"></label
    ><input
      type="radio"
      id="0-0-0-0-1-0-0-1-0"
      name="PHRASE_COUNT_KEY"
      value="7"
    />
  </li>
  <li>
    <label for="0-0-0-0-1-0-0-2-0"></label
    ><input
      type="radio"
      id="0-0-0-0-1-0-0-2-0"
      name="PHRASE_COUNT_KEY"
      value="8"
    />
  </li>
  <li>
    <label for="0-0-0-0-1-0-0-3-0"></label
    ><input
      type="radio"
      id="0-0-0-0-1-0-0-3-0"
      name="PHRASE_COUNT_KEY"
      value="9"
    />
  </li>
  <li>
    <label for="0-0-0-0-1-0-0-4-0"></label
    ><input
      type="radio"
      id="0-0-0-0-1-0-0-4-0"
      name="PHRASE_COUNT_KEY"
      value="10"
    />
  </li>
</ul>
```

## Prior

Build and preview with `pnpm build && pnpm preview`

Dependencies:

- solid-js@1.4.7
- vite-plugin-solid@2.2.6

Pre-rendered HTML:

```html
<!--#-->
<ul data-hk="0-1-0-0-1-1-0">
  <li data-hk="0-1-0-0-1-1-1-0-1">
    <label for="0-1-0-0-1-1-1-0-0">6</label
    ><input
      type="radio"
      id="0-1-0-0-1-1-1-0-0"
      name="PHRASE_COUNT_KEY"
      value="6"
    />
  </li>
  <li data-hk="0-1-0-0-1-1-1-1-1">
    <label for="0-1-0-0-1-1-1-1-0">7</label
    ><input
      type="radio"
      id="0-1-0-0-1-1-1-1-0"
      name="PHRASE_COUNT_KEY"
      value="7"
    />
  </li>
  <li data-hk="0-1-0-0-1-1-1-2-1">
    <label for="0-1-0-0-1-1-1-2-0">8</label
    ><input
      type="radio"
      checked
      id="0-1-0-0-1-1-1-2-0"
      name="PHRASE_COUNT_KEY"
      value="8"
    />
  </li>
  <li data-hk="0-1-0-0-1-1-1-3-1">
    <label for="0-1-0-0-1-1-1-3-0">9</label
    ><input
      type="radio"
      id="0-1-0-0-1-1-1-3-0"
      name="PHRASE_COUNT_KEY"
      value="9"
    />
  </li>
  <li data-hk="0-1-0-0-1-1-1-4-1">
    <label for="0-1-0-0-1-1-1-4-0">10</label
    ><input
      type="radio"
      id="0-1-0-0-1-1-1-4-0"
      name="PHRASE_COUNT_KEY"
      value="10"
    />
  </li>
</ul>
<!--/-->
```

Post-hydration HTML (captured by Chrome's DevTools):

```html
<ul>
  <li>
    <label for="cl-0">6</label
    ><input type="radio" id="cl-0" name="PHRASE_COUNT_KEY" value="6" />
  </li>
  <li>
    <label for="cl-1">7</label
    ><input type="radio" id="cl-1" name="PHRASE_COUNT_KEY" value="7" />
  </li>
  <li>
    <label for="cl-2">8</label
    ><input type="radio" id="cl-2" name="PHRASE_COUNT_KEY" value="8" />
  </li>
  <li>
    <label for="cl-3">9</label
    ><input type="radio" id="cl-3" name="PHRASE_COUNT_KEY" value="9" />
  </li>
  <li>
    <label for="cl-4">10</label
    ><input type="radio" id="cl-4" name="PHRASE_COUNT_KEY" value="10" />
  </li>
</ul>
```
