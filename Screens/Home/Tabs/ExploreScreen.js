import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, 
    View, 
    Text, 
    FlatList, 
    ActivityIndicator, 
    TouchableOpacity,
    Image, 
    Linking } from 'react-native';
import Colors from '../../../constants/Colors';

import Feather from '@expo/vector-icons/Feather';

const KEY = '54c178ac258b494e80a70895aef90bc8';

const ExploreScreen = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${KEY}`);
            const data = await response.json();
            setArticles(data.articles);
            console.log(articles)
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const openArticleUrl = (url) => {
        Linking.openURL(url);
    };

    const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.articleContainer} onPress={() => openArticleUrl(item.url)}>
        <TouchableOpacity >
            <View style={{flexDirection:'row', padding:2, borderWidth:0.5, width:"30%",borderColor:Colors.primary_color}} >
            <Text style={{paddingHorizontal:8}}>Follow</Text>
            <Ionicons style={{marginHorizontal:9}} name="add" size={20} color={Colors.primary} />
            </View>
        </TouchableOpacity>
        <Text style={styles.title}>{item.title}</Text>
        <View>
            <Image source={{uri:item.urlToImage}} ></Image>
        </View>
            
        <View style={{flexDirection:'row', padding:6}}>
            <TouchableOpacity>
                <Feather style={{margin:2, justifyContent:'center', alignContent:'center'}} name='thumbs-up' size={24}  />
            </TouchableOpacity>

            <TouchableOpacity>
                <Feather style={{margin:2,paddingTop:4 ,justifyContent:'center', alignContent:'center'}}  name="thumbs-down" size={24}  />
            </TouchableOpacity>

            <TouchableOpacity>
                <Ionicons  style={{margin:2, justifyContent:'center', alignContent:'center'}} name="share-outline" size={25} />
            </TouchableOpacity>
            <TouchableOpacity style={{marginLeft:'60%'}} >
            <Ionicons  style={{ paddingTop:6}} name="ellipsis-vertical" size={24} />
            </TouchableOpacity>
            
        </View>
    </TouchableOpacity>
);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary_color} />
            ) : (
                <FlatList
                    data={articles}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background_color,
        padding: 8,
    },
    articleContainer: {
        marginBottom: 2,
        padding: 12,
        borderBottomWidth:1,
        borderColor: Colors.primary_color,
        backgroundColor: Colors.background_color,
    },
    title: {
        fontSize: 17,
        fontWeight: 'normal',
        marginBottom: 8,
        paddingTop:5
    },
    description: {
        fontSize: 16,
        color: '#666',
    },
    icon:{

    }
});

export default ExploreScreen;
