import {
    FETCHING_PEOPLE_REQUEST,
    FETCHING_PEOPLE_SUCCESS,
    FETCHING_PEOPLE_FAILURE
} from './types'
// 普通的action返回的是一个对象
export const fetchingPeopleRequset = ()=> (
    {
        type: FETCHING_PEOPLE_REQUEST
    }
)
export const fetchingPeopleSuccess = (json)=> (
    {
        type: FETCHING_PEOPLE_SUCCESS,
        payload: json
    }
)
export const fetchingPeopleFailure = (error)=> (
    {
        type: FETCHING_PEOPLE_FAILURE,
        payload: error
    }
)

// 可以异步的action
export const fetchPeople = () =>{
    return async dispatch => {
        dispatch(fetchingPeopleRequset());
        try {
            let response = await fetch("https://randomuser.me/api/?results=25")
            let json = await response.json();
            dispatch(fetchingPeopleSuccess(json.results))
        }catch {
            dispatch(fetchingPeopleFailure(error))
        }
    }
}