const install = (Vue, options) => {

  Vue.prototype.$renderText = (h, text) => {
    return h(
      'div',
      {
        style: {
          color: 'red',
        },
      },
      text,
    );
  };
};
export default {
  install,
}