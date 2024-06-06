if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
        navigator.serviceWorker.register('/service-worker.js').then(function(registration){
            console.log("service worker registrado: ", registration)
        }, function(error){
            console.log("falha ao registrar o service worker: ", error)
        })
    })
}