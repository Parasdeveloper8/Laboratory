const massDiv = document.getElementById("mass-div");
document.addEventListener("DOMContentLoaded",function(){
      fetch("http://localhost:4300/atomic-mass")
      .then(response => response.json())
      .then((data)=>{
            
      })
});