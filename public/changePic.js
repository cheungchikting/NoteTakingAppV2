let change = document.querySelector("#changepic")
let container = document.querySelector(".picContainer")

change.onchange = evt =>{
  const [file] = change.files
  if(file){
    container.innerHTML = ""
    let img = document.createElement("img")
    img.src = URL.createObjectURL(file)
    container.appendChild(img)
  }
}