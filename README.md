# Bot WhatsApp MIPI 📊

Uma aplicação React moderna para visualização de dados com gráficos interativos e integração com WhatsApp.

## Funcionalidades

- ✅ Campo para inserir número de celular com formatação automática
- ✅ Gráfico de colunas com dados de vendas mensais
- ✅ Gráfico de pizza com participação por produto
- ✅ **2 botões separados** - um para cada gráfico
- ✅ **Integração com webhook N8N** para envio de dados
- ✅ Design responsivo e moderno
- ✅ Dados mocados para demonstração

## Como executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação e execução

1. **Instalar dependências:**
```bash
npm install
```

2. **Executar em modo de desenvolvimento:**
```bash
npm run dev
```

3. **Abrir no navegador:**
   - Acesse `http://localhost:5173`

4. **Build para produção:**
```bash
npm run build
```

## Como usar

1. **Digite seu número de celular** no campo fornecido (com formatação automática)
2. **Visualize os gráficos** com dados mocados:
   - Gráfico de colunas: Vendas mensais de Janeiro a Junho
   - Gráfico de pizza: Participação por produto no mercado
3. **Clique no botão do gráfico desejado**:
   - "📈 Enviar Relatório de Vendas" - envia dados do gráfico de colunas
   - "🍰 Enviar Relatório de Produtos" - envia dados do gráfico de pizza
4. **Os dados são enviados automaticamente** para o webhook N8N configurado

## Tecnologias utilizadas

- **React 18** - Framework JavaScript
- **Vite** - Build tool e dev server
- **Chart.js** - Biblioteca para gráficos
- **React-ChartJS-2** - Wrapper React para Chart.js
- **CSS3** - Estilização com gradientes e animações
- **N8N Webhook** - Integração para envio de dados

## Webhook Integration

### Endpoint configurado:
```
https://alpha.n8n.alphaia.ai/webhook-test/243a7c8c-fcbe-438b-a9d4-6473f20a65fc
```

### Estrutura dos dados enviados:

**Para Gráfico de Vendas:**
```json
{
  "numero_whatsapp": "11999999999",
  "numero_formatado": "(11) 99999-9999",
  "grafico_escolhido": {
    "tipo": "Gráfico de Vendas Mensais",
    "dados": {
      "labels": ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"],
      "valores": [12000, 19000, 15000, 25000, 22000, 30000],
      "total": 123000,
      "media": "20500"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "origem": "MIPI Analytics"
}
```

**Para Gráfico de Produtos:**
```json
{
  "numero_whatsapp": "11999999999",
  "numero_formatado": "(11) 99999-9999",
  "grafico_escolhido": {
    "tipo": "Gráfico de Participação por Produto",
    "dados": {
      "labels": ["Produto A", "Produto B", "Produto C", "Produto D", "Outros"],
      "percentuais": [30, 25, 20, 15, 10]
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "origem": "MIPI Analytics"
}
```

## Estrutura do projeto

```
src/
├── App.jsx          # Componente principal
├── main.jsx         # Ponto de entrada
└── index.css        # Estilos globais
```

## Dados mocados

### Vendas Mensais (Gráfico de Colunas)
- Janeiro: R$ 12.000
- Fevereiro: R$ 19.000
- Março: R$ 15.000
- Abril: R$ 25.000
- Maio: R$ 22.000
- Junho: R$ 30.000

### Participação por Produto (Gráfico de Pizza)
- Produto A: 30%
- Produto B: 25%
- Produto C: 20%
- Produto D: 15%
- Outros: 10%
