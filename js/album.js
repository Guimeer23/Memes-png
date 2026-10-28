/* Orquestrador da aplicação. Os módulos são carregados em ordem para preservar dependências existentes. */
(async function loadAlbumModules(){
  const modules = [
    "js/modules/00-core-and-album-state.js",
    "js/modules/01-navigation-and-radial-tabs.js",
    "js/modules/02-album-actions.js",
    "js/modules/03-visual-effects.js",
    "js/modules/04-missions-and-daily-bonus.js",
    "js/modules/05-pricing.js",
    "js/modules/06-card-view-and-animations.js",
    "js/modules/07-packs-and-opening.js",
    "js/modules/08-coin-shop.js",
    "js/modules/09-pack-effects.js",
    "js/modules/10-auth-and-cloud-save.js",
    "js/modules/11-trades-and-market.js",
    "js/modules/12-secrets-and-profile.js",
    "js/modules/13-friends-and-ranking.js",
    "js/modules/14-settings-and-navigation-ui.js"
  ];
  const root = document.getElementById("appMain");
  if (root) { root.setAttribute("aria-busy", "true"); root.style.pointerEvents = "none"; }
  try {
    for (const path of modules) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = path;
        script.onload = resolve;
        script.onerror = () => reject(new Error("Falha ao carregar " + path));
        document.body.appendChild(script);
      });
    }
    if (root) { root.removeAttribute("aria-busy"); root.style.pointerEvents = ""; }
    document.documentElement.dataset.appModules = "loaded";
  } catch (error) {
    console.error("Falha ao iniciar os módulos do álbum:", error);
    if (root) {
      root.removeAttribute("aria-busy"); root.style.pointerEvents = "";
      root.insertAdjacentHTML("afterbegin", '<div class="box" role="alert"><h3>Falha ao iniciar o álbum</h3><p>Um dos módulos não carregou. Atualize a página e consulte o console para identificar o arquivo.</p></div>');
    }
  }
})();