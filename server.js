import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTACT_EMAIL = 'cesar@casitsolutions.com.br';
const FROM_EMAIL = 'CAS It Solutions <onboarding@resend.dev>';
const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_MwLJ73NS_63Ni3wR6zZbB13EFHiiagyqK';

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (char) =>
    ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char] || char
  );

const buildEmailContent = ({ nome, empresa, email, mensagem }) => {
  const safeNome = escapeHtml(nome);
  const safeEmpresa = escapeHtml(empresa);
  const safeEmail = escapeHtml(email);
  const safeMensagem = escapeHtml(mensagem);

  const html = [
    '<h2>Novo contato via Fale Conosco</h2>',
    '<p>Um usuário preencheu todos os campos do formulário.</p>',
    '<table style="border-collapse:collapse;width:100%;max-width:520px;">',
    '<tbody>',
    `<tr><td style="padding:8px 12px;border:1px solid #d1d5db;font-weight:600;">Nome</td><td style="padding:8px 12px;border:1px solid #d1d5db;">${safeNome}</td></tr>`,
    `<tr><td style="padding:8px 12px;border:1px solid #d1d5db;font-weight:600;">Empresa</td><td style="padding:8px 12px;border:1px solid #d1d5db;">${safeEmpresa}</td></tr>`,
    `<tr><td style="padding:8px 12px;border:1px solid #d1d5db;font-weight:600;">E-mail</td><td style="padding:8px 12px;border:1px solid #d1d5db;">${safeEmail}</td></tr>`,
    `<tr><td style="padding:8px 12px;border:1px solid #d1d5db;font-weight:600;">Mensagem</td><td style="padding:8px 12px;border:1px solid #d1d5db;white-space:pre-wrap;">${safeMensagem}</td></tr>`,
    '</tbody>',
    '</table>'
  ].join('');

  const text = [
    'Novo contato via Fale Conosco',
    '',
    `Nome: ${nome}`,
    `Empresa: ${empresa}`,
    `E-mail: ${email}`,
    '',
    'Mensagem:',
    mensagem
  ].join('\n');

  return { html, text };
};

app.use(express.json());
app.use(express.static(__dirname, { extensions: ['html'] }));

app.post('/api/contact', async (req, res) => {
  const { nome, empresa, email, mensagem } = req.body || {};

  if (![nome, empresa, email, mensagem].every((field) => typeof field === 'string' && field.trim().length > 0)) {
    return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios.' });
  }

  const trimmed = {
    nome: nome.trim(),
    empresa: empresa.trim(),
    email: email.trim(),
    mensagem: mensagem.trim()
  };

  if (!RESEND_API_KEY) {
    return res.status(500).json({ success: false, error: 'Chave da API Resend não configurada.' });
  }

  const { html, text } = buildEmailContent(trimmed);

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [CONTACT_EMAIL],
        reply_to: trimmed.email,
        subject: 'Novo contato recebido - Fale Conosco',
        html,
        text
      })
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = payload?.message || payload?.error || 'Erro ao comunicar com o serviço de email.';
      console.error('Resend API error:', message, payload);
      return res.status(response.status).json({ success: false, error: message });
    }

    if (!payload.id) {
      console.error('Resposta sem ID do Resend:', payload);
      return res.status(502).json({ success: false, error: 'O serviço não confirmou o envio do email.' });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Erro ao enviar email via Resend:', error);
    return res.status(500).json({ success: false, error: 'Não foi possível enviar o email. Tente novamente em instantes.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
