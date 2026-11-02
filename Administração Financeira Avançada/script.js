// Menu hambúrguer
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");
hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    nav.classList.toggle("active");
});

// Tema claro/escuro
const toggleBtn = document.getElementById("theme-toggle");
try {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        toggleBtn.textContent = "☀️";
    }
} catch (e) {}
toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const dark = document.body.classList.contains("dark-mode");
    toggleBtn.textContent = dark ? "☀️" : "🌙";
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
});

// Botão Questões + quiz (usa a variável QUESTOES definida em cada unidade)
const secQ = document.getElementById("questoes");
document.getElementById("btn-questoes").addEventListener("click", () => {
    secQ.classList.add("aberto");
    secQ.scrollIntoView({ behavior: "smooth" });
});

let acertos = 0, respondidas = 0;
const lista = document.getElementById("lista-questoes");
const placar = document.getElementById("placar");
QUESTOES.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "questao";
    div.innerHTML = `<p><strong>${i + 1}.</strong> ${q.enunciado}</p>`;
    const exp = document.createElement("div");
    exp.className = "explicacao";
    exp.innerHTML = q.explicacao;
    q.opcoes.forEach((txt, j) => {
        const b = document.createElement("button");
        b.className = "opcao";
        b.textContent = txt;
        b.addEventListener("click", () => {
            div.querySelectorAll(".opcao").forEach(o => o.disabled = true);
            const botoes = div.querySelectorAll(".opcao");
            botoes[q.correta].classList.add("certa");
            if (j === q.correta) acertos++; else b.classList.add("errada");
            exp.style.display = "block";
            respondidas++;
            placar.textContent = `Acertos: ${acertos} de ${respondidas} respondidas (total: ${QUESTOES.length})`;
        });
        div.appendChild(b);
    });
    div.appendChild(exp);
    lista.appendChild(div);
});


// ===== Google Analytics (GA4): consentimento e eventos =====
function concederAnalytics() {
    if (window.gtag) gtag('consent', 'update', { analytics_storage: 'granted' });
}
let escolha = null;
try { escolha = localStorage.getItem("consent_analytics"); } catch (e) {}
if (escolha === "granted") concederAnalytics();

if (!escolha) {
    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.innerHTML = `<p>Usamos cookies de análise (Google Analytics) para entender como o material é usado e melhorá-lo. Nenhum dado pessoal é solicitado.</p>
        <div><button class="btn" id="cookie-aceitar">Aceitar</button> <button class="btn" id="cookie-recusar">Recusar</button></div>`;
    document.body.appendChild(banner);
    const salvar = (v) => {
        try { localStorage.setItem("consent_analytics", v); } catch (e) {}
        if (v === "granted") concederAnalytics();
        banner.remove();
    };
    document.getElementById("cookie-aceitar").addEventListener("click", () => salvar("granted"));
    document.getElementById("cookie-recusar").addEventListener("click", () => salvar("denied"));
}

const unidade = document.body.dataset.unidade;
let abriuQuestoes = false, respondeuAlguma = false;

function evento(nome, extras) {
    if (window.gtag) gtag('event', nome, Object.assign({ unidade }, extras));
}

document.getElementById("btn-questoes").addEventListener("click", () => {
    abriuQuestoes = true;
    evento("clicou_questoes");
});

document.getElementById("lista-questoes").addEventListener("click", (e) => {
    if (e.target.classList.contains("opcao") && !respondeuAlguma) {
        respondeuAlguma = true;
        evento("respondeu_questao");
    }
});

document.getElementById("btn-avancar").addEventListener("click", () => {
    evento("clicou_avancar", {
        fez_questoes: respondeuAlguma ? "sim" : (abriuQuestoes ? "abriu_sem_responder" : "nao"),
        transport_type: "beacon"
    });
});

document.getElementById("btn-formulario").addEventListener("click", () => evento("clicou_formulario"));
