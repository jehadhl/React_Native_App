import React, { Children, useCallback, useEffect, useState } from 'react'
import { View, Text, StatusBar, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../theme'
import { CalendarDaysIcon, MagnifyingGlassIcon, MapPinIcon, } from "react-native-heroicons/outline"
import { debounce } from "lodash"
import * as Progress from 'react-native-progress';
import { fetchLocations, fetchWeatherForecast } from '../api/weather'
import { weatherImages } from '../constants'
import { getData, storeData } from '../utils/asyncStorage'

const HomePage = () => {
    const [weater, setWeater] = useState({})
    const [showSearch, setShowSearch] = useState(false)
    const [loactions, setLocations] = useState([])
    const [loading, setLoading] = useState(true);



    const handleClick = (item) => {
        setLoading(true);
        setLocations([])
        fetchWeatherForecast({
            cityName: item.name,
            days: 7,
        }).then(data => { 
            setLoading(false)
            setWeater(data) 
            storeData('city',item.name);
        })

    }


    const handleSearch = (value) => {
        console.log(value)
        if (value.length > 2) {
            fetchLocations({ cityName: value }).then(data => { setLocations(data) })
        }
    }

    const { current, location } = weater

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])


    useEffect(() => {
        fetchData()
    }, [])


    const fetchData = async () => {
        let myCity = await getData('city');
        let cityName = 'dubai';
        if(myCity){
            cityName = myCity
        }
        fetchWeatherForecast({
            cityName,
            days: 7
        }).then((item) => {
            console.log(item)
            setWeater(item)
            setLoading(false);
        })
    }


    return (
        <React.Fragment >
            <Image
                blurRadius={70}
                source={require('../assets/images/bg.png')}
                style={{ position: "absolute", height: "100%", width: "100%", bottom: 0, top: 0 }} />
            <StatusBar
                animated={true}
                backgroundColor="transparent"
                barStyle="light-content"
                translucent={true}
            />




            {loading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
                </View>
            ) :
                (
                    <ScrollView style={{ height: "auto", flex: 1 }} keyboardShouldPersistTaps='always'>
                        <View style={{ flex: 1, height: "100%", position: "relative" }}
                        >
                            <SafeAreaView style={{ flex: 1, display: "flex", height: "auto" }} >

                                <View style={{ height: "8%", marginLeft: 16, marginRight: 16, position: "relative", zIndex: 50, marginTop: 10, marginBottom: 10 }} >
                                    <View style={{ backgroundColor: showSearch ? theme.bgWhite(0.2) : "transparent", borderRadius: 100, flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                                        {
                                            showSearch ? (
                                                <TextInput
                                                    placeholder='search city'
                                                    style={{ paddingLeft: 24, fontSize: 17, color: "#fff", flex: 1, height: 46 }}
                                                    placeholderTextColor={"lightgray"}
                                                    onChangeText={handleTextDebounce}
                                                />
                                            ) : null
                                        }
                                        <TouchableOpacity onPress={() => setShowSearch(!showSearch)} style={{ backgroundColor: theme.bgWhite(0.3), borderRadius: 100, margin: 4, padding: 12 }} >
                                            <MagnifyingGlassIcon size={25} color={"white"} />
                                        </TouchableOpacity>
                                    </View>
                                    {
                                        loactions.length > 0 && showSearch ? (
                                            <View style={{ position: "absolute", width: "100%", backgroundColor: "#fff", top: 67, borderRadius: 25 }}>
                                                {
                                                    loactions.map((item, index) => {
                                                        const isLastItem = index === loactions.length - 1;
                                                        return (
                                                            <TouchableOpacity key={index}
                                                                onPress={() => handleClick(item)}
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    alignItems: 'center',
                                                                    padding: 12,
                                                                    paddingLeft: 16,
                                                                    paddingRight: 16,
                                                                    marginBottom: 4,
                                                                    borderBottomWidth: isLastItem ? 0 : 1,
                                                                    borderBottomColor: isLastItem ? 'transparent' : 'gray'
                                                                }}>
                                                                <MapPinIcon size={20} color={"gray"} />
                                                                <Text>{item?.name} , {item?.country}</Text>
                                                            </TouchableOpacity>
                                                        )
                                                    })
                                                }
                                            </View>
                                        ) : null
                                    }
                                </View>



                                <View style={{ marginLeft: 16, marginRight: 16, flex: 1, marginBottom: 12, marginTop: 10, justifyContent: "space-around", }}>
                                    <Text style={{ color: "white", textAlign: "center", fontWeight: "bold", fontSize: 26, marginBottom: 20, }}>
                                        {location?.name},
                                        <Text style={{ fontWeight: "600", fontSize: 20, color: "#eeeeff" }}>
                                            {location?.country}
                                        </Text>
                                    </Text>

                                    <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                                        <Image source={weatherImages[current?.condition?.text]} style={{ width: 200, height: 200 }} />
                                    </View>

                                    <View style={{ marginBottom: 20, marginTop: 20 }}>
                                        <Text style={{ fontSize: 60, textAlign: "center", color: "#fff", fontWeight: "bold" }}>
                                            {current?.temp_c}°
                                        </Text>
                                        <Text style={{ textAlign: "center", color: "#fff", fontWeight: 400, fontSize: 20 }}>
                                            {current?.condition.text}
                                        </Text>
                                    </View>

                                    <View style={{ justifyContent: "space-between", marginBottom: 20, marginTop: 20, flexDirection: "row" }}>
                                        <View style={{ flexDirection: "row", gap: 10 }}>
                                            <Image source={require("../assets/icons/wind.png")} style={{ height: 30, width: 30 }} />
                                            <Text style={{ fontSize: 18, color: "#fff", fontWeight: "600" }}>
                                                {current?.wind_kph}KM
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: "row", gap: 10 }}>
                                            <Image source={require("../assets/icons/drop.png")} style={{ height: 30, width: 30 }} />
                                            <Text style={{ fontSize: 18, color: "#fff", fontWeight: "600" }}>
                                                {current?.humidity} %
                                            </Text>
                                        </View>

                                        <View style={{ flexDirection: "row", gap: 10 }}>
                                            <Image source={require("../assets/icons/sun.png")} style={{ height: 30, width: 30 }} />
                                            <Text style={{ fontSize: 18, color: "#fff", fontWeight: "600" }}>
                                                {weater?.forecast?.forecastday[0]?.astro?.sunrise}
                                            </Text>
                                        </View>
                                    </View>

                                </View>


                                <View style={{ marginBottom: 0, gap: 10, marginTop: 0, flex: 1 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 15, marginBottom: 10 }}>
                                        <CalendarDaysIcon size={20} color={"#fff"} />
                                        <Text style={{ fontSize: 18, color: "#fff" }}>Daylie forecast</Text>
                                    </View>
                                    <ScrollView
                                        horizontal
                                        contentContainerStyle={{ paddingHorizontal: 15 }}
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        {weater?.forecast?.forecastday.map((item, index) => {
                                            let date = new Date(item.date)
                                            let options = { weekday: "long" }
                                            let dayName = date.toLocaleDateString("en-US", options)
                                            dayName = dayName.split(",")[0]
                                            return (
                                                <View
                                                    key={index}
                                                    style={{
                                                        backgroundColor: theme.bgWhite(0.15), justifyContent: "center", marginRight: 15,
                                                        alignItems: "center", width: 80, borderRadius: 20, paddingVertical: 12,
                                                    }}
                                                >
                                                    <Image source={weatherImages[item?.day.condition.text]} style={{ width: 45, height: 45 }} />
                                                    <Text style={{ color: "#fff" }}>{dayName}</Text>
                                                    <Text style={{ color: "#fff", fontSize: 20, fontWeight: "600" }}>{item?.day?.avgtemp_c}°</Text>
                                                </View>
                                            )
                                        })}



                                    </ScrollView>
                                </View>

                            </SafeAreaView>
                        </View>
                    </ScrollView>
                )}
        </React.Fragment>
    )
}

export default HomePage
