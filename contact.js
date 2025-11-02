document.addEventListener('DOMContentLoaded', () => {
  const RESEND_ENDPOINT = 'https://api.resend.com/emails';
  const RESEND_API_KEY = 're_MwLJ73NS_63Ni3wR6zZbB13EFHiiagyqK';

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
  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[char] || char
    );

  const buildEmailPayload = ({ nome, empresa, email, mensagem }) => {
    const trimmed = {
      nome: nome.trim(),
      empresa: empresa.trim(),
      email: email.trim(),
      mensagem: mensagem.trim()
    };

    const html = `
      <h2>Novo contato via Fale Conosco</h2>
      <p>Um usuário preencheu todos os campos do formulário.</p>
      <table style="border-collapse:collapse;width:100%;max-width:520px;">
        <tbody>
          <tr>
            <td style="padding:8px 12px;border:1px solid #d1d5db;font-weight:600;">Nome</td>
            <td style="padding:8px 12px;border:1px solid #d1d5db;">${escapeHtml(trimmed.nome)}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border:1px solid #d1d5db;font-weight:600;">Empresa</td>
            <td style="padding:8px 12px;border:1px solid #d1d5db;">${escapeHtml(trimmed.empresa)}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border:1px solid #d1d5db;font-weight:600;">E-mail</td>
            <td style="padding:8px 12px;border:1px solid #d1d5db;">${escapeHtml(trimmed.email)}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border:1px solid #d1d5db;font-weight:600;">Mensagem</td>
            <td style="padding:8px 12px;border:1px solid #d1d5db;white-space:pre-wrap;">${escapeHtml(trimmed.mensagem)}</td>
          </tr>
        </tbody>
      </table>
    `;

    const text = [
      'Novo contato via Fale Conosco',
      '',
      `Nome: ${trimmed.nome}`,
      `Empresa: ${trimmed.empresa}`,
      `E-mail: ${trimmed.email}`,
      '',
      'Mensagem:',
      trimmed.mensagem
    ].join('\n');

    return {
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      reply_to: trimmed.email,
      subject: 'Novo contato recebido - Fale Conosco',
      html,
      text
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
      const payload = buildEmailPayload({ nome, empresa, email, mensagem });

      const response = await fetch(RESEND_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Falha ao enviar email (status ${response.status}).`);
      }

      const result = await response.json().catch(() => ({}));
      if (!result.id) {
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
