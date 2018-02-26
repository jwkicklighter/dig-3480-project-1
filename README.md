# DIG 3480 Project 1
Star Wars Personality Quiz ([Live Site](https://dig-3480-star-wars-quiz.netlify.com))

## Project Structure
- The project code lives in the `app/` directory.
- The JavaScript code is separated into a few files in `app/js/` and is compiled into a single file at build time using Browserify. There is no manipulation done to the code other than combining them into one file to allow for `require()` statements.
- The CSS is actually SCSS, and it is compiled to CSS at build time. I have not included the final output since the target of this course is JavaScript, but the deployed site's `application.css` is the compiled/concatenated CSS.
- I have created a micro utility library that provides very basic templating capabilities to avoid using any external templating engine (e.g. Handlebars) on the project. This is in `app/js/utils.js`.

## Developing/Running Locally
1. Run `yarn install` to get the dependencies (almost entirely for Gulp)
2. Run `gulp serve` to build the files and watch the directory for changes

## Building
Run `gulp build` and check the `dist/` directory
