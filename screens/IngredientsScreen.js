import React from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import firebase from "firebase";
import { Ionicons } from "@expo/vector-icons";


export default class Ingredients extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            ingredients: [],
        };
    }
    
    // Component Did Mount
    componentDidMount = async () => {
        try {
        await this.retrieveData();
        }
        catch (error) {
        console.log(error);
        }
    };

    // Retrieve Data
    retrieveData = async () => {
        ingredients = []
        const { navigation } = this.props;
        try {
        let initialQuery = await firebase.firestore().collection("dish")
        let documentSnapshots = await initialQuery.get();
        let documentData = documentSnapshots.docs.map(document => document.data());

        for (let i = 0; i<documentData.length; i++) {
            const data = (documentData[i].ingredients[navigation.getParam("categorie")])
            
            if (data !== undefined) {
                for (let j=0; j < data.length; j++) {
                    if (ingredients.includes(data[j]) == false) {
                        ingredients.push(data[j])                        
                    }
                }
            }
        }

        // Set State
        this.setState({
            ingredients: ingredients,
        });

        } catch (error) {
        console.log(error);
        }
    }

    renderPost = post => {

        return (
            <View style={styles.feedItem}>
                <View style={{ flex: 1}}>
                    <TouchableOpacity>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View>
                                <Text style={styles.name}>{post}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")}>
                        <Ionicons name="md-arrow-back" size={24} color="#000000"></Ionicons>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{navigation.getParam("continents")}</Text>
                    <TouchableOpacity onPress={() => alert("Camera")}>
                        <Ionicons name="md-camera" size={24} color="#000000"></Ionicons>
                    </TouchableOpacity>
                </View>

                <FlatList
                    style={styles.feed}
                    data={this.state.ingredients}
                    renderItem={({ item }) => this.renderPost(item)}
                    keyExtractor={(item, index) => String(index)} 
                    showsVerticalScrollIndicator={false}
                ></FlatList>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EBECF4"
    },
    header: {
        paddingTop: 64,
        paddingBottom: 16,
        backgroundColor: "#FFF",
        alignItems: "center",
        //justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EBECF4",
        shadowColor: "#454D65",
        shadowOffset: { height: 5 },
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10,


        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB"
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "500",
    },
    feed: {
        marginHorizontal: 16
    },
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        marginVertical: 8,
        height: 50,
        alignItems: "center"
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 16
    },
    name: {
        fontSize: 15,
        fontWeight: "500",
        color: "#454D65"
    },
    timestamp: {
        fontSize: 11,
        color: "#C4C6CE",
        marginTop: 4
    },
    post: {
        marginTop: 16,
        fontSize: 14,
        color: "#838899"
    },
    postImage: {
        width: undefined,
        height: 150,
        borderRadius: 5,
        marginVertical: 16
    }
});