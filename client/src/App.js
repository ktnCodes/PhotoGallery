import { withAuthenticator } from '@aws-amplify/ui-react';
import React, { useEffect, useState } from 'react';
import {getImages, searchImages} from './api';
import axios from "axios";
import './App.css';

function App({signOut, user }) {
  const [imageList, setImageList] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [text, setText] = React.useState("");
  const [images, setImages] = useState([]);
  const [imageToRemove, setImageToRemove] = useState(null);

//remove image logic with button "currently doesnt work but assignment does spep"
  function handleRemoveImg(imgObj) {
    setImageToRemove(imgObj.public_id);
    axios.delete(`http://localhost:7000/${imgObj.public_id}`)
         .then(() => {
              setImageToRemove(null);
              setImages((prev) => prev.filter((img) => img.public_id !== imgObj.public_id));
         })
         .catch((e) => console.log(e));
  }

  //upload image widget
  function handleOpenWidget() { 
    var myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dqomn2sdv', 
        uploadPreset: 'bpiofvtp',
        sources: [
          "local",
          "url",
          "unsplash"
        ],
        googleApiKey: "<image_search_google_api_key>",
        showAdvancedOptions: true,
        cropping: false,
        multiple: true,
        defaultSource: "local",
      },
      (error, result) => { 
          if (!error && result && result.event === "success") { 
              alert(result.info.secure_url);
              console.log('Done! Here is the image info: ', result.info)
              setImages((prev) => [...prev, {url: result.info.url, public_id: result.info.public_id}])
          }
        }
    );
    myWidget.open();
  }

  //name of the images on top
  function handleText(event){
    const newText = event.target.value
    setText(newText)
  }

  useEffect(() => {
      const fetchData = async() => {
          const responseJson = await getImages();
          setImageList(responseJson.resources);
          setNextCursor(responseJson.next_cursor);
      };

      fetchData();
  }, []);

  //logic for load more button
  const handleLoadMoreButtonClick = async ()=> {
    const responseJson = await getImages(nextCursor);
    setImageList((currentImageList)=> [...currentImageList,  ...responseJson.resources]);
    setNextCursor(responseJson.next_cursor);
  };

  //logic for search
  const handleFormSubmit = async (event) => {
		event.preventDefault();

		const responseJson = await searchImages(searchValue, nextCursor);
		setImageList(responseJson.resources);
		setNextCursor(responseJson.next_cursor);
	};

  //reset search value
	const resetForm = async () => {
		const responseJson = await getImages();
		setImageList(responseJson.resources);
		setNextCursor(responseJson.next_cursor);

		setSearchValue('');
	};

  return (
    <>
      <form onSubmit={handleFormSubmit}>
      <div className="App">
          {user.attributes.email}
          <button type='button' onClick={signOut}>SignOut</button>
          <input 
          value={searchValue}
          onChange={(event)=> setSearchValue(event.target.value)}
          required='required'
          placeholder='Enter a search value...'></input>
          <button type='submit'>Search</button>
          <button type='button' onClick={resetForm}>Clear</button>
          </div>
          </form>
          <button type='uploadButton' onClick={() => handleOpenWidget()}>Upload</button>
      

      {/*image logic*/}
      <div className='image-grid'>
        {imageList.map((image) => (
          <div className='image-preview'>
          <img src={image.url} alt={image.public_id}></img>
          {imageToRemove != image.public_id && <i className="fa fa-times-circle close-icon" onClick={() => handleRemoveImg(image)}></i>}
          </div>
      ))}
      
    </div>
      <div className='footer'>
          {nextCursor && <button onClick={handleLoadMoreButtonClick}>Load More</button>}
      </div>
    </>
  );
};

export default withAuthenticator(App);
