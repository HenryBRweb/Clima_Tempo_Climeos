// Importar os módulos necessários
const express = require('express');
const axios = require('axios');
const path = require ('path');
const cors = require ('cors');
const config = require('./config.json');

// Extrair a chave da API do arquivo de configuração
const apikey = config.apikey;

// Inicializar a aplicação Express
const app = express();

// Definir a porta para o servidor ouvir
app.listen(7777);

// Configuração dos middlewares
app.use(cors()); // Habilitar Compartilhamento de Recursos de Origem Cruzada (CORS)
app.use(express.json()); // Analisar solicitações JSON recebidas
app.use(express.static(path.join(__dirname, 'public'))); // Servir arquivos estáticos do diretório 'public'

// Dicionário de tradução para descrições de clima
const TraducaoClima = {
    // ... Mapeamentos de tradução para várias condições climáticas
    "Thunderstorm": "Tempestade",
    "thunderstorm with light rain": "Tempestade com chuva leve",
    "thunderstorm with rain": "Tempestade com chuva",
    "thunderstorm with heavy rain": "Tempestade com chuva intensa",
    "light thunderstorm": "Tempestade leve",
    "thunderstorm": "Tempestade",
    "heavy thunderstorm": "Tempestade intensa",
    "ragged thunderstorm": "Tempestade irregular",
    "thunderstorm with light drizzle": "Tempestade com garoa leve",
    "thunderstorm with drizzle": "Tempestade com garoa",
    "thunderstorm with heavy drizzle": "Tempestade com garoa intensa",
    "Drizzle": "Garoa",
    "light intensity drizzle": "Garoa de baixa intensidade",
    "drizzle": "Garoa",
    "heavy intensity drizzle": "Garoa de alta intensidade",
    "light intensity drizzle rain": "Chuva garoando de baixa intensidade",
    "drizzle rain": "Chuva garoando",
    "heavy intensity drizzle rain": "Chuva garoando de alta intensidade",
    "shower rain and drizzle": "Chuva forte e garoa",
    "heavy shower rain and drizzle": "Chuva forte e garoa intensa",
    "shower drizzle": "Garoa forte",
    "Rain": "Chuva",
    "light rain": "Chuva leve",
    "moderate rain": "Chuva moderada",
    "heavy intensity rain": "Chuva intensa",
    "very heavy rain": "Chuva muito intensa",
    "extreme rain": "Chuva extrema",
    "freezing rain": "Chuva congelante",
    "light intensity shower rain": "Chuva de baixa intensidade",
    "shower rain": "Chuva",
    "heavy intensity shower rain": "Chuva de alta intensidade",
    "ragged shower rain": "Chuva irregular",
    "Snow": "Neve",
    "light snow": "Neve leve",
    "snow": "Neve",
    "heavy snow": "Neve intensa",
    "sleet": "Aguaceiro",
    "light shower sleet": "Aguaceiro leve",
    "shower sleet": "Aguaceiro",
    "light rain and snow": "Chuva e neve leve",
    "rain and snow": "Chuva e neve",
    "light shower snow": "Neve e chuva leve",
    "shower snow": "Neve e chuva",
    "heavy shower snow": "Neve e chuva intensa",
    "Atmosphere": "Atmosfera",
    "mist": "Névoa",
    "smoke": "Fumaça",
    "haze": "Neblina",
    "sand/dust whirls": "Redemoinhos de areia/poeira",
    "fog": "Nevoeiro",
    "sand": "Areia",
    "dust": "Poeira",
    "volcanic ash": "Cinzas vulcânicas",
    "squalls": "Rajadas",
    "tornado": "Tornado",
    "Clear": "Céu limpo",
    "Clouds": "Nuvens",
    "few clouds": "Poucas nuvens",
    "scattered clouds": "Nuvens dispersas",
    "broken clouds": "Nuvens fragmentadas",
    "overcast clouds": "Nublado",
    "clear sky": "céu limpo"
  };

// Rota para buscar dados climáticos para uma cidade específica
app.get('/climatempo/:cidade', async (req, res) => {
    // Extrair o parâmetro da cidade da URL da requisição
    const city = req.params.cidade;

    try {
        // Fazer uma requisição GET para a API do OpenWeatherMap para buscar dados climáticos
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`);

        // Se a requisição for bem-sucedida (código de status 200)
        if (response.status === 200) {
            // Traduzir a descrição do clima usando o dicionário de tradução, retornando a descrição original se a tradução não for encontrada
            const clima = TraducaoClima[response.data.weather[0].description] || response.data.weather[0].description;

            // Construir URL para o ícone do clima
            const iconUrl = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`;

            // Preparar os dados climáticos para enviar na resposta
            const weatherData = {
                Cidade: req.params.cidade,
                Pais: response.data.sys.country,
                Temperatura: response.data.main.temp,
                Umidade: response.data.main.humidity,
                VelocidadeDoVento: response.data.wind.speed,
                Clima: clima,
                iconUrl: iconUrl
            };

            // Enviar os dados climáticos na resposta
            res.send(weatherData);
        } else {
            // Se a requisição não for bem-sucedida, enviar uma resposta de erro com o código de status apropriado
            res.status(response.status).send({ erro: "Erro ao obter dados metereológicos" });
        }
    } catch (error) {
        // Se ocorrer um erro durante a requisição, enviar uma resposta de erro do servidor interno com os detalhes do erro
        res.status(500).send({ erro: "Erro ao obter dados metereológicos", error });
    } 
});