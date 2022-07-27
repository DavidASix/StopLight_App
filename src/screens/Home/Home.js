import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import {stringToBytes} from 'convert-string';
import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

import SSIcon from 'react-native-vector-icons/SimpleLineIcons';

const Home = props => {
  const [r, setRed] = useState(false);
  const [y, setYellow] = useState(false);
  const [g, setGreen] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(false);

  useEffect(() => {
    const bleSetup = async () => {
      await BleManager.start({showAlert: true});
      let connected = await BleManager.getConnectedPeripherals([]);
      setConnectedDevices(connected);
    };
    bleSetup();
  }, []);

  const changeLight = async l => {
    if (!selectedDevice) {
      return console.log('Select a device');
    }
    try {
      let text = stringToBytes('r');
      let w = await BleManager.write(
        selectedDevice.id,
        '0000ffe0-0000-1000-8000-00805f9b34fb',
        '0000ffe1-0000-1000-8000-00805f9b34fb',
        text,
      );
      console.log({w});
    } catch (e) {
      console.log(e);
    }
    let funcs = {r: setRed, y: setYellow, g: setGreen};
    funcs[l](![l]);
  };
  /**
   * would be cool to see the stoplight have a little movement if you drag on the edge of it
   ***/
  return (
    <View style={styles.pageContainer}>
      <View style={styles.headerContainer}>
        <View style={{flex: 1}} />
        <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.title}>
            {false ? 'Connected' : 'Not Connected'}
          </Text>
        </View>
        <View
          style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
          <SSIcon
            name="settings"
            size={35}
            color="#FFF"
            onPress={() => props.navigation.navigate('settings')}
          />
        </View>
      </View>

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.pole}>
          <Image
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              opacity: 0.5,
            }}
            source={require('../../assets/MetalTexture.jpg')}
            resizeMode="cover"
          />
        </View>
        <View style={styles.outline}>
          <View style={styles.lightBox}>
            <TouchableOpacity
              onPress={() => changeLight('r')}
              style={[
                styles.lamp,
                {backgroundColor: 'hsl(0, 10%, 50%)'},
                r && [
                  styles.lampOn,
                  {backgroundColor: '#fc4444', shadowColor: '#FF0000'},
                ],
              ]}>
              <Image
                style={{
                  width: '100%',
                  position: 'absolute',
                  height: '100%',
                  opacity: 0.4,
                }}
                source={require('../../assets/glassTexture.png')}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
          <View
            style={[styles.lightBox, {width: `${(2 / 3) * (3 / 4) * 100}%`}]}>
            <TouchableOpacity
              onPress={() => changeLight('y')}
              style={[
                styles.lamp,
                {backgroundColor: 'hsl(60, 10%, 50%)'},
                y && [
                  styles.lampOn,
                  {backgroundColor: '#f9fc44', shadowColor: '#FFFF00'},
                ],
              ]}>
              <Image
                style={{
                  width: '100%',
                  position: 'absolute',
                  height: '100%',
                  opacity: 0.4,
                }}
                source={require('../../assets/glassTexture.png')}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
          <View
            style={[styles.lightBox, {width: `${(2 / 3) * (3 / 4) * 100}%`}]}>
            <TouchableOpacity
              onPress={() => changeLight('g')}
              style={[
                styles.lamp,
                {backgroundColor: 'hsl(126, 10%, 50%)'},
                g && [
                  styles.lampOn,
                  {backgroundColor: '#44fc57', shadowColor: '#00FF00'},
                ],
              ]}>
              <Image
                style={{
                  width: '100%',
                  position: 'absolute',
                  height: '100%',
                  opacity: 0.4,
                }}
                source={require('../../assets/glassTexture.png')}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: 'hsl(44, 88%, 75%)', //44, 88, 55
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContainer: {
    width: '90%',
    padding: 15,
    flexDirection: 'row',
    //borderBottomWidth: 1,
    borderColor: '#fff',
  },
  title: {
    fontSize: 18,
    color: '#fff',
    textWrap: 'nowrap',
  },
  outline: {
    width: '70%',
    aspectRatio: 0.5,
    maxHeight: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#e9b20e',
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: '#fff',
    shadowColor: '#604806',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6.27,
    elevation: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  lightBox: {
    width: `${(2 / 3) * 100}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 5,
    marginVertical: 3,
  },
  lamp: {
    width: '85%',
    aspectRatio: 1,
    borderRadius: 100,
    borderWidth: 1,
    backgroundColor: '#e9b20e',
    borderColor: '#FFF',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    overflow: 'hidden',
  },
  lampOn: {
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 20,
  },
  pole: {
    position: 'absolute',
    bottom: 0,
    width: 45,
    height: '50%',
    backgroundColor: '#636363',
    overflow: 'hidden',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#fff',
  },
};

export default Home;
