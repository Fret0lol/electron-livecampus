const { ipcRenderer } =  require('electron')
ipcRenderer.send('list:getAll');

let container = document.getElementById('container');

const refreshUI = () => {
    document.querySelectorAll(".no-task").forEach(el => el.remove())
    document.querySelectorAll(".list-item").forEach(listEl => {
        let listLength = listEl.querySelectorAll("li").length
        listEl.querySelector("li:first-of-type span").innerHTML = " (" + (listLength - 1) + ")"
        if(listLength === 1){
            listEl.innerHTML += "<p class='no-task'>No task</p>"
        }
    })  
}

ipcRenderer.on('list:getAll', (event, lists) => {
    lists.forEach((list) => {
        let listItem = document.createElement("ul")
        listItem.classList.add("list-item")
        listItem.id = 'list-' + list.id
        let listTitle = document.createElement("li")
        listTitle.innerHTML = "<h3>"+list.title+"<span></span></h3>"
        listTitle.classList.add("head")
        listItem.appendChild(listTitle)
        container.appendChild(listItem)
    });

    ipcRenderer.send('list:getTasks')

    ipcRenderer.on('list:getTasks', (event, tasks) => {
        tasks.forEach((task) => {
            let listItem = document.getElementById(`list-${task.list_id}`)
            listItem.innerHTML += `<li id="${task.id}">` + task.title + "<br/><button class='up'>⬆</button><button class='down'>⬇</button><button class='left'>⬅</button><button class='right'>➡</button><button class='modify'>Modify</button><button class='close'>⨯</button></li>"
        });
    
        document.querySelectorAll(".close").forEach(item => {
            item.addEventListener("click", e => {
                // e.target.parentElement.remove()
                ipcRenderer.send('list:deleteTask', {id: e.target.parentElement.id})
            })
        })

        document.querySelectorAll(".modify").forEach(item => {
            item.addEventListener("click", e => {
                ipcRenderer.send('list:modify', e.target.parentElement.id)
            })
        })

        
        document.querySelectorAll(".up").forEach(item => {
            item.addEventListener("click", e => {
                let div = e.target.parentElement
                let prev = div.previousElementSibling
                if(prev !== null && prev.className !== "head"){
                    ipcRenderer.send('task:up', div.id)
                    ipcRenderer.send('task:down', prev.id)
                    div.parentElement.insertBefore(div, prev)
                }
            })
        })
        
        document.querySelectorAll(".down").forEach(item => {
            item.addEventListener("click", e => {
                let div = e.target.parentElement
                let next = div.nextElementSibling
                if(next !== null){
                    ipcRenderer.send('task:down', div.id)
                    ipcRenderer.send('task:up', next.id)
                    div.parentElement.insertBefore(next, div)
                }
            })
        })
        
        document.querySelectorAll(".left").forEach(item => {
            item.addEventListener("click", e => {
                let div = e.target.parentElement
                let list = div.parentElement
                let prev = list.previousElementSibling
                if(prev !== null){
                    ipcRenderer.send('task:left', div.id)
                    prev.append(div)
                }
            })
        })
        
        document.querySelectorAll(".right").forEach(item => {
            item.addEventListener("click", e => {
                let div = e.target.parentElement
                let list = div.parentElement
                let next = list.nextElementSibling
                if(next !== null){
                    ipcRenderer.send('task:right', div.id)
                    next.append(div)
                }
            })
        })

        refreshUI()

        document.querySelectorAll("button").forEach(el => el.addEventListener("click", e =>{
            refreshUI()  
        }))
    });
});

ipcRenderer.on('list:deleteTask', (event, id) => {
    let task = document.getElementById(id)
    task.remove()
})