# Site CAS It Solutions

Aplicação institucional da CAS It Solutions, agora estruturada em camadas de front-end estático e back-end em Node.js/Express para envio de mensagens via API da Resend.

## Visão Geral
- Hero com mensagem de valor, CTA e destaques das entregas.
- Sessões para serviços, cases, sócios e formulário de contato.
- Layout responsivo e tipografia baseada na família `Inter`.
- Paleta de cores que reforça confiança e modernidade para empresas B2B.

## Estrutura do Projeto
```text
.
├── public/                      # Arquivos acessíveis pelo navegador
│   ├── index.html               # Estrutura da página e conteúdo principal
│   └── assets/
│       ├── css/styles.css       # Estilos globais e componentes reutilizáveis
│       ├── js/contact.js        # Lógica do formulário de contato (fetch POST)
│       └── images/Logo.jpeg     # Logotipo exibido no cabeçalho e rodapé
├── src/
│   └── server.js                # Servidor Express + integração com Resend
├── package.json                 # Scripts e dependências do projeto
└── README.md
```

## Tecnologias Utilizadas
- HTML5 semântico para SEO e acessibilidade básica.
- CSS3 modularizado com variáveis para fácil manutenção.
- JavaScript modular no navegador para submissão AJAX do formulário.
- Node.js + Express para servir o site e encaminhar mensagens via Resend.

## Seções do Site
- **Início:** navegação principal e mensagem hero com CTAs.
- **Serviços:** cards descrevendo as ofertas chave de consultoria, engenharia e operações.
- **Projetos:** cases resumidos por segmento (telecom, varejo, indústria).
- **Sócios:** perfis dos fundadores com links para LinkedIn.
- **Contato:** lista de serviços, formulário dinâmico e canais diretos.
- **Rodapé:** informações de contato e créditos.

## Como Executar Localmente
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Defina a variável de ambiente da Resend (obrigatória em produção):
   ```bash
   export RESEND_API_KEY="sua_chave_resend"
   ```
   > Sem essa variável o servidor responde com erro ao tentar enviar e-mails.
3. Inicie o servidor Express:
   ```bash
   npm start
   ```
4. Acesse `http://localhost:3000` no navegador.

## Personalização
- Ajuste textos e seções em `public/index.html`.
- Atualize cores, espaçamentos ou componentes em `public/assets/css/styles.css`, usando as variáveis declaradas em `:root`.
- Substitua `public/assets/images/Logo.jpeg` por outra marca (mantenha proporções semelhantes).
- Para alterar mensagens de feedback ou regras do formulário edite `public/assets/js/contact.js`.

## Deploy
1. Configure a variável `RESEND_API_KEY` na plataforma de hospedagem.
2. Faça o deploy do servidor Node (Render, Railway, Fly.io, Vercel com adaptador, etc.) apontando para `npm start`.
3. Garanta que a pasta `public/` esteja acessível pelo servidor, pois é dela que os arquivos estáticos são servidos.

## Contato
Em caso de dúvidas ou sugestões, envie um e-mail para `cesar@casitsolutions.com`.
