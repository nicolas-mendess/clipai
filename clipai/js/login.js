'use strict';
const toastRegion = document.querySelector('#toast-region');
function loginToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast warning';
  toast.textContent = message;
  toastRegion.append(toast);
  window.setTimeout(() => toast.remove(), 3800);
}
document.querySelector('#toggle-password')?.addEventListener('click', event => {
  const input = document.querySelector('#login-password');
  const showing = input.type === 'text';
  input.type = showing ? 'password' : 'text';
  event.currentTarget.setAttribute('aria-label', showing ? 'Mostrar senha' : 'Ocultar senha');
});
document.querySelector('#login-form')?.addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  loginToast('Login demonstrativo: a autenticação ainda não está conectada a um servidor.');
});
document.querySelector('#google-login')?.addEventListener('click', () => loginToast('A autenticação com Google não está configurada neste protótipo.'));
document.querySelector('#forgot-password')?.addEventListener('click', event => { event.preventDefault(); loginToast('A recuperação de senha será implementada na próxima etapa.'); });
document.querySelector('#signup-link')?.addEventListener('click', event => { event.preventDefault(); loginToast('O cadastro ainda não está conectado a um servidor.'); });
