import { useState } from 'react';
import React from 'react';
import { StyleSheet, Text, View, SectionList, Button, Switch, TouchableOpacity, TextInput, Image, useWindowDimensions } from 'react-native';

const Settings = () => {
  const styles = makeStyles();
  return (
    <View style={styles.container}>
      <SectionList
        sections={[
          {
            title: 'Section Header 1',
            data: [
              ["Setting 1", (value)=>{console.log("Setting 1 pressed test: "+value)}],
              ['Setting 2'],
              ['Setting 3'],
            ],
          },
          {
            title: 'Section Header 2',
            data: [
              ['Setting 4'],
              ["Setting 5", (value)=>{console.log("Setting 5 pressed test: "+value)}],
            ],
          },
        ]}
        renderItem={({item}) => <View style={styles.row}>{settingsSection(item[0], item[1])}</View>}
        renderSectionHeader={({section}) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={item => `basicListEntry-${item}`}
      />
    </View>
  );
};

export default Settings;

function makeStyles(){
  const {fontScale} = useWindowDimensions();
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    sectionHeader: {
      paddingTop: 2,
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 2,
      fontSize: 22 / fontScale,
      fontWeight: 'bold',
      backgroundColor: 'rgba(247,247,247,1.0)',
    },
    settingSwitch: {
      padding: 10,
      alignItems: 'right',
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'flex-end',
      // This can change the size of the switch but it will no longer be positioned correctly
      // transform: [{ scaleX: .8 }, { scaleY: .8 }]
    },
    row: {
      flexDirection: 'row',
      minWidth: '100%',
      flex: 1,
    },
    settingTitle: {
      padding: 10,
      fontSize: 20 / fontScale,
      height: 44,
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'flex-start',
    },
  });
};

function settingsSection(title, settingFn = (enabled) => (defaultSettingFunction(title, enabled))){
  const styles = makeStyles();
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    settingFn(isEnabled);
  };
  return (
    <>
        <Text style={styles.settingTitle}>{title}</Text>
        <View style={styles.settingSwitch}>
          <Switch
            onValueChange={toggleSwitch}
            value={!isEnabled}
          />
        </View>
    </>
  )
}

function defaultSettingFunction(title, isEnabled){
  console.log(title+' pressed: '+isEnabled);
}