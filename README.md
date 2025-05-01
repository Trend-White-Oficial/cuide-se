# Cuide-Se

## Sobre o Projeto

Este repositório contém código proprietário da Cuide-Se. O acesso, uso, cópia ou distribuição deste código sem autorização expressa e por escrito da Cuide-Se é estritamente proibido.

## ⚠️ Aviso Legal

- Este código é propriedade exclusiva da Cuide-Se.
- Nenhuma parte deste código pode ser usada, copiada, modificada ou distribuída sem autorização expressa.
- O uso comercial deste código é exclusivo da Cuide-Se.
- Qualquer uso não autorizado será considerado violação de direitos autorais.
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
Este projeto é estritamente comercial e proprietário. O uso, cópia, modificação ou distribuição do software sem autorização expressa e por escrito da Cuide-Se é estritamente proibido. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- Desenvolvedor 1 - [@Trend-White](https://github.com/Trend-White-Oficial)

## 📞 Suporte

Para suporte, envie um email para cuide.se.ame@gmail.com ou abra uma issue no GitHub.
