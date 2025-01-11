const dialogBox =  document.getElementById('dialog');
const text = document.getElementById("text");
const category = document.getElementById("select");

//open dialog box to put question
const openDialog=()=>{
   dialogBox.style.display='block';
}

//open dialog box to put question
const closeDialog=()=>{
    dialogBox.style.display = 'none';
}

//Add question
const addQue = async (event) =>{
    event.preventDefault();
    try{
    const api = `http://localhost:4900/post-ques/${text.value}/${category.value}`
    const response = await fetch(api,{
        method:"POST",
        headers: { "Content-Type": "application/json" }
    });
    if(response.ok){
        closeDialog();
    }
}
catch(error){
    console.error("Error on posting que",error)
}
}