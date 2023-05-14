const { Database } = require("./database");
const { objectComparator } = require('../../functions/validator')

class Table {
    /**
     *  @name Table - Bảng
     *  @desc Đối tượng này sẽ giao tiếp với cơ sở dữ liệu ở cấp độ "Bảng",
     *      Tức là với #__tableName được truyền vào, dữ liệu và các truy vấn
     *      đều sẽ sử dụng #__tableName để xác định bảng nào thì thực thi những
     *      lệnh gì.    
     *  @author DS   
     **/    
    #__tableName = ""
    #__fields = []
    #__foreignKeys = []
    #__primaryKey = [];

    #dbo = new Database();

    constructor( name ){

        /**
         * @desc Phương thức khởi tạo
         * @params 
         *      name String
         * @props
         *      #__tableName <String>
         *      #__fields <OBJ{ __fieldMame, __fieldObject }>[]
         *                     => __field_name  String
         *                        __fieldObject Field 
         *      #__foreignKeys <String>[]
         *      #__primaryKey  <String>[]
         * 
         * @author Linguistic
         */

        this.#__tableName = name;
        this.#__fields = [];
        this.#__foreignKeys = [];
        this.#__primaryKey = [];        
    };

    __dbInit__ = async () => {
        /**
         *  @desc Khởi tạo đối tượng dbo, vì nó là một phương thức bất đồng bộ
         * nên khum thể dùng bên trong constructor
         *  @params /
         * 
         *  @author DS
         */


        await this.#dbo.init()
    }

    __getTableName__ = () => {

        /**
         *  @desc Trả về tên bảng hiện tại, phương thức này được dùng để truy cập thuộc tính __tableName
         *      vì nó là một thuộc tính private nên không thể truy cập một cách trực tiếp
         *  @params /
         * 
         *  @author DS
         */

        return this.#__tableName
    }

    __getFields__ = () => {
        /**
         *  @desc Trả về tất cả trường hiện tại, phương thức này được dùng để truy cập thuộc tính __fields
         *      vì nó là một thuộc tính private nên không thể truy cập một cách trực tiếp
         *  @params /
         * 
         *  @author DS
         */
        return this.#__fields
    }

    __setFields__ = (fields) => {
        /**
         *  @desc Thiết đặt lại danh sách các trường
         *  @params fields <String>[]
         * 
         *  @author DS
         */
        this.#__fields = fields;
    }


    __getNewId__ = async () => {
        /**
         *  @desc Trả về một ID mới và duy nhất thuộc bảng này
         *  @params /
         * 
         *  @author Linguistic
         */

        await this.__dbInit__();
        const id = await this.#dbo.getAutoIncrementId( this.#__tableName );
        return id;
    }

    __isFieldExisted__ = ( fieldName ) => {
        /**
         *  @desc Kiểm tra xem một field có tồn tại trong danh sách __fields hay không
         *  @params fieldName <String>
         * 
         *  @author Linguistic
         */

        const field = this.#__fields.filter( f => f.__fieldName == fieldName )[0];
        return field != undefined ? true : false
    }

    __addField__ = ( fieldName, fieldObject, fieldProps = undefined ) => {

        /**
         *  @desc Thêm một trường mới vào danh sách 
         *      đồng thời tạo một thuộc tính mới với tên trường và giá trị là một đối tượng kế thừa Field
         *      tuỳ thuộc vào kiểu dữ liệu và danh sách các thuộc tính được truyền vào
         * 
         *  @params fieldName   <String>
         *          fieldObject <Field>
         *          fieldProps  <Object>
         *          
         * 
         *  @author Linguistic
         */

        if( !this.__isFieldExisted__( fieldName ) ){
            this[fieldName] = new fieldObject( fieldName );
            this.#__fields.push({ __fieldName: fieldName, __fieldObject: new fieldObject( fieldName, undefined, fieldProps ) })
        }
    }

    __addForeignKey__ = ( fieldName, referencesOn ) => {

        /**
         *  @desc Thêm một trường khoá ngoại và GHI ĐÈ một thuộc tính với tên là bảng chứa khoá chính         *     
         * 
         *  @params fieldName       <String>
         *          referencesOn    <Model>
         *          
         * 
         *  @author Linguistic
         */

        const ObjReferencesOn = new referencesOn()
        const __tableName = ObjReferencesOn.model.__getTableName__();                       
        this[ __tableName ] = ObjReferencesOn;       
      
        this.#__foreignKeys.push({ __fieldName: fieldName, __tableName });
    }

    __addPrimaryKey__ = ( fields ) => {
        /**
         *  @desc Thên (các) trường vào danh sách khoá chính
         * 
         *  @params fields       <String>[]
         *          
         * 
         *  @author Linguistic
         */

        this.#__primaryKey.push( ...fields )
    }

    __serializePrimaryData__ = ( serializedData ) => {
        /**
         *  @desc Đại loại là tạo một object mới từ object được truyền vào nhưng chỉ giữ lại những thuộc tính
         *     có tên là những trường thuộc khoá chính
         * 
         *  @params serializedData <Object>
         *          
         * 
         *  @author Linguistic
         */

        const data = {}
        this.#__primaryKey.map( field => {
            data[field] = serializedData[field]
        })        
        return data;
    }

    __primaryKeyCheck__ = async (data) => {
        if( this.#__primaryKey.length !== 0 ){
            const key = {}
            this.#__primaryKey.map( pk => {
                key[pk] = data[pk]
            });
            const recordExists = await this.#dbo.select(this.#__tableName, key);
            if( recordExists ){
                return false;
            }else{
                return true;
            }
        }else{
            return true
        }
    }

    __foreignKeyCheck__ = async (data) => {
        let valid = true;
        for( let i = 0; i < this.#__foreignKeys.length; i++ ){
            const { __fieldName, __tableName } = this.#__foreignKeys[i];
            const foreignDBObj = this[__tableName];
            const key = {}
            key[ __fieldName ] = data[ __fieldName ];
            await foreignDBObj.model.__dbInit__();            
            const dataExists = await foreignDBObj.model.__findCriteria__( key );
            
            if( !dataExists ){
                valid = false;
            }
        }
        return valid;
    }

    __insertRecord__ = async ( data ) => {
        await this.__dbInit__()
        let serializedData = {};

        this.#__fields.map( (field, index) => {
            field.__fieldObject.value( data[ index - 1] )
            serializedData = { ...serializedData, ...field.__fieldObject.serializingValue() }
        })        
        let id = data.id;
        if( !id ){
            id = await this.__getNewId__();
        }            
        const primayKeyCheck = await this.__primaryKeyCheck__( serializedData );
        if( primayKeyCheck ){
            const foreignKeyCheck = await this.__foreignKeyCheck__( serializedData );
            
            if( foreignKeyCheck ){
                const insertResult = await this.#dbo.insert( this.#__tableName, { ...serializedData, id } )
                return true
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    __insertObject__ = async ( serializedData ) => {
        await this.__dbInit__()
        const primayKeyCheck = await this.__primaryKeyCheck__( serializedData );
        if( primayKeyCheck ){
            const foreignKeyCheck = await this.__foreignKeyCheck__( serializedData );
            if( foreignKeyCheck ){
                const insertResult = await this.#dbo.insert( this.#__tableName, { ...serializedData } )
                return true
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    __find__ = async ( amount ) => {
        await this.__dbInit__()
        if( amount === undefined ){
            return await this.#dbo.select( this.#__tableName );
        }else{
            if( amount == 0 || amount == 1 ){
                const result = await this.#dbo.select( this.#__tableName );
                return result[0]
            }else{
                if( amount > 0 ){
                    const result = await this.#dbo.select( this.#__tableName );
                    return result.slice(0, amount)
                }else{
                    return null
                }
            }
        }
    }

    __findCriteria__ = async ( criteria ) => {
        await this.__dbInit__()
        const result = await this.#dbo.select( this.#__tableName, criteria );
        return result
    }

    __updateObject__ = async ( serializedData ) => {
        await this.__dbInit__()
        const { id } = serializedData;
        const oldValue = await this.__findCriteria__( {id } )

        if( oldValue ){
            const oldKey = this.__serializePrimaryData__( oldValue );
            const newKey = this.__serializePrimaryData__( serializedData );
            const pkCheck = await this.__primaryKeyCheck__(serializedData);
            const fkCheck = await this.__foreignKeyCheck__(serializedData);
            if( objectComparator(oldKey, newKey) ){
                if( fkCheck ){
                    delete serializedData.id;
                    await this.#dbo.update(this.#__tableName, { id }, { ...serializedData })
                    /* This operator could extend to modify even primary-key fields if they has no foreign record */
                    return true
                }else{
                    return false;
                }            
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    __deleteObject__ = async ( criteria  = undefined ) => {
        const isCriteriaNull = objectComparator( criteria, {} );
        if( isCriteriaNull ){
            return false
        }else{
            await this.#dbo.delete( this.#__tableName, criteria );
            return true;
        }
    }
}


module.exports = Table
