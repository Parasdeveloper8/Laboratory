const searchValue = document.getElementById("search-value");
const search = async (e)=>{
    try{
     e.preventDefault();
     const searchAPI = `http:localhost:4900/search/${searchValue.value}`;
     const response = await fetch(searchAPI,{
        method:"POST",
        headers:{ "Content-Type": "application/json" }
     });
     console.log(searchValue.value);
    }
    catch(error){
        console.error("Failed to search",error);
    }
}