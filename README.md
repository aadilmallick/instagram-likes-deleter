# What I learned

Watch demo:

https://www.youtube.com/watch?v=0-Rh8UCX4E0

1. Added interpolation to the css and sql functions.

## Todos

- [ ] Add keepawake
- [ ] Add delete comment functionality
- [ ] Refactor to use chrome messaging wrapper

## What I learned

Messaging between content scripts and extension processes is a tricky thing, but here are the basic rules to use:

1. Ping content script from extension.

```ts
const loaded = await MessagesModel.getContentScriptLoaded(tabId);
```

2. Receive ping from extension in content script, making sure all other message listeners are registered before this, so stuff like mounting react components should already be done

```ts
// before this mount react component, set up listener, etc.

MessagesModel.receivePingFromBackground().then(() => {
  main();
});
```

## Instagram things

The instagram posts look like these:

```html
<div
  data-bloks-name="bk.components.Flexbox"
  tabindex="0"
  role="button"
  aria-label="Image of Post"
  class="wbloks_1"
  style="pointer-events: none;"
>
  <img
    data-bloks-name="bk.components.Image"
    alt=""
    class="wbloks_1"
    src="https://scontent-iad3-2.cdninstagram.com/v/t51.2885-15/494026867_18056520098236002_8459025033943575885_n.jpg?stp=c0.140.1125.1125a_dst-jpg_e35_s240x240_tt6&amp;efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjExMjV4MTQwNi5zZHIuZjc1NzYxLmRlZmF1bHRfaW1hZ2UifQ&amp;_nc_ht=scontent-iad3-2.cdninstagram.com&amp;_nc_cat=106&amp;_nc_oc=Q6cZ2QGgEHekH95iM2KK17lIPmr5rgIBbWygWKJdPTa0tSuissoAleirYElpa97jtySwfZo&amp;_nc_ohc=4d5kPKIHoE8Q7kNvwFcGfhV&amp;_nc_gid=NB1rS8ftbPPRdxHa4D55_A&amp;edm=APs17CUBAAAA&amp;ccb=7-5&amp;ig_cache_key=MzYyMTUzOTExNDI0NDM2OTM0OQ%3D%3D.3-ccb7-5&amp;oh=00_AfJlkHWgQNkqjz3p3YlBUZF56827SJ0TG9NkVrYahnSVoQ&amp;oe=6830E007&amp;_nc_sid=10d13b"
    style="height: 100%; flex-grow: 1; object-fit: cover; overflow: hidden;"
  />
</div>
```

This is the unlike button HTML

```html
<div
  data-bloks-name="bk.components.Flexbox"
  tabindex="0"
  role="button"
  aria-label="Unlike"
  class="wbloks_1"
  style="pointer-events: auto; width: auto; min-height: 32px; cursor: pointer; -webkit-tap-highlight-color: transparent; align-items: center; justify-content: center;"
>
  <div
    data-bloks-name="bk.components.Flexbox"
    class="wbloks_1"
    style="pointer-events: none; width: auto; margin: 5px 16px; align-items: center; justify-content: center;"
  >
    <div
      data-bloks-name="bk.components.RichText"
      dir="auto"
      class="wbloks_1"
      style="line-height: 1.3; display: block; overflow: hidden;"
    >
      <span
        data-bloks-name="bk.components.TextSpan"
        style="color: rgb(237, 73, 86); font-weight: 700; display: inline; font-size: 14px; white-space: pre-wrap; overflow-wrap: break-word;"
        >Unlike</span
      >
    </div>
  </div>
  <div
    data-bloks-name="bk.components.BoxDecoration"
    class="wbloks_8"
    style="background: rgba(0, 0, 0, 0);"
  ></div>
</div>
```

Scrollable posts container:

```html
<div
  data-bloks-name="bk.components.Collection"
  class="wbloks_1
wbloks_95 wbloks_93"
  style="flex-grow: 1; display: block; pointe
r-events: auto;"
></div>
```
