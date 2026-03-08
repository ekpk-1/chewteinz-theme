window.modals = {
  _openModal(modalId, contentId) {
    var modal = document.getElementById(modalId);
    var content = document.getElementById(contentId);
    if (!modal) return;
    modal.classList.remove('pointer-events-none');
    modal.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function() {
      modal.classList.remove('opacity-0');
      modal.classList.add('opacity-100');
      if (content) {
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
        if (content.classList.contains('-rotate-6')) {
          content.classList.remove('-rotate-6');
          content.classList.add('rotate-0');
        }
      }
    });
  },

  _closeModal(modalId, contentId, callback) {
    var modal = document.getElementById(modalId);
    var content = document.getElementById(contentId);
    if (!modal) return;
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    if (content) {
      content.classList.remove('scale-100');
      content.classList.add('scale-95');
    }
    setTimeout(function() {
      modal.classList.add('pointer-events-none');
      modal.setAttribute('aria-hidden', 'true');
      if (callback) callback();
    }, 300);
  },

  // Subscribe Modal
  openSubscribe() {
    document.getElementById('subscribe-form-section').classList.remove('hidden');
    document.getElementById('subscribe-success-section').classList.add('hidden');
    document.getElementById('subscribe-error').classList.add('hidden');
    document.getElementById('subscribe-name').value = '';
    document.getElementById('subscribe-email').value = '';
    document.getElementById('subscribe-submit-btn').textContent = 'Get My 10% Off';
    document.getElementById('subscribe-submit-btn').disabled = false;
    this._openModal('subscribe-modal', 'subscribe-modal-content');
  },

  closeSubscribe() {
    this._closeModal('subscribe-modal', 'subscribe-modal-content');
  },

  handleSubscribeSubmit(e) {
    e.preventDefault();
    var self = this;
    var name = document.getElementById('subscribe-name').value.trim();
    var email = document.getElementById('subscribe-email').value.trim();
    var errorEl = document.getElementById('subscribe-error');
    var errorText = document.getElementById('subscribe-error-text');
    var btn = document.getElementById('subscribe-submit-btn');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEl.classList.remove('hidden');
      errorText.textContent = 'Please enter a valid email address';
      return false;
    }

    errorEl.classList.add('hidden');
    btn.textContent = 'Subscribing...';
    btn.disabled = true;

    var settings = window.chewteinzSettings || {};
    var publicKey = settings.klaviyoPublicKey;
    var listId = settings.klaviyoSubscribeListId;

    if (!publicKey || !listId) {
      errorEl.classList.remove('hidden');
      errorText.textContent = 'Newsletter signup is not configured. Please contact the store owner.';
      btn.textContent = 'Get My 10% Off';
      btn.disabled = false;
      return false;
    }

    var payload = {
      data: {
        type: 'subscription',
        attributes: {
          custom_source: 'Subscribe modal (10% off)',
          profile: {
            data: {
              type: 'profile',
              attributes: {
                email: email.toLowerCase(),
                first_name: name || undefined
              }
            }
          }
        },
        relationships: {
          list: {
            data: { type: 'list', id: listId }
          }
        }
      }
    };

    fetch('https://a.klaviyo.com/client/subscriptions?company_id=' + encodeURIComponent(publicKey), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
        'revision': '2026-01-15'
      },
      body: JSON.stringify(payload)
    })
    .then(function(res) {
      if (!res.ok) {
        return res.json().then(function(data) {
          var msg = (data.errors && data.errors[0] && data.errors[0].detail) || 'Failed to subscribe';
          throw new Error(msg);
        });
      }
      document.getElementById('subscribe-form-section').classList.add('hidden');
      document.getElementById('subscribe-success-section').classList.remove('hidden');
      setTimeout(function() {
        self._closeModal('subscribe-modal', 'subscribe-modal-content', function() {
          self.openGift();
        });
      }, 1500);
    })
    .catch(function(err) {
      errorEl.classList.remove('hidden');
      errorText.textContent = err.message || 'Something went wrong. Please try again.';
      btn.textContent = 'Get My 10% Off';
      btn.disabled = false;
    });

    return false;
  },

  // Gift Modal
  openGift() {
    this._openModal('gift-modal', 'gift-modal-content');
    document.getElementById('gift-copy-icon').classList.remove('hidden');
    document.getElementById('gift-check-icon').classList.add('hidden');
    document.getElementById('gift-copied-msg').classList.add('hidden');
    this._showConfetti();
  },

  closeGift() {
    this._closeModal('gift-modal', 'gift-modal-content');
  },

  copyGiftCode() {
    var self = this;
    try {
      navigator.clipboard.writeText('CHEWFAN10').then(function() { self._showCopied(); });
    } catch (e) {
      var ta = document.createElement('textarea');
      ta.value = 'CHEWFAN10';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      self._showCopied();
    }
  },

  _showCopied() {
    document.getElementById('gift-copy-icon').classList.add('hidden');
    document.getElementById('gift-check-icon').classList.remove('hidden');
    document.getElementById('gift-copied-msg').classList.remove('hidden');
    setTimeout(function() {
      document.getElementById('gift-copy-icon').classList.remove('hidden');
      document.getElementById('gift-check-icon').classList.add('hidden');
      document.getElementById('gift-copied-msg').classList.add('hidden');
    }, 2000);
  },

  _showConfetti() {
    var container = document.getElementById('confetti-container');
    if (!container) return;
    container.classList.remove('hidden');
    var colors = ['#FFD700', '#FF1493', '#9B59B6', '#00CED1', '#FF6347', '#32CD32'];
    var html = '';
    for (var i = 0; i < 50; i++) {
      var left = Math.random() * 100;
      var delay = Math.random() * 0.5;
      var dur = 2 + Math.random() * 2;
      var color = colors[Math.floor(Math.random() * colors.length)];
      var rot = Math.random() * 360;
      html += '<div class="absolute -top-4 w-2 h-2 opacity-0 animate-confetti-fall" style="left:' + left + '%;background-color:' + color + ';animation-delay:' + delay + 's;animation-duration:' + dur + 's;transform:rotate(' + rot + 'deg)"></div>';
    }
    container.innerHTML = html;
    setTimeout(function() { container.classList.add('hidden'); container.innerHTML = ''; }, 4000);
  },

  // Nutrition Modal
  openNutrition(productName) {
    document.getElementById('nutrition-product-name').textContent = productName;
    var container = document.getElementById('nutrition-table-container');
    var name = (productName || '').toLowerCase();
    var bg, border;
    if (name.indexOf('blueberry') !== -1) { bg = '#3E577D'; border = '#2E4361'; }
    else if (name.indexOf('sour watermelon') !== -1) { bg = '#CC6666'; border = '#B35555'; }
    else { bg = '#A2CD76'; border = '#8BB65C'; }
    container.style.backgroundColor = bg;
    container.style.borderColor = border;
    container.querySelectorAll('.nutrition-border-l').forEach(function(el) { el.style.borderLeftColor = border; el.style.borderLeftWidth = '1px'; el.style.borderLeftStyle = 'solid'; });
    container.querySelectorAll('.nutrition-row-border').forEach(function(el) { el.style.borderBottomColor = border; el.style.borderBottomWidth = '1px'; el.style.borderBottomStyle = 'solid'; });
    container.querySelectorAll('.nutrition-border-t').forEach(function(el) { el.style.borderTopColor = border; el.style.borderTopWidth = '1px'; el.style.borderTopStyle = 'solid'; });
    this._openModal('nutrition-modal', 'nutrition-modal-content');
  },

  closeNutrition() {
    this._closeModal('nutrition-modal', 'nutrition-modal-content');
  },

  // Notify Modal
  openNotify(flavorName) {
    document.getElementById('notify-flavor-name').textContent = flavorName;
    document.getElementById('notify-form-section').classList.remove('hidden');
    document.getElementById('notify-success-section').classList.add('hidden');
    document.getElementById('notify-error').classList.add('hidden');
    document.getElementById('notify-name').value = '';
    document.getElementById('notify-email').value = '';
    document.getElementById('notify-submit-btn').textContent = 'Notify Me';
    document.getElementById('notify-submit-btn').disabled = false;
    document.getElementById('notify-success-text').textContent = "We'll email you as soon as " + flavorName + " is available.";
    this._openModal('notify-modal', 'notify-modal-content');
  },

  closeNotify() {
    this._closeModal('notify-modal', 'notify-modal-content');
  },

  handleNotifySubmit(e) {
    e.preventDefault();
    var name = document.getElementById('notify-name').value.trim();
    var email = document.getElementById('notify-email').value.trim();
    var errorEl = document.getElementById('notify-error');
    var errorText = document.getElementById('notify-error-text');
    var btn = document.getElementById('notify-submit-btn');
    var flavorName = document.getElementById('notify-flavor-name').textContent.trim() || 'this product';

    if (!name) { errorEl.classList.remove('hidden'); errorText.textContent = 'Please enter your name'; return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errorEl.classList.remove('hidden'); errorText.textContent = 'Please enter a valid email address'; return false; }

    errorEl.classList.add('hidden');
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    var settings = window.chewteinzSettings || {};
    var publicKey = settings.klaviyoPublicKey;
    var listId = settings.klaviyoNotifyListId || settings.klaviyoSubscribeListId;

    if (!publicKey || !listId) {
      errorEl.classList.remove('hidden');
      errorText.textContent = 'Back-in-stock signup is not configured. Please contact the store owner.';
      btn.textContent = 'Notify Me';
      btn.disabled = false;
      return false;
    }

    var payload = {
      data: {
        type: 'subscription',
        attributes: {
          custom_source: 'Back-in-stock notify: ' + flavorName,
          profile: {
            data: {
              type: 'profile',
              attributes: {
                email: email.toLowerCase(),
                first_name: name,
                properties: { notify_product: flavorName }
              }
            }
          }
        },
        relationships: {
          list: {
            data: { type: 'list', id: listId }
          }
        }
      }
    };

    fetch('https://a.klaviyo.com/client/subscriptions?company_id=' + encodeURIComponent(publicKey), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
        'revision': '2026-01-15'
      },
      body: JSON.stringify(payload)
    })
    .then(function(res) {
      if (!res.ok) {
        return res.json().then(function(data) {
          var msg = (data.errors && data.errors[0] && data.errors[0].detail) || 'Failed to sign up';
          if (msg.toLowerCase().indexOf('already') !== -1) msg = "You're already on the list!";
          throw new Error(msg);
        });
      }
      document.getElementById('notify-form-section').classList.add('hidden');
      document.getElementById('notify-success-section').classList.remove('hidden');
    })
    .catch(function(err) {
      errorEl.classList.remove('hidden');
      errorText.textContent = err.message || 'Something went wrong. Please try again.';
      btn.textContent = 'Notify Me';
      btn.disabled = false;
    });

    return false;
  },

  // Preorder Modal
  openPreorder() {
    this._openModal('preorder-modal', 'preorder-modal-content');
  },

  closePreorder() {
    this._closeModal('preorder-modal', 'preorder-modal-content');
  }
};

// Auto-show subscribe modal after 3s (same as React logic)
document.addEventListener('DOMContentLoaded', function() {
  if (!sessionStorage.getItem('subscribe-modal-seen')) {
    setTimeout(function() {
      window.modals.openSubscribe();
      sessionStorage.setItem('subscribe-modal-seen', 'true');
    }, 3000);
  }
});

// Contact form handler
function handleContactSubmit(e) {
  e.preventDefault();
  var form = document.getElementById('contact-form');
  var btn = document.getElementById('contact-submit-btn');
  var successEl = document.getElementById('contact-success');
  var errorEl = document.getElementById('contact-error');

  if (!form) return false;

  var name = document.getElementById('contact-name').value.trim();
  var email = document.getElementById('contact-email').value.trim();
  var subject = document.getElementById('contact-subject').value.trim();
  var message = document.getElementById('contact-message').value.trim();

  btn.textContent = 'Sending...';
  btn.disabled = true;
  successEl.classList.add('hidden');
  errorEl.classList.add('hidden');

  var settings = window.chewteinzSettings || {};

  fetch(settings.makeWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, email: email, subject: subject, message: message })
  })
  .then(function(res) {
    if (!res.ok) throw new Error('Webhook failed');
    if (settings.supabaseUrl && settings.supabaseAnonKey) {
      return fetch(settings.supabaseUrl + '/rest/v1/contact_submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': settings.supabaseAnonKey,
          'Authorization': 'Bearer ' + settings.supabaseAnonKey
        },
        body: JSON.stringify({ name: name, email: email, subject: subject, message: message })
      }).catch(function() {});
    }
  })
  .then(function() {
    successEl.classList.remove('hidden');
    form.reset();
    btn.textContent = 'Send Message';
    btn.disabled = false;
  })
  .catch(function() {
    errorEl.classList.remove('hidden');
    btn.textContent = 'Send Message';
    btn.disabled = false;
  });

  return false;
}
