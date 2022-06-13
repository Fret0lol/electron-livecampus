const { ipcRenderer } =  require('electron')

window.addEventListener('DOMContentLoaded', async () => {
  const taskTitle = document.querySelector('#title')
  const taskState = document.querySelector('#task-select')
  let task = null

  document.getElementById("submit").addEventListener("click", function (e) {
    task = { id: updateTask.id, title: taskTitle.value, rank: updateTask.rank, list_id: taskState.value }
    ipcRenderer.send('task:update:u', task)
    console.log(task)
  });


  document.getElementById("cancel").addEventListener("click", function (e) {
    window.api.send('quit', 'data')
  });

  ipcRenderer.send('task:update');

  let updateTask = null

  ipcRenderer.on('task:update', (event, data) => {
    updateTask = data
    taskTitle.value = data.title
    taskState.children[data.list_id - 1].selected = true
  })
})

