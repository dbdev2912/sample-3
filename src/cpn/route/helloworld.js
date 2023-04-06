import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default () => {
    const { apiProxy } = useSelector( state => state )
    const [ msg, setMsg ] = useState("")
    useEffect(() => {
        fetch(`${ apiProxy }/hw`).then( res => res.json() ).then(res => {
            const { content } = res;
            setMsg( content );
        })
    }, [])

    return(
        <div className="fullscreen flex flex-middle">
            <span className="block text-32-px sample-hello-world">{ msg }</span>
        </div>
    )
}
