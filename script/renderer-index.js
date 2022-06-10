const { ipcRenderer } =  require('electron')
ipcRenderer.send('list:getAll');

let listsElement = document.querySelectorAll("ul")

ipcRenderer.on('list:getAll', (event, lists) => {
    lists.forEach((list, index) => {
        listsElement[index].innerHTML = "<li>" + list.id + " | " + list.title + "<button class='up'>⬆</button><button class='down'>⬇</button><button class='left'>⬅</button><button class='right'>➡</button><button class='close'>⨯</button></li>"
    });
});




document.querySelectorAll(".close").forEach(item => {
    item.addEventListener("click", e => {
        e.target.parentElement.remove()
    })
})

document.querySelectorAll(".up").forEach(item => {
    item.addEventListener("click", e => {
        let div = e.target.parentElement
        let prev = div.previousElementSibling
        if(prev !== null && prev.className !== "head"){
            div.parentElement.insertBefore(div, prev)
        }
    })
})

document.querySelectorAll(".down").forEach(item => {
    item.addEventListener("click", e => {
        let div = e.target.parentElement
        let next = div.nextElementSibling
        if(next !== null){
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
            next.append(div)
        }
    })
})
