(function () {
  document.documentElement.style.visibility = 'hidden';

  var STORE_KEY = 'study-site-unlocked-v1';
  var HASH = '026b60ddaf835dfe218e57c5c923c156e512a308d84850986ac365180a33f2a1';

  function sha256Hex(text) {
    var data = new TextEncoder().encode(text);
    return crypto.subtle.digest('SHA-256', data).then(function (buf) {
      return Array.from(new Uint8Array(buf))
        .map(function (b) { return b.toString(16).padStart(2, '0'); })
        .join('');
    });
  }

  function reveal() {
    document.documentElement.style.visibility = 'visible';
  }

  function showGate() {
    var overlay = document.createElement('div');
    overlay.className = 'gate-overlay';
    overlay.innerHTML =
      '<form class="gate-box">' +
        '<div class="gate-title">🔒 パスワードを入力してください</div>' +
        '<input type="password" class="gate-input" placeholder="パスワード" autocomplete="off">' +
        '<button type="submit" class="btn primary gate-submit">開く</button>' +
        '<div class="gate-error"></div>' +
      '</form>';
    document.body.appendChild(overlay);
    reveal();
    document.body.style.overflow = 'hidden';

    var input = overlay.querySelector('.gate-input');
    var err = overlay.querySelector('.gate-error');
    input.focus();

    overlay.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      sha256Hex(input.value).then(function (h) {
        if (h === HASH) {
          try { localStorage.setItem(STORE_KEY, h); } catch (e) {}
          document.body.style.overflow = '';
          overlay.remove();
        } else {
          err.textContent = 'パスワードが違います';
          input.value = '';
          input.focus();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
    if (saved === HASH) {
      reveal();
    } else {
      showGate();
    }
  });
})();
