# catsplash!

## State management showcase

The <b>purpose</b> of this app is to demonstrate various methods of state management in a moderately complex React application that includes <b>async calls</b>, browser <b>local storage</b> as database, <b>image tag</b> logic, <b>modals</b> and responsive design.

This app is a copy of the famous stock photography website [unsplash](https://unsplash.com). It has a <b>minimal interface</b> that constitutes of a <b>masonry layout</b> and some <b>control buttons</b>. The principle is very simple: <b>get images</b> of cats by pressing the "get cat" button, then you can <b>like</b> the images, <b>add</b> tags to them and <b>filter</b> them by "liked" or by tags.

### Branches

`main` - basic state management with <b>`useState()`</b>. Not the best solution for the scale of this app, but functional and straight forward, easy to read.

`with-useReducer` - state management with <b>`useReducer()`</b>. It implies a more complex flow for state management by leveraging the power of the <b>Reducer Pattern</b>. The reducer is preferable in cases where we have to manage <b>many pieces of state</b>. Pairing it with the <b>context API</b> enables us to mutate state seamlessly at different levels of our app without bothering with passing props or creating additional interfaces.

# TODO's

- Implement Redux branch
- Implement MobX branch
