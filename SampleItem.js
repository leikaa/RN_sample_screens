import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet, Dimensions
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import CheckboxActive from "../CheckboxStatuses/CheckboxActive";
import CheckboxInactive from "../CheckboxStatuses/CheckboxInactive";
import { changeCheckboxSettings } from "../../store/actions/sample";

const window = Dimensions.get('window');
export const SampleItem = ({ item, setIsDisabled = false }) => {
  const dispatch = useDispatch();
  const colorsMap = useSelector(state => state.Sample.colorsMap);
  const [isChecked, setChecked] = useState(item.enabled);

  const onCheckboxPress = () => {
    setChecked(!isChecked);
    if (setIsDisabled) {
      setIsDisabled(false);
    }
    dispatch(changeCheckboxSettings({
      'transferAgreement': item.transferAgreement,
      'enabled': !isChecked
    }));
  };

  return (
    <View style={styles.itemWrapper}>
      <View style={styles.itemDataBlock}>
        <Text
          style={[styles.itemTitle, item.lastActionRef && {color: colorsMap[item.lastActionRef], fontWeight: colorsMap[colorsMap[item.lastActionRef]]}]}>{item.name}</Text>
        <Text
          style={[styles.itemSubText, item.lastActionRef && {color: colorsMap[item.lastActionRef], fontWeight: colorsMap[colorsMap[item.lastActionRef]]}]}>ИНН {item.innCode}, {item.address}</Text>
      </View>
      {
        item.canBeChanged &&
        <TouchableOpacity
          style={styles.checkBox}
          onPress={onCheckboxPress}
          activeOpacity={1}>
          {
            isChecked &&
            <View>
              <CheckboxActive
                width={18}
                height={18}
                color={'#04a1d6'}
              />
            </View>
          }
          {
            !isChecked &&
            <View>
              <CheckboxInactive
                width={18}
                height={18}
                color={'#b9c5d1'}
              />
            </View>
          }
        </TouchableOpacity>
      }
      {
        !item.canBeChanged &&
        <View style={styles.checkBox}>
          <View>
            <CheckboxActive
              width={18}
              height={18}
              color={'#b9c5d1'}
            />
          </View>
        </View>
      }
    </View>
  )
};

const styles = StyleSheet.create({
  mainInfoText: {
    fontSize: window.width <= 320 ? 12 : 14,
    color: '#9e9e9f'
  },
  itemsContainer: {
    marginBottom: 20
  },

  itemWrapper: {
    flexDirection: 'row',
    marginTop: 20,
    flexWrap: 'nowrap'
  },
  itemDataBlock: {
    width: '90%',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#3d3c3e',
  },
  itemSubText: {
    fontSize: 10,
    fontWeight: '300',
    color: '#3d3c3e',
  },
  checkBox: {
    width: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});