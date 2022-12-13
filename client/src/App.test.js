import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import React, { useState } from "react";
import '@testing-library/jest-dom';
import { Button } from '@aws-amplify/ui-react';
import { getImages, searchImages } from './api';

//handleOpenWidget

//handleImageID

//handleLoadMore

//handleSearch

//resetSearch

test('start',() => {
    console.log("Test is working");
});
it('text should be blank on render- image',()=>{
    
    render(<App />);
    const text = screen.queryByTestId("image");
    expect(text).toBe(null);
})
it('text should be blank on render- Search',()=>{
    
    render(<App />);
    const text = screen.queryByTestId("search");
    expect(text).toBe(null);
})
 it('should not return null on query', ()=>{
    
    return getImages().then(data => {
        expect(data.next_cursor).toBe('9f4d5b6495e400bd75a608a7fe3bc104fbba56860819d3bdef7f2df1e4e5be67');
    })
})
it('should return empty with an unmatching search',()=>{
    
    return searchImages("shark").then(data=>{
        expect(data.total_count).toBe(0);
    })
})
it('null search should return all matching images (all images)', ()=>{
    return searchImages("").then(data=>{
        expect(data.total_count).toBe(38);
    }) 
})
it ('should return result with relevant query', ()=>{
    return searchImages("123").then(data=>{
        expect(data.total_count).toBe(1);
    })  
})

it('GivenUserWhenClickSignOutButtonThenApplicationSignOut', () => {
    render(<App />);
    const signOut = screen.getByText('');
    fireEvent.click(signOut);
    expect(signOutSpy).toHaveBeenCalled();
})

describe(App, () => {
    it("upload button", async () => {
        const {getByRole} = render(<App />); 
        const uploadButton = getByRole('uploadButton', { name: 'Upload'});
        fireEvent.click(uploadButton);
        expect(handleOpenWidget).toHaveBeenCalled();
    });
});

describe(App, () => {
    it("sign out button", async () => {
        const {getByRole} = render(<App />); 
        const signOutBttn = getByRole('button', { name: 'SignOut'});
        fireEvent.click(signOutBttn);
        expect(signOut).toHaveBeenCalled();
    });
});

describe(App, () => {
    it("Click more button", async () => {
        const {getByRole} = render(<App />); 
        const moreBttn = getByRole('button', { name: 'Load More'});
        fireEvent.click(moreBttn);
        expect(handleLoadMoreButtonClick).toHaveBeenCalled();
    });
});

