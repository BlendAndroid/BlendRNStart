import React, { Component } from "react";
import PopularPage from "../page/PopularPage";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TrendingPage from "../page/TrendingPage";
import MyPage from "../page/MyPage";
import { createAppContainer } from "react-navigation";
import { BottomTabBar, createBottomTabNavigator } from "react-navigation-tabs";
import FavoritePage from "../page/FavoritePage";
import { connect } from "react-redux";
import EventBus from 'react-native-event-bus'
import EventTypes from "../util/EventTypes";


//在这里配置页面的路由
const TABS = {
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: '最热',
            tabBarIcon: ({ tintColor, focused }) => (
                <MaterialIcons
                    name={'whatshot'}
                    size={26}
                    style={{ color: tintColor }}

                />
            ),
        }
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: '趋势',
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name={'md-trending-up'}
                    size={26}
                    style={{ color: tintColor }}

                />
            ),
        },
    },
    FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: '收藏',
            tabBarIcon: ({ tintColor, focused }) => (
                <MaterialIcons
                    name={'favorite'}
                    size={26}
                    style={{ color: tintColor }}

                />
            ),
        },
    },
    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({ tintColor, focused }) => (
                <Entypo
                    name={'user'}
                    size={26}
                    style={{ color: tintColor }}

                />
            ),
        },
    },
}

class DynamicTabNavigator extends Component {

    constructor(props) {
        super(props);
        console.disableYellowBox = true;    //关闭黄色警告弹框
    }

    _tabNavigator() {
        //这里有一个Tabs的变量，用于判断Tabs是否已经存在
        //因为state改变后，需要重新绘制，为了避免每次都回到首页，加一个这个判断
        if (this.Tabs) {
            return this.Tabs;
        }
        const { PopularPage, TrendingPage, FavoritePage, MyPage } = TABS;
        const tabs = { PopularPage, TrendingPage, FavoritePage, MyPage };
        PopularPage.navigationOptions.tabBarLabel = "最热";    //动态修改Tab属性
        return this.Tabs = createAppContainer(createBottomTabNavigator(
            tabs,
            {
                tabBarComponent: props => {
                    return <TabBarComponent theme={this.props.theme}{...props} />;
                },
            }
        ))
    }

    render() {
        const Tab = this._tabNavigator();
        return <Tab
            onNavigationStateChange={(prevState, newState, action) => {
                EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, {//发送底部tab切换的事件
                    from: prevState.index,
                    to: newState.index
                })
            }}
        ></Tab>
    }

}

class TabBarComponent extends Component {

    // constructor(props) {
    //     super(props);
    //     //设置原始的主题
    //     this.theme = {
    //         tintColor: props.activeTintColor,
    //         updateTime: new Date().getTime(),
    //     }
    // }

    // render() {
    //     //从navigation的state解析出routes和index，用于区别是点击哪一个tab
    //     const { routes, index } = this.props.navigation.state;
    //     //如果index的params有设置的值
    //     if (routes[index].params) {
    //         //从这个值中解析出theme
    //         const { theme } = routes[index].params;
    //         //以最新的更新时间为主，防止被其他tab之前的修改覆盖掉
    //         //如果这个theme有值，并且这个值大于他之前的值，则进行更新
    //         if (theme && theme.updateTime > this.theme.updateTime) {
    //             this.theme = theme;
    //         }
    //     }
    //     //最新进行传值
    //     return <BottomTabBar {...this.props} activeTintColor={this.theme.tintColor || this.props.activeTintColor}>
    //     </BottomTabBar>
    // }

    render() {
        return <BottomTabBar
            {...this.props}
            activeTintColor={this.props.theme.themeColor}
        />;
    }

}

//之所以这样写，是因为connect的第一个参数是state，第二个是dispatct
const mapStateToProps = state => ({
    theme: state.theme.theme,
})

export default connect(mapStateToProps)(DynamicTabNavigator)