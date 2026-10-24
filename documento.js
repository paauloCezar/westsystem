// ============================================================
// WestSystem - script das páginas de documento (termos e privacidade)
// Usa o número do WhatsApp que está em config.js.
// ============================================================

document.querySelectorAll(".js-whatsapp").forEach(function (link) {
  link.href = "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(WHATSAPP_MENSAGEM);
  link.target = "_blank";
  link.rel = "noopener";
});

document.getElementById("ano").textContent = new Date().getFullYear();
