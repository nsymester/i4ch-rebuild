# Insurance 4 Car Hire (I4CH) Rebuild

## Getting Started

### To install

```bash
$ npm install
```

### To run on a local server

```bash
$ npm run start
```

Then enter **http://localhost:3000** in a web browser

### To build production version

```bash
$ npm run build
```

## Tests

```bash
$ npm run test
```

## Build

Built using:

- Nunjucks templating language for JavaScript
- Bootstrap 4 with custom styles added using SASS

## Linting

"extends": "eslint:recommended",

## Bitbucket pipelines

Got help creating the pipeline from [Stack Overflow](https://stackoverflow.com/questions/40030786/bitbucket-pipeline-for-simple-html-site-no-database)

## SASS Stylesheet Architecture

These files are organised according to the ITCSS (Inverted Triangle CSS) Architecture.

```bash
---------------------------------------
\               Settings              /
 \-----------------------------------/
  \              Tools              /
   \-------------------------------/
    \           Generic           /
     \---------------------------/
      \        Elements         /
       \-----------------------/
        \       Objects       /
         \-------------------/
          \    Components   /
           \---------------/
            \  Overrides  /
             \-----------/
              \         /
               \       /
                \     /
                  ---
```

The top layer of the triangle, **Settings**, contains the most generic styles and as you progress downwards the styles become more and more specific ending with **Overrides**.

## Styling

Formatting

`npm run format`

Command line styling

`npx prettier --write "**/*.js"`

`npx prettier --write "**/*.json"`

Accessibility testing

`npm run pally`
