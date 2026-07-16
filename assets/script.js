// 例題集ページ: 解答の表示/非表示トグル + 進捗の保存
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.q-card');
  if (!cards.length) return;

  const storeKey = 'shakaigaku-b-checked';
  const loadChecked = () => {
    try { return JSON.parse(localStorage.getItem(storeKey) || '{}'); }
    catch { return {}; }
  };
  const saveChecked = (obj) => localStorage.setItem(storeKey, JSON.stringify(obj));
  const checked = loadChecked();

  cards.forEach(card => {
    const id = card.dataset.id;
    const toggleBtn = card.querySelector('.js-toggle');
    const body = card.querySelector('.q-body');
    const status = card.querySelector('.q-status');
    const checkBtn = card.querySelector('.js-check');

    const setState = (open) => {
      body.classList.toggle('show', open);
      toggleBtn.textContent = open ? '解答・解説を隠す' : '解答・解説を見る';
      toggleBtn.setAttribute('aria-expanded', String(open));
    };
    setState(false);

    toggleBtn.addEventListener('click', () => {
      setState(!body.classList.contains('show'));
    });

    const dialogueBtn = card.querySelector('.js-toggle-dialogue');
    const dialogueBody = card.querySelector('.dialogue-body');
    if (dialogueBtn && dialogueBody) {
      const setDialogueState = (open) => {
        dialogueBody.classList.toggle('show', open);
        dialogueBtn.textContent = open ? '会話ログを隠す' : '会話ログを見る';
        dialogueBtn.setAttribute('aria-expanded', String(open));
      };
      setDialogueState(false);
      dialogueBtn.addEventListener('click', () => {
        setDialogueState(!dialogueBody.classList.contains('show'));
      });
    }

    if (checkBtn) {
      const refresh = () => {
        const done = !!checked[id];
        checkBtn.textContent = done ? '✓ 復習済み' : '復習済みにする';
        checkBtn.classList.toggle('primary', done);
        if (status) status.textContent = done ? '復習済み' : '未復習';
      };
      refresh();
      checkBtn.addEventListener('click', () => {
        checked[id] = !checked[id];
        saveChecked(checked);
        refresh();
      });
    }
  });

  const showAllBtn = document.getElementById('showAll');
  const hideAllBtn = document.getElementById('hideAll');
  if (showAllBtn) showAllBtn.addEventListener('click', () => {
    cards.forEach(card => {
      card.querySelector('.q-body').classList.add('show');
      const b = card.querySelector('.js-toggle');
      b.textContent = '解答・解説を隠す';
      b.setAttribute('aria-expanded', 'true');
    });
  });
  if (hideAllBtn) hideAllBtn.addEventListener('click', () => {
    cards.forEach(card => {
      card.querySelector('.q-body').classList.remove('show');
      const b = card.querySelector('.js-toggle');
      b.textContent = '解答・解説を見る';
      b.setAttribute('aria-expanded', 'false');
    });
  });
});
