document.addEventListener('DOMContentLoaded', () => {
  const CONTACT_ENDPOINT = '/api/contact';

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

  const buildPayload = ({ nome, empresa, email, mensagem }) => {
    const trimmed = {
      nome: nome.trim(),
      empresa: empresa.trim(),
      email: email.trim(),
      mensagem: mensagem.trim()
    };

    return {
      nome: trimmed.nome,
      empresa: trimmed.empresa,
      email: trimmed.email,
      mensagem: trimmed.mensagem
    };
  };

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
      const payload = buildPayload({ nome, empresa, email, mensagem });

      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Falha ao enviar email (status ${response.status}).`);
      }

      const result = await response.json().catch(() => ({}));
      if (!result.success) {
        const reason = typeof result.error === 'string' ? result.error : 'O serviço não confirmou o envio do email.';
        throw new Error(reason);
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
