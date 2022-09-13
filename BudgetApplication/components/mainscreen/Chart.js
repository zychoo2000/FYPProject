import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import SuperSafeAreaView from '../SuperComponent/SuperSafeAreaView';
import {View, FlatList} from 'react-native';
import {VictoryPie} from 'victory-native';
import {useState as useHookState} from '@hookstate/core';
import SuperLabel from '../SuperComponent/SuperLabel';
import {record} from '../module/GlobalVariable';

const ChartScreen = ({navigation, route}) => {
  const {width, height} = Dimensions.get('window');
  const globalVariable = useHookState(record);
  const colorList = {
    clothing: 'tomato',
    entertainment: 'orange',
    electronics: 'gold',
    foodandbeverage: 'cyan',
    healthcare: 'navy',
    housing: 'coral',
    shopping: '#9932CC',
    transportation: '#228B22',
    utility: '#FF69B4',
  };
  const totalAllCategory = () => {
    var totalObj = globalVariable.totalEachCategory.get();
    var total = 0;
    for (const item in totalObj) {
      total = total + totalObj[item];
    }
    return total;
  };
  const data = () => {
    var pieData = [];
    var totalCategory = globalVariable.totalEachCategory.get();
    console.log(totalCategory);
    var data = [];
    for (var key in totalCategory) {
      var pieData = {};
      pieData['x'] = key;

      pieData['y'] = totalCategory[key];

      pieData['label'] =
        (
          (parseFloat(totalCategory[key]) / parseFloat(totalAllCategory())) *
          100
        ).toFixed(1) + '%';
      pieData['fill'] = colorList[key];
      data.push(pieData);
    }

    return data;
  };
  const renderItem = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 40,
          paddingHorizontal: 12,
          borderRadius: 10,
          backgroundColor: 'white',
          marginVertical: 3,
        }}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor: item.fill,
              borderRadius: 5,
            }}></View>
          <SuperLabel style={{marginLeft: 8}}>{item.x}</SuperLabel>
        </View>
        <View style={{justifyContent: 'center'}}>
          <SuperLabel style={{}} mode={'medium'}>
            RM{item.y.toFixed(2)} - {item.label}
          </SuperLabel>
        </View>
      </View>
    );
  };
  return (
    <SuperSafeAreaView navigation={route.name} mode={''}>
      <View style={{paddingBottom: 60, flex: 1}}>
        {totalAllCategory() === 0 ? (
          <View
            style={{
              flex: 1,
              height: 600,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <SuperLabel mode={'large'} style={{}}>
              No data available
            </SuperLabel>
          </View>
        ) : (
          <View style={{flex: 1, marginTop: 10}}>
            <SuperLabel
              mode={'large'}
              style={{textAlign: 'center', marginTop: 5, marginBottom: 10}}>
              Expense By Category
            </SuperLabel>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <View style={{flex: 1}}>
                <VictoryPie
                  data={data()}
                  style={{
                    data: {
                      fill: ({datum}) => datum.fill,
                      fontSize: 20,
                      fontWeight: 'bold',
                    },
                  }}
                  labels={({datum}) => datum.y}
                  radius={width * 0.4 - 10}
                  innerRadius={70}
                  labelRadius={({innerRadius}) =>
                    (width * 0.4 + innerRadius) / 2.5
                  }
                  width={width * 0.8}
                  height={width * 0.8}
                />
              </View>
            </View>
            <View style={{padding: 24, marginTop: 320}}>
              <FlatList data={data()} renderItem={renderItem}></FlatList>
            </View>
          </View>
        )}
      </View>
    </SuperSafeAreaView>
  );
};
export default ChartScreen;
