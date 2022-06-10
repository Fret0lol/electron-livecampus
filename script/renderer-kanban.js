window.addEventListener('DOMContentLoaded', async () => {
    const taskTitle = document.querySelector('#title')
    const taskState = document.querySelector('#task-select')

    let task = null

    window.api.getItem('async:update', (data)=> {
        console.log(data);
    });

    document.getElementById("submit").addEventListener("click", function (e) {
        task = { title: taskTitle.value, rank: 0,  list_id: taskState.value}
        window.api.send('task:add', task)
    });


    document.getElementById("cancel").addEventListener("click", function (e) {
        window.api.send('quit', 'data')
   });
})