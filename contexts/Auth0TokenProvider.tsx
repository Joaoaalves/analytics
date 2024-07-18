import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Auth0TokenContextType } from '@/types/auth0';
import { useLocalStorage } from 'usehooks-ts';

const Auth0TokenContext = createContext<Auth0TokenContextType | undefined>(undefined);

export const useAuth0Token = () => {
  const context = useContext(Auth0TokenContext);
  if (!context) {
    throw new Error('useAuth0Token must be used within an Auth0TokenProvider');
  }
  return context;
};

export const Auth0TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useLocalStorage('accessToken', '')

  useEffect(() => {
    
    const lookForToken = async () => {
      const response = await axios.get('/api/auth0token')
      const newAccessToken =  response.data.accessToken
      setAccessToken(newAccessToken)
    }
    if(!accessToken)
      lookForToken()
  })

  const getAccessToken = () => {
    return accessToken
  };

  return (
    <Auth0TokenContext.Provider value={{ getAccessToken }}>
      {children}
    </Auth0TokenContext.Provider>
  );
};