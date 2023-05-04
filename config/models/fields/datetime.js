const Field = require('./field');

class Datetime extends Field{
    constructor( name, value, props ){
        super( name, "datetime", value );
        this.__null = true;
        this.__format = "DD-MM-YYYY hh:mm:ss"
        this.#__initializeProperties__(props)
    }

    #__initializeProperties__ = (props) => {
        /**
            @name: phương thức khởi tạo thuộc tính;
            @desc: 
                Sử dụng các thuộc tính từ props để đặt lại cho trường và dùng chúng để
            kiểm soát dữ liệu một cách độc lập.
                Các thuộc tính được truyền vào là không bắt buộc, có nhỏ nào xào nhỏ đó.
                Với những thuộc tính được đánh giá là undefined thì vẫn giữ nguyên giá trị mặc định.
            @param: props {}
            @author: DS
        **/
        if( props ){
            const { nullable, format } = props;
            if( nullable != undefined ){
                this.__null = nullable
            }
            if( format != undefined ){
                this.__format = format
            }
        }
    }

    #__format_date__ = () => {
        const date = new Date(this.__value);
        
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const secs = date.getSeconds()

        let result = this.__format;
        result = result.replaceAll("DD", day);
        result = result.replaceAll("MM", month);
        result = result.replaceAll("YYYY", year);

        result = result.replaceAll("hh", hour);
        result = result.replaceAll("mm", minute);
        result = result.replaceAll("ss", secs);

        return result;
    }

    getFormatedValue = () => {
        return this.#__format_date__()
    }
}

module.exports = Datetime
