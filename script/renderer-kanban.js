window.addEventListener('DOMContentLoaded', async () => {
    const taskTitle = document.querySelector('#title')
    const taskState = document.querySelector('#task-select')

    let task = null


    document.getElementById("submit").addEventListener("click", function (e) {
        task = { title: taskTitle.value, rank: 0,  list_id: taskState.value}
        window.api.send('task:add', task)
    });
    
    function submitForm(e) {
        e.preventDefault();
        task = [title.value, desc.value, taskState.value]
        addItem(task)
    }

    function addItem(task) {
        console.log(task)
        if (task) {
          window.api.send("item:add", task)
        } else {
          console.log('Empty data');
        }
      }


    document.getElementById("cancel").addEventListener("click", function (e) {
        window.api.send('quit', 'data')
   });
})