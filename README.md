![image](https://github.com/mrzqii/blog/blob/master/images/2018-12-16_183326.png?raw=true)  
## 这个列子完整的体现了redux的使用，以及中间件redux-thunk的使用。这里记录了我的思路，建议把这个仓库克隆下来自己跑一下，还是很容易理解的。

#### 设计 State 结构
在 Redux 应用中，所有的 state 都被保存在一个单一对象中  
这个案列我们展示的是人物列表。所以设计state的结构如下：
```
const initiaState = {
    isFetching: false,// 是否发送请求
    errorMessage: '',
    people: [] //每个人物的信息
}
```

#### 定义action

```
peopleActions.js

// 定义action
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

// 可以异步的action 返回的是一个函数
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
```

#### 书写reducer
reducers 指定了应用状态的变化如何响应 actions 并发送到 store 的， actions 只是描述了有事情发生了这一事实，并没有描述应用如何更新 state。

```
peopleReducer.js

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

// action的具体行为 传入旧的state 返回新的state

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


```
#### 将store载入到我们的应用中
```
App.js

import React, { Component } from "react";
import AppContainer from "./app/containers/AppContainer";

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import peopleReducer from './app/redux/reducers/peopleReducer'

const createStoreMiddleware = applyMiddleware(thunk)(createStore) // 使用中间件
const store  = createStoreMiddleware(peopleReducer) // 创建store
export default class App extends Component {
  render() {
    return (
        <Provider store={store}> // 注意这里需要使用Provider标签，并给store属性赋值
                <AppContainer />
        </Provider>
    )
    
  }
}
```

#### 创建container获取需要的数据并展示
```
AppContainer.js

import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import PeopleList from "../components/PeopleList";
import { fetchPeople } from "../redux/actions/peopleActions";
import { connect } from 'react-redux'
 


class AppContainer extends Component {
  componentDidMount() {
  
    this.props.fetchPeopleFlag() // 这里相当于dispatch(fetchPeople())
    
    // const {dispatch, fetchPeopleFlag} = this.props
    // dispatch(fetchPeople())
    // alert('1:'+dispatch) // 这里可以看到dispatch的函数

    // 打印出来的这个dispatch 是经过redux-thunk改造过了的。 没通过中间件thunk的dispach和这个是不一样的
        // function (action){
        //     if(typeof action === 'function'){
        //         return action(dispatch,getState,extraArgument);
        //     }
        //     return next(action)
        // }
  }
  render() {
  
  // 把数据传到用于渲染页面的component
    let content = <PeopleList people={this.props.rondomPeople.people} />;
    if (this.props.rondomPeople.isFetching) {
      content = <ActivityIndicator size="large" />;
    }
    return <View style={styles.container}>{content}</View>;
  }
}

 
// 这里的返回值可以指返回自己需要的值, 通过state来进行获取
const mapStateToProps = state => {
    return {
        rondomPeople : state
    }
}

// 通过connect以后在AppContainer组件就可以通过this.props使用connect里面的属性了

// 情况一: 如果已经把connect的第二个参数传入了，那么在注册的组件里面只能使用this.props.fetchPeopleFlag() 来触发action
// 因为在props里面已经不存在dispach这个方法了，这个方法已经通过connect封装在fetchPeopleFlag里面了
export default connect(mapStateToProps, { fetchPeopleFlag:fetchPeople })(AppContainer)
 
```
