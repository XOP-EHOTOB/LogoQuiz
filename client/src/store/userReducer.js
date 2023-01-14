const initialState = {
    user: {}
}

export const userReducer = (state = initialState, action) => {

    switch(action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.data
            }

        default: 
            return state.user
    }

}