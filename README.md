# vogel-stimmen-quiz

## Frontend

Play at https://www.arashrouhani.com/vogel-stimmen-quiz/quiz.html

### Compile

    tsc && rollup --config

For this to work I had to install the following like this:

    canhaz node-typescript rollup npm
    
Yes I need `npm` now. Once I had npm, I had to install `@rollup/plugin-terser`

    npm clean-install @rollup/plugin-terser


Assuming `canhaz` is mapped to `sudo apt-get install`

### Backend

Backend runs on Google's app engine. I mainly used this link:

https://cloud.google.com/appengine/docs/standard/python3/create-app

I test it in VScode and I deploy like:

    (cd server/src && gcloud app deploy)