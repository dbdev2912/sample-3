/* ==== LIBRARY ==== */
const fs = require('fs');
require('dotenv').config();

/* ==== GLOBAL VARIABLES ==== */
const managePATH        = './manage.json'
const modelBaseDir      = './models'
const controllerBaseDir = './controllers'

const validChars = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'V', 'X', 'Y', 'W', 'U', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'v', 'x', 'y', 'w', 'u', 'z',
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

const writeManageJSONWithData = ({ models, controllers }) => {
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
    const makeModelResult = __make_model__( modelName )
    if( makeModelResult ){
        models.push( modelName );
        writeManageJSON()
        console.log(`Tạo model ${ modelName } thành công!\n`)
    }
}

const __command_create__controller__ = () => {
    if( commands.length < 5 ){
        console.log("Không tìm thấy tên controller trong command!")
        return
    }
    const controllerName = commands[4];
   
    const makeControllerResult =  __make_controller__( controllerName )
    if( makeControllerResult ){
        controllers.push( controllerName );
        writeManageJSON()
        console.log(`Tạo controller ${ controllerName } thành công!\n`)
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
        super("${ modelName.toLowerCase() }");
        this.__addField__( "${ modelName }_id", Model.types.int )
    
        this.__addPrimaryKey__( ["${ modelName }_id"] )        
    }
}   
class ${ modelName }Record extends ${ modelName } {
    constructor( { id, ${ modelName }_id } ){
        super();
        this.setDefaultValue( { id, ${ modelName }_id } )        
    }

    get = () => {
        return {
            id: this.id.value(),
            ${ modelName }_id: this.${ modelName }_id.value()
        }
    }
}
module.exports = { ${ modelName }, ${ modelName }Record }
    `;    
    
    for( let i = 0 ; i < modelDirs.length; i++ ){
        let modelStringPath = `${modelBaseDir}/${modelDirs.slice(0, i + 1).join('/')}`;
        modelStringPath = modelStringPath.replace('//', '/');
        
        if( !fs.existsSync( modelStringPath ) ){
            fs.mkdirSync( modelStringPath )
        }
    }
    const newModelFilePath = `${ modelBaseDir }/${ modelPath }.js`;

    if( fs.existsSync( newModelFilePath ) ){
        fs.unlinkSync( newModelFilePath )
    }
    fs.writeFileSync(newModelFilePath, modelTemplate )  
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

    const newControllerFilePath = `${ controllerBaseDir }/${ controllerPath }.js`

    if( fs.existsSync( newControllerFilePath ) ){
        fs.unlinkSync( newControllerFilePath )
    }

    fs.writeFileSync(newControllerFilePath, controllerTemplate )   
    return true 
}


const __command_migrate__ = async () => {
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

    const existingModels = []
    const modelObjects = migrateModels.map( model => {
        const modelPath = `${ modelBaseDir }/${ model }`.replace('//', '/'); 
        try{
            const obj = require(modelPath)
            const keys = Object.keys(obj);
            const modelObject = obj[keys[0]]   
            existingModels.push( model )         
            return modelObject
        }catch{
            return undefined
        }
    }).filter( obj => obj != undefined );

    /* Translate to MySQL OR Anything Code base on env */
    /* Check the fucking fields and keys either the same or not */

    let valid = true;
    for( let i = 0 ; i < modelObjects.length; i++ ){
        const modelObject = modelObjects[i]
        const validateResult = await modelValidator(modelObject)
        if( !validateResult ){
            valid = false
        }
    }

    if( valid ){
        console.log("VALID")
        /* Write change to database  */
    }


    writeManageJSONWithData({ controllers, models: existingModels })
}


const modelValidator = async ( modelObj ) => {
    const Model = new modelObj()
    const model = Model.getModel()
    const fields = model.__getFields__()
    console.log( fields.map( field => field.__fieldName ).join(", ") )
    return true
}

/* ==== MAIN THREAD ==== */
const manageData = readManageJSON()
const { controllers, models } = manageData;
const commands = process.argv 


const __main__ = async () => {
    if( commands.length < 3 ){
        console.log(`
Cú pháp: 
node manage create [ model < modelName > ]  ||
            create [ controller < controllerName > ] ||

            migrate
    

Ví dụ:
    node manage create model MyModel
    node manage migrate

:>
`)
        return
    }
    const mainCommand = commands[2].toLowerCase();

    switch(mainCommand){
        case "create":
            __command_create__()
            break;
        case "migrate":
            await __command_migrate__()
            break;
        default:
            console.log(`Không tìm thấy lệnh! :( `)
            break;
    }
}

__main__()