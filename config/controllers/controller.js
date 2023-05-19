class Controller {    
    constructor(){
        
    }

    writeReq = (request) => {
        const { originalUrl, method } = request
        console.log(`REQ: ${ method } - ${  originalUrl }`)
    }

    writeRes = (response) => {
        const { status, message } = response;
        console.log(`RES: ${ status } - ${ message }`)
    } 
}

module.exports = Controller
