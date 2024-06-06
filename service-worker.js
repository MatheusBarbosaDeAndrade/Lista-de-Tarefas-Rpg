const CACHE_NAME = 'my-pwa-cache-v1';
// Nome do cache onde os arquivos serão armazenados.

const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    'images/icons8-lista-50.png',
    'images/images/icons8-lista-100.png'
];
// Lista de URLs a serem armazenadas no cache.

self.addEventListener('install', function(event) {
    // Adiciona um evento para a instalação do Service Worker.
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                // Abre o cache especificado.
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
                // Adiciona todos os arquivos especificados no cache.
            })
    );
});

self.addEventListener('fetch', function(event) {
    // Adiciona um evento para interceptar as requisições de rede.
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Verifica se a requisição está no cache.
                if (response) {
                    return response;
                    // Se estiver, retorna a resposta do cache.
                }
                return fetch(event.request);
                // Se não estiver, faz a requisição na rede.
            })
    );
});