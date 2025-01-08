const searchValue = document.getElementById("search-value");
let page = 1;
let limit = 3;
let row= 0;
const search = async (e)=>{
    try{
     e.preventDefault();
     const searchAPI = `http://localhost:4900/search/${row}/${limit}?val=${searchValue.value}`;
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