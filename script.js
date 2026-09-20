const orderForm = document.querySelector('#orderForm');
const formSuccess = document.querySelector('#formSuccess');
const keychainText = document.querySelector('#keychainText');
const keychainPreview = document.querySelector('#keychainPreview');
const orderMessage = orderForm.querySelector('textarea[name="message"]');

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
    orderMessage.value = `Interesuje mnie produkt: ${product}. Proszę o szczegóły i dostępne kolory.`;
    document.querySelector('#zamowienie').scrollIntoView({ behavior: 'smooth' });
    orderMessage.focus();
  });
});

keychainText.addEventListener('input', () => {
  keychainPreview.textContent = keychainText.value || 'TWOJE IMIĘ';
});

document.querySelector('#addKeychain').addEventListener('click', () => {
  orderMessage.value = `Chcę zamówić personalizowany brelok z tekstem: ${keychainText.value || 'TWOJE IMIĘ'}.`;
  document.querySelector('#zamowienie').scrollIntoView({ behavior: 'smooth' });
  orderMessage.focus();
});

document.querySelector('.menu-toggle').addEventListener('click', () => {
  const nav = document.querySelector('.main-nav');
  const isOpen = nav.classList.toggle('mobile-open');
  nav.style.display = isOpen ? 'flex' : '';
});
