import React, { Component } from 'react';
import { DeviceEventEmitter, StyleSheet, Text, TextInput, View, NativeModules, NativeEventEmitter } from 'react-native';
import JSBridge from './JSBridge';

export default class CommonPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            result: null
        }
    }

    UNSAFE_componentWillMount() {
        //监听从原生来的消息
        this.testDataListener = DeviceEventEmitter.addListener('testData', e => {//for Android
            this.setState({
                data: e.data
            })
        });
        this.dataToJSPresenter = new NativeEventEmitter(NativeModules.DataToJSPresenter);
        this.dataToJSPresenter.addListener('testData', (e) => {// for iOS
            this.setState({
                data: e.data
            })
        })
    }

    UNSAFE_componentWillUnmount() {
        if (this.testDataListener) {
            this.testDataListener.remove();
        }
        if (this.dataToJSPresenter) {
            this.dataToJSPresenter.removeListener('testData');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    this is {this.props.name}
                </Text>
                <Text style={styles.data}>来自Native初始化数据：{this.props.params}</Text>
                <Text style={styles.data}>收到Native的数据：{this.state.data}</Text>
                <View style={styles.input_container}>
                    <TextInput style={styles.input} onChangeText={txt => this.text = txt} />
                    <Text style={styles.button} onPress={() => {
                        //调用原生的方法
                        JSBridge.sendMessage({ text: this.text })
                    }}>Send data to Native</Text>
                </View>
                <Text style={styles.data}>来自Native的计算结果：{this.state.result}</Text>
                <View style={styles.input_container}>
                    <TextInput style={styles.input} onChangeText={txt => this.num1 = txt} />
                    <Text>+</Text>
                    <TextInput style={styles.input} onChangeText={txt => this.num2 = txt} />
                    <Text>=</Text>
                    <Text style={styles.button} onPress={() => {
                        //通过接口回调回来
                        JSBridge.doAdd(parseInt(this.num1), parseInt(this.num2)).then(e => {
                            this.setState({
                                result: e
                            })
                        })
                    }}>doAdd</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 120
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    input_container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'

    },
    input: {
        height: 40,
        flex: 1
    },
    button: {
        borderWidth: 1,
        borderRadius: 4,
        fontSize: 20,
        color: 'red',
    },
    data: {
        backgroundColor: '#87CEFA',
        fontSize: 18

    }
})
    ;
