(function () {
  'use strict';

  var state = { screen: 'rating', rating: 0, targetUrl: '' };

  var screens = {
    rating: document.getElementById('screen-rating'),
    positive: document.getElementById('screen-positive'),
    negative: document.getElementById('screen-negative'),
    submitted: document.getElementById('screen-submitted'),
  };

  var ratingLabels = {
    1: 'Rất không hài lòng 😡',
    2: 'Không hài lòng 🙁',
    3: 'Bình thường 😐',
    4: 'Hài lòng 😊',
    5: 'Rất hài lòng 🤩',
  };

  var starBtns = document.querySelectorAll('.star-btn');
  var submitRatingBtn = document.getElementById('btn-submit-rating');
  var ratingLabel = document.getElementById('rating-label');
  var googleLink = document.getElementById('google-review-link');
  var feedbackForm = document.getElementById('feedback-form');
  var restartBtn = document.getElementById('btn-restart');

  function showScreen(name) {
    Object.keys(screens).forEach(function (key) {
      screens[key].classList.remove('active');
    });
    screens[name].classList.add('active');
    state.screen = name;
  }

  function updateStars(selected) {
    starBtns.forEach(function (btn) {
      var r = parseInt(btn.dataset.rating);
      btn.classList.toggle('active', r <= selected);
      btn.classList.toggle('selected', r === selected);
    });
    ratingLabel.textContent = ratingLabels[selected] || '';
    submitRatingBtn.disabled = !selected;
    state.rating = selected;
  }

  starBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      updateStars(parseInt(btn.dataset.rating));
    });
  });

  submitRatingBtn.addEventListener('click', function () {
    if (!state.rating) return;
    submitRatingBtn.disabled = true;
    submitRatingBtn.innerHTML = '<span class="spinner"></span>Đang xử lý...';

    fetch('/api/v1/sentiment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: state.rating }),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.action === 'REDIRECT_GOOGLE') {
          state.targetUrl = data.target_url;
          googleLink.href = data.target_url;
          showScreen('positive');
        } else {
          showScreen('negative');
        }
      })
      .catch(function () {
        showToast('Có lỗi xảy ra, vui lòng thử lại.');
      })
      .finally(function () {
        submitRatingBtn.disabled = false;
        submitRatingBtn.textContent = 'TIẾP TỤC';
      });
  });

  document.querySelectorAll('.btn-copy').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var template = btn.closest('.template');
      var text = template.dataset.template;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          showToast('Đã sao chép nội dung!');
        });
      } else {
        showToast('Không thể sao chép, vui lòng copy thủ công.');
      }
    });
  });

  document.querySelectorAll('.template').forEach(function (tmpl) {
    tmpl.addEventListener('click', function () {
      var text = tmpl.dataset.template;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          showToast('Đã sao chép nội dung!');
        });
      }
    });
  });

  feedbackForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var submitBtn = feedbackForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span>Đang gửi...';

    var payload = {
      name: document.getElementById('feedback-name').value,
      phone: document.getElementById('feedback-phone').value,
      category: document.getElementById('feedback-category').value,
      message: document.getElementById('feedback-message').value,
      rating: state.rating,
    };

    fetch('/api/v1/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          showScreen('submitted');
        } else {
          showToast(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
      })
      .catch(function () {
        showToast('Có lỗi xảy ra, vui lòng thử lại.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'GỬI GÓP Ý';
      });
  });

  restartBtn.addEventListener('click', function () {
    state.rating = 0;
    state.targetUrl = '';
    updateStars(0);
    feedbackForm.reset();
    showScreen('rating');
  });

  function showToast(msg) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function () { toast.classList.add('show'); }, 10);
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 400);
    }, 2500);
  }
})();
