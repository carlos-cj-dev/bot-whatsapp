import React, { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

function App() {
  const [phoneNumber, setPhoneNumber] = useState('')

  // Dados mocados para o gráfico de colunas
  const barChartData = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
    datasets: [
      {
        label: 'Vendas (R$)',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        backgroundColor: [
          'rgba(37, 211, 102, 0.8)',
          'rgba(37, 211, 102, 0.7)',
          'rgba(37, 211, 102, 0.6)',
          'rgba(37, 211, 102, 0.5)',
          'rgba(37, 211, 102, 0.4)',
          'rgba(37, 211, 102, 0.3)',
        ],
        borderColor: [
          'rgba(37, 211, 102, 1)',
          'rgba(37, 211, 102, 1)',
          'rgba(37, 211, 102, 1)',
          'rgba(37, 211, 102, 1)',
          'rgba(37, 211, 102, 1)',
          'rgba(37, 211, 102, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  }

  // Dados mocados para o gráfico de pizza
  const pieChartData = {
    labels: ['Produto A', 'Produto B', 'Produto C', 'Produto D', 'Outros'],
    datasets: [
      {
        label: 'Participação no Mercado (%)',
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        borderWidth: 2,
      },
    ],
  }

  // Opções para o gráfico de colunas
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Vendas Mensais',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'R$ ' + value.toLocaleString('pt-BR')
          },
        },
      },
    },
  }

  // Opções para o gráfico de pizza
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Participação por Produto',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%'
          },
        },
      },
    },
  }

  // Função para formatar o número de telefone
  const formatPhoneNumber = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Aplica formatação (XX) XXXXX-XXXX
    if (numbers.length <= 2) {
      return `(${numbers}`
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
  }



  // Função para enviar dados para o webhook
  const sendToWebhook = async (chartType) => {
    if (!phoneNumber) {
      alert('Por favor, digite seu número de celular!')
      return
    }

    // Remove formatação do número
    const cleanNumber = phoneNumber.replace(/\D/g, '')
    
    if (cleanNumber.length < 10) {
      alert('Por favor, digite um número de celular válido!')
      return
    }

    // Preparar dados baseados no tipo de gráfico escolhido
    let chartData = {}
    
    if (chartType === 'vendas') {
      chartData = {
        tipo: 'Gráfico de Vendas Mensais',
        dados: {
          labels: barChartData.labels,
          valores: barChartData.datasets[0].data,
          total: barChartData.datasets[0].data.reduce((acc, curr) => acc + curr, 0),
          media: (barChartData.datasets[0].data.reduce((acc, curr) => acc + curr, 0) / barChartData.datasets[0].data.length).toFixed(0)
        }
      }
    } else if (chartType === 'produtos') {
      chartData = {
        tipo: 'Gráfico de Participação por Produto',
        dados: {
          labels: pieChartData.labels,
          percentuais: pieChartData.datasets[0].data
        }
      }
    }

    // Dados para enviar ao webhook
    const webhookData = {
      numero_whatsapp: cleanNumber,
      numero_formatado: phoneNumber,
      grafico_escolhido: chartData,
      timestamp: new Date().toISOString(),
      origem: 'MIPI Analytics'
    }

    try {
      console.log('📤 Enviando dados para webhook:', webhookData)
      
      const response = await fetch('https://alpha.n8n.alphaia.ai/webhook-test/243a7c8c-fcbe-438b-a9d4-6473f20a65fc', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(webhookData)
      })

      console.log('📥 Resposta do webhook:', response.status, response.statusText)

      if (response.ok) {
        const responseData = await response.text()
        console.log('✅ Dados da resposta:', responseData)
        alert(`✅ Dados do ${chartData.tipo} enviados com sucesso!`)
      } else {
        const errorData = await response.text()
        console.error('❌ Erro na resposta:', response.status, errorData)
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('🚨 Erro completo ao enviar dados:', error)
      
      // Verificar se é erro de CORS ou rede
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert('❌ Erro de conectividade. Possíveis causas:\n• Problema de CORS no webhook\n• Webhook indisponível\n• Problema de rede\n\nVerifique o console para mais detalhes.')
      } else {
        alert(`❌ Erro ao enviar dados: ${error.message}`)
      }
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>📊 MIPI Analytics</h1>
        <p>Visualização de Dados e Relatórios Inteligentes</p>
      </div>
      
      <div className="content">
        {/* Seção de input do telefone */}
        <div className="phone-input-section">
          <h2>📱 Digite seu número de celular</h2>
          <input
            type="text"
            className="phone-input"
            placeholder="(11) 99999-9999"
            value={phoneNumber}
            onChange={handlePhoneChange}
            maxLength={15}
          />
          <p className="phone-hint">
            Os dados serão enviados para o sistema com este número
          </p>

        </div>

        {/* Seção dos gráficos */}
        <div className="charts-section">
          {/* Gráfico de Colunas */}
          <div className="chart-container">
            <h3>📊 Vendas Mensais</h3>
            <div className="chart-wrapper">
              <Bar data={barChartData} options={barOptions} />
            </div>
            <button 
              className="chart-button"
              onClick={() => sendToWebhook('vendas')}
            >
              📈 Enviar Relatório de Vendas
            </button>
          </div>

          {/* Gráfico de Pizza */}
          <div className="chart-container">
            <h3>🍰 Participação por Produto</h3>
            <div className="chart-wrapper">
              <Pie data={pieChartData} options={pieOptions} />
            </div>
            <button 
              className="chart-button"
              onClick={() => sendToWebhook('produtos')}
            >
              🍰 Enviar Relatório de Produtos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
