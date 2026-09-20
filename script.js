const orderForm = document.querySelector('#orderForm');
const formSuccess = document.querySelector('#formSuccess');
const keychainText = document.querySelector('#keychainText');
const keychainPreview = document.querySelector('#keychainPreview');
const orderMessage = orderForm.querySelector('textarea[name="message"]');
const cart = [];
const cartDrawer = document.querySelector('#cartDrawer');
const cartBackdrop = document.querySelector('#cartBackdrop');
const checkoutBackdrop = document.querySelector('#checkoutBackdrop');
const cartItems = document.querySelector('#cartItems');
const cartTotal = document.querySelector('#cartTotal');
const cartCount = document.querySelector('#cartCount');
const drawerCount = document.querySelector('#drawerCount');

const money = (value) => `${value.toFixed(2).replace('.00', '')} zł`;

function renderCart() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartCount.textContent = cart.length;
  drawerCount.textContent = `(${cart.length})`;
  cartTotal.textContent = money(total);
  document.querySelector('#startCheckout').disabled = cart.length === 0;
  cartItems.innerHTML = cart.length ? cart.map((item, index) => `<div class="cart-item"><div class="cart-thumb" style="background-image:url('${item.image}')"></div><div><h3>${item.name}</h3><p>1 sztuka</p></div><strong>${money(item.price)}</strong><button class="remove-item" type="button" data-index="${index}">Usuń</button></div>`).join('') : '<p class="empty-cart">Koszyk jest pusty.<br />Dodaj coś z katalogu.</p>';
  cartItems.querySelectorAll('.remove-item').forEach((button) => {
    button.addEventListener('click', () => {
      cart.splice(Number(button.dataset.index), 1);
      renderCart();
    });
  });
}

function openCart() {
  cartDrawer.classList.add('open');
  cartBackdrop.classList.add('visible');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartBackdrop.classList.remove('visible');
}

function setCheckoutStep(step) {
  document.querySelectorAll('.checkout-step').forEach((element) => element.classList.toggle('active', element.dataset.step === String(step)));
  document.querySelectorAll('[data-step-dot]').forEach((dot) => dot.classList.toggle('active', Number(dot.dataset.stepDot) <= step));
}

orderForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formSuccess.classList.add('visible');
  formSuccess.textContent = 'Dziękujemy. Odpowiemy z wyceną na podany adres e-mail.';
  orderForm.reset();
  formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.querySelectorAll('.product-add').forEach((button) => {
  button.addEventListener('click', () => {
    const product = button.dataset.product;
    const images = { 'Wazon Loop': 'assets/product-vase.jfif', 'Hak Mono': 'assets/product-hook.jfif', 'Taca Line': 'assets/product-tray.webp' };
    cart.push({ name: product, price: Number(button.dataset.price), image: images[product] });
    renderCart();
    openCart();
  });
});

keychainText.addEventListener('input', () => {
  keychainPreview.textContent = keychainText.value || 'TWOJE IMIĘ';
});

document.querySelector('#addKeychain').addEventListener('click', () => {
  cart.push({ name: `Brelok ${keychainText.value || 'TWOJE IMIĘ'}`, price: 29, image: 'assets/product-hook.jfif' });
  renderCart();
  openCart();
});

document.querySelector('#openCart').addEventListener('click', openCart);
document.querySelector('#closeCart').addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);

document.querySelector('#startCheckout').addEventListener('click', () => {
  closeCart();
  checkoutBackdrop.classList.add('visible');
  setCheckoutStep(1);
});

document.querySelector('#closeCheckout').addEventListener('click', () => checkoutBackdrop.classList.remove('visible'));
document.querySelector('#toDelivery').addEventListener('click', () => {
  const fields = ['shippingName', 'shippingPhone', 'shippingEmail'];
  const valid = fields.every((id) => document.querySelector(`#${id}`).checkValidity());
  document.querySelector('#shippingError').textContent = valid ? '' : 'Uzupełnij poprawnie wszystkie dane.';
  if (valid) setCheckoutStep(2);
});

document.querySelectorAll('.carrier-option').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.carrier-option').forEach((option) => option.classList.remove('selected'));
  button.classList.add('selected');
}));

document.querySelectorAll('input[name="delivery"]').forEach((radio) => radio.addEventListener('change', () => {
  const isLocker = radio.value === 'Paczkomat';
  document.querySelector('#courierAddress').classList.toggle('hidden', isLocker);
  document.querySelector('#lockerAddress').classList.toggle('hidden', !isLocker);
}));

document.querySelector('#toPayment').addEventListener('click', () => {
  const carrier = document.querySelector('.carrier-option.selected');
  const delivery = document.querySelector('input[name="delivery"]:checked');
  const address = delivery?.value === 'Paczkomat' ? document.querySelector('#lockerCode').value.trim() : document.querySelector('#shippingAddress').value.trim();
  const error = document.querySelector('#deliveryError');
  if (!carrier || !delivery || !address) {
    error.textContent = 'Wybierz przewoźnika, dostawę i podaj adres.';
    return;
  }
  error.textContent = '';
  setCheckoutStep(3);
});

document.querySelector('#blikCode').addEventListener('input', (event) => {
  event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);
});

document.querySelector('#placeOrder').addEventListener('click', () => {
  const blik = document.querySelector('#blikCode');
  const error = document.querySelector('#paymentError');
  if (!/^\d{6}$/.test(blik.value)) {
    error.textContent = 'Wpisz 6-cyfrowy kod BLIK.';
    blik.focus();
    return;
  }
  error.textContent = '';
  document.querySelector('.checkout-step[data-step="3"]').classList.remove('active');
  document.querySelector('.checkout-progress').style.display = 'none';
  document.querySelector('#checkoutSuccess').classList.add('visible');
  document.querySelector('#successSummary').textContent = `Potwierdzenie wyślemy na adres ${document.querySelector('#shippingEmail').value}.`;
  cart.length = 0;
  renderCart();
});

document.querySelector('#finishOrder').addEventListener('click', () => {
  checkoutBackdrop.classList.remove('visible');
  document.querySelector('#checkoutSuccess').classList.remove('visible');
  document.querySelector('.checkout-progress').style.display = '';
  document.querySelector('#shippingError').textContent = '';
});

document.querySelector('.menu-toggle').addEventListener('click', () => {
  const nav = document.querySelector('.main-nav');
  const isOpen = nav.classList.toggle('mobile-open');
  nav.style.display = isOpen ? 'flex' : '';
});
