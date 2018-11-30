import {
    FETCHING_PEOPLE_REQUEST,
    FETCHING_PEOPLE_SUCCESS,
    FETCHING_PEOPLE_FAILURE
} from '../actions/types'

const initiaState = {
    isFetching: false,
    errorMessage: '',
    people: []
}
// action的具体行为
const peopleReducer = (state = initiaState, action) => {
    switch (action.type) {
        case FETCHING_PEOPLE_REQUEST:
            return {...state, isFetching:true}
        case FETCHING_PEOPLE_SUCCESS:
            return {
                ...state, 
                isFetching:false,
                people:action.payload
            }
        case FETCHING_PEOPLE_FAILURE:
            return {
                ...state, 
                isFetching:false,
                people:action.payload
            }
        default:
            return state;
    }
}
export default peopleReducer