# Site CAS It Solutions

Página institucional estática que apresenta os serviços, projetos e liderança da CAS It Solutions, com foco em transformação digital e soluções de tecnologia sob medida.

## Visão Geral
- Hero com mensagem de valor, CTA e destaques das entregas.
- Sessões para serviços, cases, sócios e formulário de contato.
- Layout responsivo e tipografia baseada na família `Inter`.
- Paleta de cores que reforça confiança e modernidade para empresas B2B.

## Estrutura do Projeto
```text
.
├── index.html      # Estrutura da página e conteúdo principal
├── styles.css      # Estilos globais e componentes reutilizáveis
└── images/
    └── Logo.jpeg   # Logotipo exibido no cabeçalho e rodapé
```

## Tecnologias Utilizadas
- HTML5 semântico para SEO e acessibilidade básica.
- CSS3 modularizado com variáveis para fácil manutenção.
- Google Fonts (`Inter`) para consistência tipográfica.

## Seções do Site
- **Início:** navegação principal e mensagem hero com CTAs.
- **Serviços:** cards descrevendo as ofertas chave de consultoria, engenharia e operações.
- **Projetos:** cases resumidos por segmento (telecom, varejo, indústria).
- **Sócios:** perfis dos fundadores com links para LinkedIn.
- **Contato:** lista de serviços, formulário estático e canais diretos.
- **Rodapé:** informações de contato e créditos.

## Como Executar Localmente
1. Clone ou faça download deste repositório.
2. Abra o arquivo `index.html` diretamente no navegador **ou** sirva o diretório com um servidor estático, por exemplo:
   ```bash
   npx serve .
   ```
3. Acesse `http://localhost:3000` (ou a porta exibida pelo servidor).

## Personalização
- Ajuste textos e seções em `index.html`.
- Atualize cores, espaçamentos ou componentes em `styles.css`, usando as variáveis declaradas em `:root`.
- Substitua `images/Logo.jpeg` para aplicar uma marca própria (mantenha o tamanho aproximado para preservar o layout).

## Deploy
- Hospede os arquivos em qualquer provedor de conteúdo estático (GitHub Pages, Netlify, Vercel, S3, etc.).
- Garanta que o diretório `images` seja enviado junto com `index.html` e `styles.css`.

## Contato
Em caso de dúvidas ou sugestões, envie um e-mail para `cesar@casitsolutions.com`.
