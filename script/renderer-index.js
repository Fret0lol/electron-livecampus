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
        let prev = div.previousSibling
        console.log("a")
        if(prev !== null && prev.className !== "head"){
            div.parentElement.insertBefore(div, prev)
            console.log("b")
        }
    })
})

document.querySelectorAll(".down").forEach(item => {
    item.addEventListener("click", e => {
        let div = e.target.parentElement
        let next = div.nextSibling
        if(next !== null){
            div.parentElement.insertBefore(next, div)
        }
    })
})