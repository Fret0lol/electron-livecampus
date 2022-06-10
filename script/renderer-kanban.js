window.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('form')
    const title = document.querySelector('#title')
    const desc = document.querySelector('#description')
    const taskState = document.querySelector('#task-select')


    form.addEventListener('submit', submitForm)
    function submitForm(e) {
        e.preventDefault();
        data = [title.value, desc.value, taskState.value]
        addItem(data)
    }

    function addItem(data) {
        if (data) {
          window.api.send("item:add", data)
        } else {
          console.log('Empty data');
        }
      }


    document.getElementById("cancel").addEventListener("click", function (e) {
        window.api.send('quit', 'data')
   });





})