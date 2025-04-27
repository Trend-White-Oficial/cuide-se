# Cuide-Se

Cuide-Se é uma plataforma que conecta mulheres a profissionais de estética, como cabeleireiras, manicures, podólogas e outros especialistas em beleza.

## 🚀 Funcionalidades

- Busca de profissionais por especialidade e localização
- Agendamento de serviços
- Avaliações e comentários
- Perfis profissionais detalhados
- Sistema de notificações
- Área do cliente e do profissional

## 🛠️ Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/UI
- React Query
- React Router
- Axios
- Date-fns

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Trend-White-Oficial/cuide-se
cd cuide-se
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   VITE_MP_PUBLIC_KEY=APP_USR-a41aa369-d387-409f-8096-2e301682605e
   VITE_MP_ACCESS_TOKEN=APP_USR-7734106620460643-042612-bd8043870828206336fbffc5255d4291-273629982
   VITE_MP_WEBHOOK_SECRET=132b873ba514b7e6cf35c4d7f113abb5239c35907fca5dc3c8b8c6326ab987ce
```bash
cp .env.example .env
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🏗️ Estrutura do Projeto
src/
├── components/ # Componentes React
│ ├── layout/ # Componentes de layout
│ ├── features/ # Componentes específicos de funcionalidades
│ └── shared/ # Componentes reutilizáveis
├── pages/ # Páginas da aplicação
├── hooks/ # Hooks personalizados
├── services/ # Serviços de API
├── utils/ # Funções utilitárias
├── types/ # Tipos TypeScript
├── constants/ # Constantes
└── styles/ # Estilos globais


## 🔧 Configuração

### Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDklA9Pqn1E0jq_Kzp508RX_SbrSwppDVs
```

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera o build de produção
- `npm run preview`: Visualiza o build de produção
- `npm run lint`: Executa o linter
- `npm run test`: Executa os testes

## 📱 Páginas

- `/`: Página inicial
- `/search`: Busca de profissionais
- `/professional/:id`: Perfil do profissional
- `/login`: Login
- `/register`: Registro
- `/profile`: Perfil do usuário

## 🎨 Tema e Estilos

O projeto utiliza Tailwind CSS com um tema personalizado. As cores principais são:

- Rosa (Primary): #FF69B4
- Rosa Claro (Primary Light): #FFB6C1
- Rosa Escuro (Primary Dark): #DB7093

## 🔒 Autenticação

O sistema utiliza JWT para autenticação. Os tokens são armazenados no localStorage e são automaticamente incluídos nas requisições à API.

## 📊 Estado da Aplicação

O gerenciamento de estado é feito através do React Query para dados do servidor e Context API para estado global da aplicação.

## 🧪 Testes

Para executar os testes:

```bash
npm run test
```

## 📦 Build

Para gerar o build de produção:

```bash
npm run build
```

O build será gerado na pasta `dist/`.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- Desenvolvedor 1 - [@usuario1](https://github.com/Trend-White-Oficial)

## 📞 Suporte

Para suporte, envie um email para cuide.se.ame@gmail.com ou abra uma issue no GitHub.
