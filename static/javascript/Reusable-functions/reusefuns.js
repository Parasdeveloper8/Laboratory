//All reusable functions
//EJ modules

//This function runs callback function when user
//reach at bottom of page
export function scrollFetch(callback){
    // Adding scroll event to load more blogs when scrolled to the bottom
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
    
        if (scrollPosition >= documentHeight - 10) {
            //Callback function will be run
            callback();
        }
    });
    }
   
    //This function is used to format likes on behalf of their number
    //Adding K,M,B after likes
    //num is number of likes
    //countpara is  HTMLParagraphElement
export function formatLike(num,countpara){
        if (num >= 1000 && num < 1000000 ){
            let divide = num / 1000;
            let result = divide + "K";
            countpara.innerText = result;
        }else if(num >= 1000000 && num < 1000000000 ){
            let divide = num / 1000000;
            let result = divide + "M";
            countpara.innerText = result;
        }else if(num >= 1000000000){
            let divide = num / 1000000000;
            let result = divide + "B";
            countpara.innerText = result;
        }else{
            countpara.innerText = num;
        }
    }
