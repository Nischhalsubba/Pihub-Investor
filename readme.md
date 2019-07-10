# Credittech User Front End

### Installation

Front End Installation requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ npm install
$ gulp serve
```

If you don't have gulp cli, `gulp serve` won't work for you. You must install the gulp cli first.
```sh
$ npm install -g gulp-cli
```

### Important

Make sure you never edit any files inside the `dist` folder. Every files inside it will be replaced by the files from the `src` folder.

We use `pug` as a `html` preprocessor and `sass` for the `css`

What files you need to edit?

| Files | Where to edit |
| ------ | ------ |
| CSS | Edit scss files inside src/assets/sass|
| HTML | Edit pug files inside src and src/templates|
| JS | Edit js files inside src/assets/js|