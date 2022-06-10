window.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('form')


    document.getElementById("cancel").addEventListener("click", function (e) {
        window.api.send('quit', 'data')
   });





})