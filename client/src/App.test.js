import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React, { useState } from "react";
import '@testing-library/jest-dom';
import App from './App';

beforeEach(() => {
    render(<Login />); //render login 
    //provide username
    const username = screen.getByTestId('usernameTest');
    fireEvent.change(username, { target: { value: '' } });

    //provide password
    const password = screen.getByTestId('usernameTest');
    fireEvent.change(password, { target: { value: '' } });

    //login
    const login = screen.getByTestId('loginTest');
    fireEvent.click(login);

    //user to pass
    const user =
    {
    }
    render(<App user={{ user: user, isSignedIn: true }} />);
});

afterEach(() => {
    cleanup();
});

//test upload widget if it opens
test('handleOpenWidget', () => {
    const handleOpenWidget = screen.getByTestId('');
    expect(handleOpenWidget).toBeInTheDocument();
    expect(handleOpenWidget).toHaveTextContent("widget");
    
});