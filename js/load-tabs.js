/* Carrega o HTML de cada aba antes de inicializar a lógica principal. */
(async function loadTabMarkup(){
  const main = document.getElementById("appMain");
  const loading = document.getElementById("tabsLoading");
  const tabs = ["tabs/album.html","tabs/loja.html","tabs/trocas.html","tabs/perfil.html","tabs/amigos.html","tabs/ranking.html"];
  try {
    if (loading) loading.hidden = false;
    const responses = await Promise.all(tabs.map(async path => {
      const response = await fetch(path, { cache: "no-cache" });
      if (!response.ok) throw new Error(path + " — HTTP " + response.status);
      return response.text();
    }));
    const marker = loading ? loading.outerHTML : "";
    main.innerHTML = responses.join("\n") + marker;
    const script = document.createElement("script");
    script.src = "js/album.js";
    script.onerror = () => {
      main.insertAdjacentHTML("afterbegin", '<div class="box" role="alert">Não foi possível carregar o código do álbum. Atualize a página e tente novamente.</div>');
    };
    document.body.appendChild(script);
  } catch (error) {
    console.error("Falha ao carregar as abas:", error);
    main.innerHTML = '<div class="box" role="alert"><h3>Não foi possível carregar o site</h3><p>Algumas abas não foram carregadas. Verifique a conexão e atualize a página.</p></div>';
  }
})();