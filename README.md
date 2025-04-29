# Cuide-Se

## Sobre o Projeto
O Cuide-Se é uma plataforma que conecta mulheres a profissionais de estética, permitindo agendamentos, avaliações e gerenciamento de serviços de forma prática e segura.

## 🚀 Funcionalidades

- Busca de profissionais por especialidade e localização
- Agendamento de serviços
- Avaliações e comentários
- Perfis profissionais detalhados
- Sistema de notificações
- Área do cliente e do profissional

## Estrutura do Projeto
- **components/**: Componentes reutilizáveis e específicos de funcionalidades.
- **hooks/**: Hooks personalizados para lógica reutilizável.
- **services/**: Serviços de API e integração com back-end.
- **utils/**: Funções utilitárias para validações e formatações.
- **pages/**: Páginas principais da aplicação.
- **constants/**: Constantes globais usadas em todo o projeto.

## 🛠️ Tecnologias

- **Frontend**: React, TypeScript, Tailwind CSS
- **Mobile**: React Native, Expo
- **Testes**: Vitest, Jest

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
   Copie o arquivo `.env.example` para `.env` e preencha as chaves necessárias:
   ```bash
   cp .env.example .env
   ```

   Exemplo de variáveis de ambiente:
   ```env
   VITE_MP_PUBLIC_KEY=YOUR_PUBLIC_KEY
   VITE_MP_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
   VITE_MP_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
   ```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

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

## 🤝 Como Contribuir
1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`).
4. Push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## 📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- Desenvolvedor 1 - [@usuario1](https://github.com/Trend-White-Oficial)

## 📞 Suporte

Para suporte, envie um email para cuide.se.ame@gmail.com ou abra uma issue no GitHub.
