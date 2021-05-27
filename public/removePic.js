let pic = document.querySelectorAll("#editpic")
let btn = document.querySelector("#removepic")

btn.addEventListener('click', function(){
  for (let each of pic){
  each.remove() 
  }
})


