import apiProxy from './api-proxy';

import defaultBranch from './route/default-branch';
import databaseBranch from './route/database-branch';

const initialState = {
    apiProxy
}


export default ( state = initialState, action ) => {
    switch (action.branch) {
        case "db": /* This is not has been used yet */
            return databaseBranch( state, action );
            break;
        default: /* The branch always goes here */
            return defaultBranch( state, action )
            break;
    }
}
