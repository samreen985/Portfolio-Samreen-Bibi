import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';

const Stack = createStackNavigator();

const FeedScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [liked, setLiked] = useState({});
  const [commentInputVisible, setCommentInputVisible] = useState({});

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  const handleLike = (id) => {
    setLiked(prevLiked => ({ ...prevLiked, [id]: !prevLiked[id] }));
  };

  const toggleCommentInput = (id) => {
    setCommentInputVisible(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCommentChange = (id, text) => {
    setComments(prevComments => ({ ...prevComments, [id]: text }));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PostDetails', { post: item })}>
      <View style={styles.post}>
        <Text style={styles.name}>User {item.userId}</Text>
        <Text style={styles.text}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleLike(item.id)}>
          <Text style={styles.likeButton}>{liked[item.id] ? '❤️ Liked' : '🤍 Like'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleCommentInput(item.id)}>
          <Text style={styles.commentButton}>💬 Comment</Text>
        </TouchableOpacity>
        {commentInputVisible[item.id] && (
          <TextInput
            style={styles.commentInput}
            placeholder="Add your comment"
            value={comments[item.id] || ''}
            onChangeText={(text) => handleCommentChange(item.id, text)}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Social Media App</Text>
      <FlatList data={posts} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />
    </View>
  );
};

const PostDetailsScreen = ({ route }) => {
  const { post } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.name}>User {post.userId}</Text>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.text}>{post.body}</Text>
    </View>
  );
};

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Feed" component={FeedScreen} options={{ title: 'Feed' }} />
      <Stack.Screen name="PostDetails" component={PostDetailsScreen} options={{ title: 'Post Details' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#dfe6e9', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#2d3436' },
  post: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#2d3436' },
  text: { fontSize: 16, color: '#636e72' },
  likeButton: { fontSize: 18, color: '#ff4d4d', marginTop: 10 },
  commentButton: { fontSize: 18, color: '#007bff', marginTop: 10 },
  commentInput: { marginTop: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, fontSize: 16 },
});

export default App;
