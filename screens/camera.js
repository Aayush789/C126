import React from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class PickImage extends React.Component{
    state = {
        image: null
        
    }

    render(){
        let {image} = this.state
        return(
            <View style = {{flex:1, alignItems:'center',justifyContent: 'center'}}>
                <Button
                title = "pick an image from camera roll"
                onPress = {this._pickImage}/>
            </View>
        )
    }

    componentDidMount(){
        this.getPermissionasync()

        
    }

    getPermissionasync = async()=>{
        if(Platform.OS !== "web"){
            const{status}=await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if(status !=="granted"){alert("Sorry we need camera permissions to make this work.")}
        }
    }

    uploadImage = async(uri)=>{
        const data = new FormData()
        let filename = uri.split("/")[uri.split("/").length - 1]
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`

        const fileToUpload = {
            uri:uri,
            name:filename,
            type:type
        };

        data.append("digit",fileToUpload)
        fetch("https://cf46d2d52079.ngrok.io/predict-digit",{
            method: "POST",
            body: data,
            headers: {
                "conent-type":"multipart/form-data"

                
            }
        })

        .then((response)=>response.json())

        .then((result)=>{
            console.log("success:",result)
        })

        .then((error)=>{
            console.error("error:",error)
            
        })
    }

    _pickImage = async()=>{
        try{
            let result= await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4,3],
                quality: 1
            })

            if(!result.cancelled){
                this.setState({image:result.data})
                this.uploadImage(result.uri)
            }
        }

        catch (E){
            console.log(E)
        }
    }
}


