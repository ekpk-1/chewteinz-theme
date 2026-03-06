window.cartDrawer = {
  open() {
    const drawer = document.getElementById('cart-drawer');
    const panel = document.getElementById('cart-drawer-panel');
    if (!drawer || !panel) return;
    drawer.classList.remove('hidden');
    requestAnimationFrame(() => {
      panel.classList.remove('translate-x-full');
      panel.classList.add('translate-x-0');
    });
  },

  close() {
    const drawer = document.getElementById('cart-drawer');
    const panel = document.getElementById('cart-drawer-panel');
    if (!drawer || !panel) return;
    panel.classList.remove('translate-x-0');
    panel.classList.add('translate-x-full');
    setTimeout(() => drawer.classList.add('hidden'), 300);
  },

  async addItem(variantId, quantity) {
    quantity = quantity || 1;
    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: quantity })
      });
      if (!res.ok) throw new Error('Failed to add item');
      await this.refresh();
      this.open();
    } catch (err) {
      console.error('Cart add error:', err);
    }
  },

  async updateQuantity(key, quantity) {
    try {
      const res = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: Math.max(0, quantity) })
      });
      if (!res.ok) throw new Error('Failed to update item');
      await this.refresh();
    } catch (err) {
      console.error('Cart update error:', err);
    }
  },

  async removeItem(key) {
    await this.updateQuantity(key, 0);
  },

  async refresh() {
    try {
      const res = await fetch('/cart.js', { headers: { 'Accept': 'application/json' } });
      const cart = await res.json();
      this.updateUI(cart);
    } catch (err) {
      console.error('Cart refresh error:', err);
    }
  },

  updateUI(cart) {
    document.querySelectorAll('.cart-count-badge').forEach(function(badge) {
      badge.textContent = cart.item_count;
      badge.classList.toggle('hidden', cart.item_count === 0);
    });

    var countEl = document.getElementById('cart-drawer-count');
    if (countEl) countEl.textContent = cart.item_count;

    var totalEl = document.getElementById('cart-drawer-total');
    if (totalEl) totalEl.textContent = '$' + (cart.total_price / 100).toFixed(2);

    var footer = document.getElementById('cart-drawer-footer');
    if (footer) footer.classList.toggle('hidden', cart.item_count === 0);

    var itemsContainer = document.getElementById('cart-drawer-items');
    if (!itemsContainer) return;

    if (cart.item_count === 0) {
      itemsContainer.innerHTML = '<div class="text-center py-12" id="cart-empty-state"><div class="text-6xl mb-4">\uD83D\uDED2</div><p class="text-lg text-gray-600 font-body">Your cart is empty</p><p class="text-sm text-gray-500 mt-2">Add some delicious protein treats!</p></div>';
      return;
    }

    var html = '<div class="space-y-4" id="cart-items-list">';
    cart.items.forEach(function(item, index) {
      var imgSrc = item.image ? item.image.replace(/(\.\w+)$/, '_160x160$1') : '';
      html += '<div class="flex gap-4 bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors" data-key="' + item.key + '">';
      html += '<div class="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-chewteinz-yellow to-chewteinz-pink rounded-xl overflow-hidden">';
      if (imgSrc) {
        html += '<img src="' + imgSrc + '" alt="' + item.title + '" class="w-full h-full object-cover">';
      } else {
        html += '<div class="w-full h-full flex items-center justify-center text-2xl">\uD83C\uDF6C</div>';
      }
      html += '</div>';
      html += '<div class="flex-1 min-w-0">';
      html += '<h3 class="font-display font-semibold text-gray-800 truncate">' + item.product_title + '</h3>';
      html += '<p class="text-sm text-gray-600 mb-2">$' + (item.price / 100).toFixed(2) + ' each</p>';
      html += '<div class="flex items-center gap-2">';
      html += '<button type="button" onclick="window.cartDrawer.updateQuantity(\'' + item.key + '\',' + (item.quantity - 1) + ')" class="p-1 bg-white rounded-full hover:bg-gray-200 transition-colors" aria-label="Decrease quantity"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg></button>';
      html += '<span class="w-8 text-center font-semibold">' + item.quantity + '</span>';
      html += '<button type="button" onclick="window.cartDrawer.updateQuantity(\'' + item.key + '\',' + (item.quantity + 1) + ')" class="p-1 bg-white rounded-full hover:bg-gray-200 transition-colors" aria-label="Increase quantity"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg></button>';
      html += '</div></div>';
      html += '<div class="flex flex-col items-end justify-between">';
      html += '<button type="button" onclick="window.cartDrawer.removeItem(\'' + item.key + '\')" class="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors" aria-label="Remove item"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button>';
      html += '<p class="font-display font-bold text-gray-800">$' + (item.line_price / 100).toFixed(2) + '</p>';
      html += '</div></div>';
    });
    html += '</div>';
    itemsContainer.innerHTML = html;
  }
};
