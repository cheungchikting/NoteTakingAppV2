let deletebtn = document.querySelector("#removepic")

deletebtn.addEventListener('click',(e)=>{
let data = deletebtn.getAttribute("data-id")
    axios.delete(`/pic/${data}`)
})

