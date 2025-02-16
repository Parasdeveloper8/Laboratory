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
   
