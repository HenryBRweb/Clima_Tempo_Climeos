// Selecionando os elementos do DOM pelos seus IDs
const temperaturaid = document.getElementById("temperaturaid");
const umidadeid = document.getElementById("umidadeid");
const velocidadedoventoid = document.getElementById("velocidadedoventoid");
const climadesid = document.getElementById("climadesid");

// Adicionando um evento de envio ao formulário com o ID "formClima"
document.getElementById("formClima").addEventListener("submit", function (event) {
  event.preventDefault(); // Impedindo o comportamento padrão do formulário

  // Obtendo o valor digitado no campo de entrada com o ID "cityInput"
  const city = document.getElementById("cityInput").value;

  // Fazendo uma solicitação fetch para a API local com base na cidade fornecida
  fetch(`http://localhost:7777/climatempo/${city}`)
    .then((response) => response.json()) // Convertendo a resposta para JSON
    .then((data) => { // Manipulando os dados recebidos
      const tempoResult = document.getElementById("climaResult", "climeostil");
      if (data.Temperatura) { // Verificando se os dados de temperatura estão disponíveis
        const imgUrl = `https://flagsapi.com/${data.Pais}/flat/64.png`;

        // Atualizando os elementos HTML com os dados recebidos
        document.getElementById("city").textContent = data.Cidade.charAt(0).toUpperCase() + data.Cidade.slice(1);
        document.getElementById("temperaturaid").textContent = `${data.Temperatura}ºC`;
        document.getElementById("umidadeid").textContent = data.Umidade;
        document.getElementById("velocidadedoventoid").textContent = `${data.VelocidadeDoVento}m/s`;
        document.getElementById("climaid").textContent = data.Clima;
        document.getElementById("iconeFeito").src = data.iconUrl;
        document.getElementById("pais-icon").src = imgUrl;
      } else { // Caso os dados não estejam disponíveis, exibir uma mensagem de erro
        tempoResult.innerHTML = "Erro ao obter dados metereológicos";
      }
    })
    .catch((error) => console.error("Erro ao obter dados")); // Capturando erros na solicitação
});

// Função para atualizar o horário exibido no elemento com o ID "horario"
function atualizarHorario() {
  var agora = new Date();
  var hora = agora.getHours();
  var minutos = agora.getMinutes();
  var segundos = agora.getSeconds();

  // Adicionando zeros à esquerda para manter o formato hh:mm:ss
  hora = hora < 10 ? "0" + hora : hora;
  minutos = minutos < 10 ? "0" + minutos : minutos;
  segundos = segundos < 10 ? "0" + segundos : segundos;

  var horarioAtual = hora + ":" + minutos;

  // Atualizando o elemento HTML com o horário atualizado
  document.getElementById("horario").innerHTML = horarioAtual;
}

// Chamando a função atualizarHorario a cada segundo para manter o horário atualizado
setInterval(atualizarHorario, 1000);

// Chamando a função atualizarHorario uma vez para exibir o horário inicial
atualizarHorario();