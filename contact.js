document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form');
  if (!form) {
    return;
  }

  const statusContainer = document.createElement('p');
  statusContainer.className = 'form-status';
  statusContainer.setAttribute('aria-live', 'polite');
  form.appendChild(statusContainer);

  const toggleStatus = (message, type = 'info') => {
    statusContainer.textContent = message;
    statusContainer.dataset.status = type;
  };

  const isFilled = (value) => typeof value === 'string' && value.trim().length > 0;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const nome = formData.get('nome') || '';
    const empresa = formData.get('empresa') || '';
    const email = formData.get('email') || '';
    const mensagem = formData.get('mensagem') || '';

    if (![nome, empresa, email, mensagem].every(isFilled)) {
      toggleStatus('Por favor, preencha todos os campos antes de enviar.', 'error');
      return;
    }

    toggleStatus('Enviando sua mensagem...', 'loading');
    form.classList.add('is-submitting');

    try {
      const response = await fetch('https://formsubmit.co/ajax/cesar@casitsolutions.com.br', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          Nome: nome.trim(),
          Empresa: empresa.trim(),
          Email: email.trim(),
          Mensagem: mensagem.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`Falha ao enviar email (status ${response.status}).`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error('O serviço não confirmou o envio do email.');
      }

      toggleStatus('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
      form.reset();
    } catch (error) {
      toggleStatus('Não foi possível enviar sua mensagem. Tente novamente em instantes.', 'error');
      console.error('Erro ao enviar email de contato:', error);
    } finally {
      form.classList.remove('is-submitting');
    }
  });
});
