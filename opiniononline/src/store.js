import { configureStore } from '@reduxjs/toolkit';
import surveyReducer from './slices/surveySlice';

import { useSelector } from 'react-redux';


const store = configureStore({
  reducer: {
    surveys: surveyReducer
  }
});



export default store;
