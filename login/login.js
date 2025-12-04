// ===== ESTADOS VISUAIS DO CARD DE LOGIN =====
const ESTADOS_LOGIN = {
  OPERANDO: {
    className: "state-operando",
    label: "OPERANDO",
  },
  VACACIONES: {
    className: "state-vacaciones",
    label: "VACACIONES",
  },
  RECESO: {
    className: "state-receso",
    label: "RECESO",
  },
  TERMINADO: {
    className: "state-terminado",
    label: "TERMINADO",
  },
};

const loginCard = document.getElementById("loginCard");
const statusText = document.getElementById("statusText");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

// Função para aplicar estado (borda + pill)
function aplicarEstadoLogin(estado) {
  const cfg = ESTADOS_LOGIN[estado];
  if (!cfg || !loginCard || !statusText) return;

  // remove todas as classes de estado
  Object.values(ESTADOS_LOGIN).forEach((s) => {
    loginCard.classList.remove(s.className);
  });
  // aplica o estado atual
  loginCard.classList.add(cfg.className);
  statusText.textContent = cfg.label;
}

// Deixo disponível no window para testes via console, se quiser
window.aplicarEstadoLogin = aplicarEstadoLogin;

// Estado padrão visual do login
aplicarEstadoLogin("OPERANDO");

// ===== USUÁRIO PADRÃO DE TESTE =====
const VALID_USER = "admin";     // usuário de teste
const VALID_PASS = "123";        // senha de teste

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const username = usernameInput ? usernameInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";
    // limpa mensagem de erro
    if (loginError) {
      loginError.classList.remove("show");
    }
    // valida usuário + senha
    if (username === VALID_USER && password === VALID_PASS) {
      // NOME DO TÉCNICO QUE VAI APARECER NA PRÓXIMA TELA
      const nombreTecnico = "JORGE COY"; // podes mudar aqui se quiser
      const url =
        "../fichajes/fichaje-inicio.html?user=" +
        encodeURIComponent(nombreTecnico) +
        "&estado=" +
        encodeURIComponent("OPERANDO");
      window.location.href = url;
    } else {
      // credenciais incorretas
      if (loginError) {
        loginError.classList.add("show");
      }
    }
  });
}
