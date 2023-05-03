/* ==== LIBRARY ==== */
const fs = require('fs');
require('dotenv').config();

/* ==== GLOBAL VARIABLES ==== */
const managePATH        = './manage.json'
const modelBaseDir      = './models'
const controllerBaseDir = './controllers'

const validChars = [
    'A', 'B', 'C', 'D', 'E', 'F', 'Z', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'V', 'X', 'Y',
    'a', 'b', 'c', 'd', 'e', 'f', 'z', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'v', 'x', 'y',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '_'
];

const numericChars = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ]

/* ==== MANAGE MANIPULATE ==== */

const readManageJSON = () => {
    const rawJSON = fs.readFileSync(managePATH);
    const manageData = JSON.parse(rawJSON);
    return manageData
}

const writeManageJSON = () => {
    if( fs.existsSync(managePATH) ){
        fs.unlinkSync(managePATH)
    }
    const stringifiedData = JSON.stringify({ models, controllers });
    fs.writeFileSync(managePATH, stringifiedData)
}

/* ==== BASIC FUNCTIONS ====*/

const validateName = ( name ) => {
    let valid = true;
    for( let i = 0 ; i < name.length; i++ ){
        if( validChars.indexOf( name[i] ) == -1 ){
            valid = false;
        }
    }
    if( numericChars.indexOf(name[0]) != -1 ){
        valid = false;
    }
    return valid;
} 

/* ==== COMMANDS RESOLVING ====*/


const __command_create__ = ( ) => {
    if( commands.length < 4 ){
        console.log("Rồi tạo là tạo cái gì mà ghi chữ create xong cái bỏ ngang dzậy ? ")
        return
    }
    const command = commands[3].toLowerCase();
    switch(command){
        case "model":
            __command_create_model__();
            break;
        case "controller":
            __command_create__controller__();
            break;
        default:
            console.log(`Ở đây không có lệnh tạo ${ commands[3] } nhe quí dị!`)
            break;
    }
}

const __command_create_model__ = () => {
    if( commands.length < 5 ){
        console.log("Không tìm thấy tên model trong command!")
        return
    }
    const modelName = commands[4];
    const findExistedModel = models.filter( model => model === modelName )[0];
    if( findExistedModel ){
        console.log("Model này đã tồn tại!");
        return
    }
    const makeModelResult = __make_model__( modelName )
    if( makeModelResult ){
        models.push( modelName );
        writeManageJSON()
    }
}

const __command_create__controller__ = () => {
    if( commands.length < 5 ){
        console.log("Không tìm thấy tên controller trong command!")
        return
    }
    const controllerName = commands[4];
    const findExistedController = controllers.filter( controller => controller === controllerName )[0];
    if( findExistedController ){
        console.log("Controller này đã tồn tại!");
        return
    }
    const makeControllerResult =  __make_controller__( controllerName )
    if( makeControllerResult ){
        controllers.push( controllerName );
        writeManageJSON()
    }
}


const __make_model__ = ( modelPath ) => {
    const splitedName = modelPath.split('/');
    const modelName = splitedName[splitedName.length - 1];
    
    const isNameValid = validateName(modelName);
    if( !isNameValid ){
        console.log("Tên không hợp lệ!")
        return false;
    }

    const modelDirs  = splitedName.filter( dir => dir != modelName );

    const modelTemplate = `
const { Model } = require('${"../".repeat(splitedName.length) }config/models');
class ${ modelName } extends Model{
    constructor(){
        super("${ modelName }");
        this.model.__addField__( "${ modelName }_id", Model.types.number )
    
        this.model.__addPrimaryKey__( ["${ modelName }_id"] )        
    }
}   
    
module.exports = ${ modelName }
    `;    
    
    for( let i = 0 ; i < modelDirs.length; i++ ){
        let modelStringPath = `${modelBaseDir}/${modelDirs.slice(0, i + 1).join('/')}`;
        modelStringPath = modelStringPath.replace('//', '/');
        
        if( !fs.existsSync( modelStringPath ) ){
            fs.mkdirSync( modelStringPath )
        }
    }
    
    fs.writeFileSync(`${ modelBaseDir }/${ modelPath }.js`, modelTemplate )  
    return true;
}

const __make_controller__ = ( controllerPath ) => {
    const splitedName = controllerPath.split('/');
    const controllerName = splitedName[splitedName.length - 1];
    
    const isNameValid = validateName(controllerName);

    if( !isNameValid ){
        console.log("Tên không hợp lệ!")
        return false;
    }

    const controllerDirs  = splitedName.filter( dir => dir != controllerName );

    const controllerTemplate = `
const { Controller } = require('${"../".repeat(splitedName.length) }config/controllers');

class ${ controllerName } extends Controller {
    constructor(){
        super();
    }

}
module.exports = ${ controllerName }

    `;
    for( let i = 0 ; i < controllerDirs.length; i++ ){
        let controllerStringPath = `${controllerBaseDir}/${controllerDirs.slice(0, i + 1).join('/')}`;
        controllerStringPath = controllerStringPath.replace('//', '/');
        
        if( !fs.existsSync( controllerStringPath ) ){
            fs.mkdirSync( controllerStringPath )
        }
    }
    fs.writeFileSync(`${ controllerBaseDir }/${ controllerPath }.js`, controllerTemplate )   
    return true 
}


const __command_migrate__ = () => {
    let migrateModels = models;
    if( commands.length > 3 ){
        migrateModels = commands.slice( 3, commands.length );
        let valid = true;
        for( let i = 0; i < migrateModels.length; i++ ){
            if( models.indexOf(migrateModels[i]) == -1 ){
                console.log(`Model ${ migrateModels[i] } không tồn tại!`)
                valid = false
            }
        }
        if( !valid ){
            return
        }
    }

    const modelObjects = migrateModels.map( model => {
        const modelPath = `${ modelBaseDir }/${ model }`.replace('//', '/'); 
        try{
            const obj = require(modelPath)
            return new obj()
        }catch{
            return undefined
        }    
    }).filter( obj => obj != undefined );

    /* Translate to MySQL OR Anything Code base on env */

    modelObjects.map( obj => {
        console.log( obj.model.__fields.map( field => field.__fieldName ) )
    })
}


/* ==== MAIN THREAD ==== */
const manageData = readManageJSON()
const { controllers, models } = manageData;
const commands = process.argv 


const __main__ = () => {
    if( commands.length < 3 ){
        return
    }
    const mainCommand = commands[2].toLowerCase();

    switch(mainCommand){
        case "create":
            __command_create__()
            break;
        case "migrate":
            __command_migrate__()
            break;
        default:
            console.log(`Không tìm thấy lệnh! :( `)
            break;
    }

    console.log({ controllers, models })
}

__main__()