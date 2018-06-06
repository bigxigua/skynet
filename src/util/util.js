(function () {
  window.util = {
    getParameterByName: function (name) {
      var url = url || window.location.href;
      name = name.replace(/[\[\]]/g, '\\$&');
      let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'i'),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    isEmptyObject: function (obj) {
      return Object.keys(obj).length === 0;
    }
  };
  const __alert__ = function () {
    let oCover,oBtn, oMsgBox, timer;
    return function (msg) {
      if(window.__showAlert__) {
        oMsgBox.innerText = msg;
        oCover.style.display = 'block';
      } else {
        oMsgBox = document.createElement('div');
        oCover = document.createElement('div');
        oBtn = document.createElement('button');
        oCover.classList.add('alert-cover');
        oMsgBox.classList.add('alert-message-box');
        oMsgBox.innerText = msg;
        oCover.appendChild(oMsgBox);
        document.body.appendChild(oCover);
        window.__showAlert__ = true;
      }
      clearTimeout(timer);
      setTimeout(function () {
        oCover.style.display = 'none';
      }, 1500)
    }
  };
  window.alert = __alert__();
  window.log = window.console.log;
})();
