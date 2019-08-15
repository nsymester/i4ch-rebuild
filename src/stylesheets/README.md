# SASS stylesheet structure

## CSS Architecture

These files are organised according to the ITCSS (Inverted Triangle CSS) Architecture.

```javascript
       <-------------- REACH ---------------->
       ---------------------------------------
       \              Settings               /
        \-----------------------------------/
         \              Tools              /
          \-------------------------------/
           \           Generic           /
            \---------------------------/
             \        Elements         /
              \-----------------------/
               \       Objects       /
                \-------------------/
                 \   Components    /
                  \---------------/
                   \  Overrides  /
                    \-----------/
                     \         /
                      \       /
                       \     /
                         ---
```

The top layer of the triangle contains the most generic styles and as you progress downwards the styles become more and more specific ending with overrides.

Those layers are as follows:

- Settings - used with preprocessors and contain font, colors definitions, etc.

- Tools - globally used mixins and functions. It’s important not to output any CSS in the first 2 layers.

- Generic - reset and/or normalize styles, box-sizing definition, etc. This is the first layer which generates actual CSS.

- Elements - styling for bare HTML elements (like H1, A, etc.). These come with default styling from the browser so we can redefine them here.

- Objects - class-based selectors which define undecorated design patterns, for example media object known from OOCSS

- Components - specific UI components. This is where the majority of our work takes place and our UI components are often composed of Objects and Components

- Utilities - utilities and helper classes with ability to override anything which goes before in the triangle, eg. hide helper class
