import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from "react-navigation-hooks";

import CommonButton from "../../components/Common/CommonButton";
import Preloader from "../../components/Common/Preloader";
import { SampleItem } from "../../components/SampleScreens/SampleItem";
import { GetRelevantAccessToken } from "../../helpers/GetRelevantAccessToken";
import {
  getColorsLegend,
  getCurrentSettings,
  sendChangeSettingsRequest
} from "../../store/actions/sample";

const window = Dimensions.get('window');
const MainScreen = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.Authorization.accessToken);
  const accessTokenExpirationTime = useSelector(state => state.Authorization.accessTokenExpirationTime);
  const refreshToken = useSelector(state => state.Authorization.refreshToken);
  const currentSampleSettings = useSelector(state => state.Sample.currentSettings);
  const aggregateId = useSelector(state => state.Sample.aggregateId);
  const checkboxSettings = useSelector(state => state.Sample.checkboxSettings);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [submitDate, setSubmitDate] = useState('');
  const [submitSummary, setSubmitSummary] = useState('');

  const SampleInfoText = 'Тестовый текст';

  useEffect(() => {
    async function getFetchData() {
      const relevantAccessToken = await GetRelevantAccessToken(dispatch, accessToken, accessTokenExpirationTime, refreshToken, navigate);
      dispatch(getColorsLegend(
        relevantAccessToken,
        setIsLoading,
        )
      );
      dispatch(getCurrentSettings(
        relevantAccessToken,
        setIsLoading,
        setSubmitDate,
        setSubmitSummary
        )
      );
    }

    getFetchData();
  }, []);

  const onSubmitPress = () => {
    setIsSubmitLoading(true);
    async function getFetchSubmitData() {
      const relevantAccessToken = await GetRelevantAccessToken(dispatch, accessToken, accessTokenExpirationTime, refreshToken, navigate);
      dispatch(sendChangeSettingsRequest(
        relevantAccessToken,
        setIsSubmitLoading,
        checkboxSettings,
        setSubmitDate,
        setSubmitSummary,
        aggregateId
        )
      );
    }
    getFetchSubmitData();
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
          <ScrollView style={styles.contentContainer}>
            <Text style={styles.mainInfoText}>{SampleInfoText}</Text>
            <View style={styles.itemsContainer}>
              {
                currentSampleSettings.distribution.map(item => (
                  <SampleItem
                    key={item.transferAgreement}
                    item={item}
                    setIsDisabled={setIsDisabled}
                  />
                ))
              }
            </View>
          </ScrollView>
          <View style={styles.button}>
            <View style={styles.submitWarningContainer}>
              {
                submitDate.length > 0 &&
                <Text style={styles.submitWarningText}>
                  Действует с {submitDate} (МСК)
                </Text>
              }
              {
                submitSummary.length > 0 &&
                <Text style={styles.submitWarningText}>
                  {submitSummary}
                </Text>
              }
            </View>
            <CommonButton
              name={'Сохранить изменения'}
              onPress={onSubmitPress}
              isDisabled={isDisabled}
              isLoading={isSubmitLoading}
            />
          </View>
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

  mainInfoText: {
    fontSize: window.width <= 320 ? 12 : 14,
    color: '#9e9e9f'
  },
  itemsContainer: {
    marginBottom: 20
  },

  button: {
    marginBottom: 22,
    width: '90%',
    left: '5%',
    backgroundColor: '#fff'
  },
  submitWarningContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  submitWarningText: {
    fontSize: window.width <= 320 ? 14 : 16,
    textAlign: 'center'
  },
});

export default MainScreen;
