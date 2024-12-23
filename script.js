// Seleciona o formulário
const form = document.getElementById("meuFormulario");

// Adiciona o evento de envio
form.addEventListener("submit", async function (evento) {
    evento.preventDefault(); // Impede o comportamento padrão do envio

    // Captura os valores dos campos
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // Seleciona a div onde a mensagem será exibida
    const mensagemDiv = document.getElementById("mensagem");

    // Reseta a mensagem antes de enviar
    mensagemDiv.textContent = "";

    try {
        // Envia os dados ao backend
        const resposta = await fetch("/inscrever", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome, email, phone }), // Envia os dados como JSON
        });

        // Tenta processar a resposta como JSON
        const dados = await resposta.json().catch(() => {
            throw new Error("Resposta inválida do servidor.");
        });

        if (resposta.ok) {
            mensagemDiv.style.color = "green"; // Define a cor da mensagem para verde
            mensagemDiv.textContent = dados.mensagem; // Exibe a mensagem de sucesso
            form.reset(); // Limpa o formulário
        } else {
            mensagemDiv.style.color = "red"; // Define a cor da mensagem para vermelho
            mensagemDiv.textContent = dados.mensagem || "Erro ao realizar a inscrição."; // Exibe a mensagem de erro
        }
    } catch (erro) {
        console.error("Erro no envio:", erro.message);
        mensagemDiv.style.color = "red";
        mensagemDiv.textContent = "Erro ao processar sua inscrição. Tente novamente mais tarde.";
    }
});



