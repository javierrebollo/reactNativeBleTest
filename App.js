import React from 'react';
import {StyleSheet, ListView, Text, View, Button} from 'react-native';
import {BleManager} from 'react-native-ble-plx';

// const HM_10_CONF = "0000ffe0-0000-1000-8000-00805f9b34fb";
// const HM_RX_TX = "0000ffe1-0000-1000-8000-00805f9b34fb";
var deviceList = [];
var connectedDevice;

export default class App extends React.Component {
    constructor() {
        super();
        var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: dataSource.cloneWithRows(deviceList),
            isLoading: true
        };
    }

    connectToDevice() {
        let bleManager = new BleManager();
        bleManager.connectToDevice('D4:36:39:9B:30:84')
            .then((device) => {
                console.log('Connected');

                connectedDevice = device;
                device.services()
                    .then((services) => {
                            console.log('Services')
                        }
                    );
            });
    }

    // async waitDeviceData() {
    //     connectedDevice.monitorCharacteristicForService(
    //         HM_10_CONF,
    //         HM_RX_TX,
    //         (error, characteristic) => {
    //             if (error) {
    //                 console.log('[BLE] listener error', error)
    //                 return
    //             }
    //
    //             const b64value = characteristic.value;
    //             const bufferValue = new Buffer(b64value, 'base64');
    //             const value = bufferValue.toString();
    //
    //             console.log('[BLE] Recived value: ', value)
    //         })
    // }

    startScan() {
        console.log('Scan start...');
        var deviceList = []
        var bleManager = new BleManager();
        var btOptions = {
            "allowDuplicates": false,
            "autoConnect": false,
        };

        bleManager.startDeviceScan(null, btOptions, (error, device) => {
            if (error) {
                // Handle error (scanning will be stopped automatically)
                console.log('bleScan error, stopping - ', error);
                return;
            }
            if (!deviceList.includes(device.id)) {
                console.log('add device:', device.id, ', deviceList:', deviceList);
                deviceList.push(device.id)
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(deviceList),
                    isLoading: true
                })
            }
        });

        setTimeout(function () {
            bleManager.stopDeviceScan()
        }, 10000)
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    style={{flex: 1}}
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={(rowData) => <Text>{rowData}</Text>}/>
                <Button onPress={() => this.startScan()}
                        style={{flex: 1}}
                        title="Scan"/>
                <Button onPress={() => this.connectToDevice()}
                        style={{flex: 1, paddingTop: 20, paddingBottom: 20}}
                        title="Connect"/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
