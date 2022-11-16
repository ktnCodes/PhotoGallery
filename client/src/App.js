import { withAuthenticator } from '@aws-amplify/ui-react';
import React, { useEffect, useState } from 'react';
import {getImages, searchImages} from './api';
import axios from "axios";
import './App.css';

function App({signOut, user }) {
  const [imageList, setImageList] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [images, setImages] = useState([]);
  const [imageToRemove, setImageToRemove] = useState(null);

//remove image logic with button "currently doesnt work but assignment does spep"
  function handleRemoveImg(imgObj) {
    setImageToRemove(imgObj.public_id);
    axios.delete(`http://localhost:8080/${imgObj.public_id}`)
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
      },
      (error, result) => { 
          if (!error && result && result.event === "success") { 
              setImages((prev) => [...prev, {url: result.info.url, public_id: result.info.public_id}])
              window.location.reload(false);
          }
        }
    );
    //open upload widget
    myWidget.open();
  }

  // //parameters for uploaded pictures
  // cloudinary.openUploadWidget({
  //   upload_preset: "preset1",
  //   cloud_name: "demo",
  //   prepareUploadParams: (cb, params) => {
  //     params = [].concat(params);  //params can be a single object or an array of objects
  //     Promise.all(params.map((req) =>
  //       makeAjaxRequest("https://mysite.example.com/prepare", req)
  //         .then((response) => Object.assign({
  //           signature: response.signature,
  //           apiKey: response.api_key,
  //         }, response.upload_params))
  //     ))
  //       .then((results) =>
  //         cb(results.length === 1 ? results[0] : results));
  //   }
  // }, (error, result) => { });


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
