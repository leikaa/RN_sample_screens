import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  FlatList
} from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "react-navigation-hooks";
import moment from "moment";

import CheckboxActive from "../../components/CheckboxStatuses/CheckboxActive";
import CheckboxInactive from "../../components/CheckboxStatuses/CheckboxInactive";
import Preloader from "../../components/Common/Preloader";
import { GetRelevantAccessToken } from "../../helpers/GetRelevantAccessToken";
import { getHistorySettings } from "../../store/actions/sample";

const window = Dimensions.get('window');
const HistoryScreen = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const colorsMap = useSelector(state => state.Sample.colorsMap);
  const historySampleSettings = useSelector(state => state.Sample.historySettings);
  const accessToken = useSelector(state => state.Authorization.accessToken);
  const accessTokenExpirationTime = useSelector(state => state.Authorization.accessTokenExpirationTime);
  const refreshToken = useSelector(state => state.Authorization.refreshToken);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getFetchData() {
      const relevantAccessToken = await GetRelevantAccessToken(dispatch, accessToken, accessTokenExpirationTime, refreshToken, navigate);
      dispatch(getHistorySettings(
        relevantAccessToken,
        setIsLoading
        )
      );
    }

    getFetchData();
  }, []);

  const renderListItem = item => {
    return (
      <View key={item.actualPeriodStart} style={styles.itemWrapper}>
        <View style={styles.titleInfoSection}>
          <Text style={styles.mainInfoText}>
            C {moment(item.actualPeriodStart).format('H:mm DD.MM.YYYY')} до {moment(item.actualPeriodEnd).format('H:mm DD.MM.YYYY')} (МСК)
          </Text>
          {
            item.changeSummary.length > 0 &&
            <Text style={styles.mainInfoText}>
              {item.changeSummary}
            </Text>
          }
          {
            item.changeSource.length > 0 &&
            <Text style={styles.subInfoText}>
              Источик изменения: {item.changeSource}.
            </Text>
          }
        </View>

        {
          item.distribution.map(distItem => {
            const isChecked = distItem.enabled;

            return (
              <View key={distItem.transferAgreement} style={styles.distItemWrapper}>
                <View style={styles.itemDataBlock}>
                  <Text
                    style={[styles.itemTitle, distItem.lastActionRef && {color: colorsMap[distItem.lastActionRef], fontWeight: colorsMap[colorsMap[distItem.lastActionRef]]}]}>{distItem.name}</Text>
                  <Text
                    style={[styles.itemSubText, distItem.lastActionRef && {color: colorsMap[distItem.lastActionRef], fontWeight: colorsMap[colorsMap[distItem.lastActionRef]]}]}>ИНН {distItem.innCode}, {distItem.address}</Text>
                </View>
                {
                  isChecked && distItem.canBeChanged &&
                  <View style={styles.checkBox}>
                    <CheckboxActive
                      width={18}
                      height={18}
                      color={'#b9c5d1'}
                    />
                  </View>
                }
                {
                  !isChecked && distItem.canBeChanged &&
                  <View style={styles.checkBox}>
                    <CheckboxInactive
                      width={18}
                      height={18}
                      color={'#b9c5d1'}
                    />
                  </View>
                }
              </View>
            )
          })
        }
      </View>
    )
  };

  return (
    <SafeAreaView style={styles.content}>
      {
        isLoading &&
        <Preloader/>
      }
      {
        !isLoading &&
        <View style={styles.content}>
          {
            historySampleSettings.length > 0 &&
            <FlatList
              style={styles.contentContainer}
              showsVerticalScrollIndicator={false}
              data={historySampleSettings}
              renderItem={({item}) => (
                renderListItem(item)
              )}
              keyExtractor={(item, index) => index.toString()}
              initialNumToRender={5}
              updateCellsBatchingPeriod={50}
              maxToRenderPerBatch={5}
              windowSize={11}
            />
          }
          {
            !historySampleSettings.length &&
            <View style={styles.noHistoryMessage}>
              <Text>У вас еще нет истории изменений</Text>
            </View>
          }
        </View>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 18,
  },

  titleInfoSection: {
    marginBottom: 20
  },
  mainInfoText: {
    fontSize: window.width <= 320 ? 12 : 16,
    color: '#000',
    fontWeight: 'bold'
  },
  subInfoText: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold'
  },

  itemWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap'
  },
  itemDataBlock: {
    width: '90%',
  },
  distItemWrapper: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
    marginBottom: 20
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#3d3c3e',
  },
  itemSubText: {
    fontSize: 10,
    fontWeight: '300',
    color: '#9e9e9f',
  },
  checkBox: {
    width: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },

  noHistoryMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  }
});

export default HistoryScreen;
