import React from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import firebase from "firebase";

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: []
        };
    }

    // Component Did Mount
    componentDidMount = () => {
        try {
        this.retrieveData();
        }
        catch (error) {
        console.log(error);
        }
    };

    // Retrieve Data
    retrieveData = async () => {
        const categories = []
        try {
        let initialQuery = await firebase.firestore().collection("dish")
        let documentSnapshots = await initialQuery.get();
        let documentData = documentSnapshots.docs.map(document => document.data());
        for (let i = 0; i < documentData.length; i++) {
            const data = Object.keys(documentData[i].ingredients)
            for (let j = 0; j < data.length; j++) {
                if (categories.includes(data[j]) == false) {
                    categories.push(data[j])
                }
            }   
        }

        // Set State
        this.setState({
            categories: categories
        });
        
        } catch (error) {
            console.log(error);
        }
    }

    renderPost = post => {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.feedItem}>
                <View style={{ flex: 1}}>
                    <TouchableOpacity onPress={ () => navigate('Ingredients', {categorie: post})}>
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
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Categorie</Text>
                </View>
                <FlatList
                    style={styles.feed}
                    data={this.state.categories}
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
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EBECF4",
        shadowColor: "#454D65",
        shadowOffset: { height: 5 },
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "500"
    },
    feed: {
        marginHorizontal: 16
    },
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        marginVertical: 8
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
