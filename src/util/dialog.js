let timer = null;

const dialogMixin = {
  data: function () {
    return {
      _showDialog_: false,
      _dialogMessage_: '出错了'
    }
  },
  methods: {
    showDialogHandle: function (message) {
      this._showDialog_ = true;
      this._dialogMessage_ = message;
      clearTimeout(timer);
      timer = setTimeout(() => {
        this._showDialog_ = false;
        this._dialogMessage_ = ''
      }, 2000);
    }
  }

};

export default dialogMixin;
