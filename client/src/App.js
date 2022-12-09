import { withAuthenticator } from '@aws-amplify/ui-react';
import React, { useEffect, useState } from 'react';
import { getImages, searchImages } from './api';
import './App.css';

function App({ signOut, user }) {
  const [imageList, setImageList] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [text, setText] = React.useState("");

  //logic for fetching images
  useEffect(() => {
    const fetchData = async () => {
      const responseJson = await getImages();
      setImageList(responseJson.resources);
      setNextCursor(responseJson.next_cursor);
    };
    fetchData();
  }, []);

  //logic for upload image using API Cloudinary widget
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
      });
    myWidget.open();
  }

  //logic for title of image
  function handleImageID(event) {
    const newText = event.target.value
    setText(newText)
  }

  //logic for load more button
  const handleLoadMore = async () => {
    const responseJson = await getImages(nextCursor);
    setImageList((currentImageList) => [...currentImageList, ...responseJson.resources]);
    setNextCursor(responseJson.next_cursor);
  };

  //logic for search
  const handleSearch = async (event) => {
    event.preventDefault();
    const responseJson = await searchImages(searchValue, nextCursor);
    setImageList(responseJson.resources);
    setNextCursor(responseJson.next_cursor);
  };

  //logic for reset search value
  const resetSearch = async () => {
    const responseJson = await getImages();
    setImageList(responseJson.resources);
    setNextCursor(responseJson.next_cursor);
    setSearchValue('');
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <div className="App">
          {user.attributes.email}
          <button type='button' onClick={signOut}>SignOut</button>
          <input
            data-testid="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            required='required'
            placeholder='Enter a search value...'></input>
          <button type='submit'>Search</button>
          <button type='button' onClick={resetSearch}>Clear</button>
        </div>
      </form>
      <button type='uploadButton' onClick={() => handleOpenWidget()}>Upload</button>
      <div className='image-grid'>
        {imageList.map((image) => (
          <div className='image-preview'>
            <input type="text" data-testid="image" className="input" onChange={handleImageID} value={image.public_id} />
            <img src={image.url} alt={image.public_id}></img>
          </div>
        ))}
      </div>
      <div className='footer'>
        {nextCursor && <button onClick={handleLoadMore}>Load More</button>}
      </div>
    </>
  );
};

export default withAuthenticator(App);