function getTitle (vm) {
  const { title } = vm.$options;
  if (title) {
    return typeof title === 'function'
      ? title.call(vm)
      : title
  }
}

const clientTitleMixin = {
  data: function () {
    return {
      title: ''
    }
  },
  watch: {
    '$route.query': function (query) {
      this._setTitle_();
    }
  },
  mounted () {
    this._setTitle_();
  },
  methods: {
    _setTitle_: function () {
      const title = getTitle(this);
      if(title) {
        document.title = title;
        this.title = title;
      }
    }
  },

};

export default clientTitleMixin;
