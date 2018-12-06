import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import PeopleList from "../components/PeopleList";
import { fetchPeople } from "../redux/actions/peopleActions";
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'


class AppContainer extends Component {
  componentDidMount() {
    this.props.fetchPeopleFlag()
    // const {dispatch, fetchPeopleFlag} = this.props
    // dispatch(fetchPeople())
    // alert('1:'+dispatch) // 这里可以看到dispatch的函数

    // 打印出来的dispach
        // function (action){
        //     if(typeof action === 'function'){
        //         return action(dispatch,getState,extraArgument);
        //     }
        //     return next(action)
        // }
  }
  render() {
    let content = <PeopleList people={this.props.rondomPeople.people} />;
    if (this.props.rondomPeople.isFetching) {
      content = <ActivityIndicator size="large" />;
    }
    return <View style={styles.container}>{content}</View>;
  }
}

// AppContainer.PropTypes = {
//     fetchPeople: PropTypes.func.isRequired,
//     randomPeople:PropTypes.object.isRequired
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#093339"
  }
});
// 这里的返回值可以指返回自己需要的值, 通过state来进行获取
const mapStateToProps = state => {
    return {
        rondomPeople : state
    }
}

// 通过connect以后在AppContainer组件就可以通过this.props使用了

// 情况一: 如果已经把connect的第二个参数传入了，那么在注册的组件里面只能使用this.props.fetchPeopleFlag() 来触发action
// 因为在props里面已经不存在dispach这个方法了，这个方法已经通过connect封装在fetchPeopleFlag里面了
export default connect(mapStateToProps, { fetchPeopleFlag:fetchPeople })(AppContainer)

// 情况二： 如果是下面的写法 那么可以直接通过import  fetchPeople 这个action，然后通过 this.props.dispatch()来触发
// export default connect(mapStateToProps)(AppContainer)
