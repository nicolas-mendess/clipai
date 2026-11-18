# ClipAI — Protótipo visual

Protótipo acadêmico de uma plataforma para organizar vídeos e demonstrar um fluxo de criação de cortes orientado por instruções. Construído com **HTML, CSS e JavaScript puro**, sem framework e sem dependências de build.

> **Importante:** esta versão é somente um protótipo de interface. Ela não executa IA, não transcreve nem analisa vídeos, não importa lives de plataformas externas e não renderiza arquivos de vídeo. O botão de geração adiciona cortes fictícios para demonstrar a experiência. As ações de download geram um arquivo `.txt` explicativo, não um vídeo.

## 1. Estrutura de pastas

```text
clipai/
├── index.html          # Aplicação principal: dashboard, projeto, biblioteca e contato
├── login.html          # Tela de login demonstrativa
├── README.md           # Documentação do projeto
├── css/
│   └── styles.css      # Estilos, layout responsivo, temas e acessibilidade
├── js/
│   ├── app.js          # Navegação e interações da aplicação
│   └── login.js        # Interações demonstrativas da tela de login
└── assets/
    └── logo.svg        # Marca vetorial do ClipAI
```

## 2. Como executar

1. Baixe e extraia o arquivo `clipai-prototipo.zip`.
2. Abra a pasta `clipai` no Visual Studio Code (ou outro editor).
3. Abra `index.html` no navegador. Para uma experiência de desenvolvimento melhor, use a extensão **Live Server** do Visual Studio Code.
4. Para testar a tela de login, selecione o avatar ou abra `login.html`.

Não é necessário instalar Node.js, React ou pacotes adicionais.

## 3. Funcionalidades demonstrativas

- Navegação entre Visão geral, Novo projeto, Meus cortes e Contato.
- Cards com projetos recentes e estatísticas ilustrativas.
- Busca por projetos e cortes, com atalho `Ctrl + K` (ou `⌘ + K`).
- Filtros de biblioteca: todos, concluídos e em análise.
- Seleção de arquivo de vídeo e área de arrastar e soltar. O arquivo não é enviado a um servidor.
- Campo de link ilustrativo e instruções de corte com contador de caracteres.
- Opções de duração, formato, legendas, destaque de palavras e quantidade de cortes.
- Geração de cartões fictícios de resultados.
- Formulário de contato com validação do navegador; nenhuma mensagem é enviada.
- Página de login com validação visual, mostrar/ocultar senha e mensagens de demonstração.
- Alternância entre tema escuro e claro, com preferência salva no navegador.
- Painel de acessibilidade com tamanho de fonte, contraste reforçado e redução de movimento.
- Layout adaptado para desktop, tablet e celular.

## 4. Acessibilidade e usabilidade

Foram incluídos elementos semânticos (`header`, `nav`, `main`, `section`, `footer`), rótulos para campos, textos alternativos adequados para a marca, foco de teclado visível, link para pular ao conteúdo, estados acessíveis em botões e navegação, mensagens com `aria-live` e suporte à preferência de redução de movimento do sistema.

O protótipo procura seguir boas práticas inspiradas nas WCAG, mas **a conformidade WCAG não foi certificada**. Antes da entrega, faça testes de contraste com uma ferramenta como o WebAIM Contrast Checker e testes manuais de teclado e leitor de tela.

## 5. Próximas etapas para um produto real

1. Definir backend, autenticação e armazenamento seguro.
2. Integrar transcrição de áudio e análise de conteúdo para localizar momentos de interesse.
3. Implementar processamento e renderização dos cortes (por exemplo, com FFmpeg em um serviço de backend).
4. Integrar fontes de vídeo e lives respeitando APIs, direitos autorais, termos de uso e permissões.
5. Criar exportação real em MP4, legendas editáveis e histórico persistente.
6. Testar acessibilidade, segurança, desempenho e compatibilidade em navegadores.

## 6. Tecnologias

- HTML5
- CSS3 (Grid, Flexbox, variáveis CSS e media queries)
- JavaScript (ES6+)
- SVG para a marca
- Google Fonts: DM Sans e Manrope (com fontes de sistema como fallback)

## 7. Git e GitHub

Na pasta do projeto, execute:

```bash
git init
git add .
git commit -m "Cria protótipo visual inicial do ClipAI"
```

Depois crie um repositório no GitHub e conecte-o conforme as instruções apresentadas pela plataforma.
