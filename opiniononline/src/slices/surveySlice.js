// surveysSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';




async function FetchPublicUrl(from, name) {

  try {

    const { data, error } = supabase
      .storage
      .from(from)
      .getPublicUrl(name);

    if (error) throw error

    const response = await fetch(data.publicUrl);
    if (response.ok) {
      return data.publicUrl;
    } else {

      return null;
    }
  }
  catch (error) {
    console.log('HAHAHAHA')
    return 
  }

}


async function FetchSurveyStyle(surveyId) {
  let surveyStyle = null



  if (surveyId) {
    const { data, error } = await supabase.from('SurveyStyles2').select('*').eq('surveyId', surveyId).single();
    if (data) { surveyStyle = data }
  }

  return surveyStyle;
}


export const fetchSurveyData = createAsyncThunk(
  'surveys/fetchSurveyData',
  async (data) => {

    try {

      let instance = new Worker('/workers/FetchSurvey.js');

      const workerPromise = new Promise((resolve, reject) => {
        instance.onmessage = ({ data }) => {
          resolve(data.data);
        };
        instance.onerror = (error) => {
          console.error('Worker error:', error);
          reject(error);
        };
      });

      // Post message to worker
      instance.postMessage({ surveyId: data.id, token: data.token, action: 'FETCHSURVEY' });

      const workerResponse = await workerPromise;

      const allQuestionKindsResponse = await supabase.from('QuestionKinds2').select('*')
      let surveyStyle = null

      if (workerResponse[0]) {
        let background = await FetchPublicUrl('survey_backgrounds', `survey_background_${workerResponse[0].id}`)
        let logo = await FetchPublicUrl('survey_logos', `survey_${workerResponse[0].id}`)

        workerResponse[0].background = background ? `${background}?cb=${new Date().getTime()}` : null
        workerResponse[0].logo = logo ? `${logo}?cb=${new Date().getTime()}` : null
        surveyStyle = await FetchSurveyStyle(workerResponse[0].id)

      }

      return {
        survey: workerResponse[0],
        allQuestionKinds: allQuestionKindsResponse.data,
        surveyStyle: surveyStyle
      };

    }
    catch (error) {
      console.log(error);
    }

  }
);



export const fetchSurveyStyle = createAsyncThunk(
  'surveys/fetchSurveyStyle',
  async (surveyId) => {

    let surveyStyle = null


    if (surveyId) {
      const { data, error } = await supabase.from('SurveyStyles2').select('*').eq('surveyId', surveyId).single();
      if (data) { surveyStyle = data }
    }

    return surveyStyle;
  }
)

export const fetchAllSurveys = createAsyncThunk(
  'surveys/fetchAllSurveys',
  async (ownerId) => {

    const { data, error } = await supabase.from('Surveys2').select('*').eq('ownerId', ownerId).order('is_marked', { ascending: false })

    if (error) throw error


    if (data) {

      // Fetch the backgrounds for all surveys
      const surveys = await Promise.all(data.map(async (survey) => {
        const background = await FetchPublicUrl('survey_backgrounds', `survey_background_${survey.id}`);
        return { ...survey, background: background }; // Combine the survey data with its background URL
      }));

      return surveys
    }
  }

)

const surveySlice = createSlice({
  name: 'surveys',
  initialState: {
    profilePictureLoggedInUser: null,
    survey: null,
    surveyStyles: null,
    status: 'idle',
    error: null,
    active: null,
    allQuestionKinds: [],
    isLoading: false,
    allSurveys: [],
    themes: [],
    surveyStatuses: [
      {
        id: 1,
        name: 'Concept',
        color: 'bg-blue-400'
      },
      {
        id: 2,
        name: 'Voltooid',
        color: 'bg-gray-400'
      },
      {
        id: 3,
        name: 'In behandeling',
        color: 'bg-yellow-400'
      },


    ]
  },
  reducers: {
    
    updateProfilePicture: (state, action) => {
      state.profilePictureLoggedInUser = action.payload
    },
    clearSurvey: (state) => {
      state.survey = null
    }, 
    changeActive: (state, action) => {
      state.active = action.payload;
    },
    
    updateSurveyStyles: (state, action) => {

      state.surveyStyles = action.payload;
    },

    updateLogo: (state, action) => {
      state.survey.logo = action.payload
    },

    setIsLoadingTrue: (state) => {
      state.isLoading = true;
    },


    setIsLoadingFalse: (state) => {
      state.isLoading = false;
    },

    updateSurveys: (state, action) => {
      state.allSurveys = state.allSurveys
        .map(survey => survey.id === action.payload.id ? action.payload : survey)
        .sort((a, b) => (b.is_marked === true) - (a.is_marked === true));
    }
    ,
    addSection: (state, action) => {

      console.log(action.payload)
      action.payload = { ...action.payload, type: "section" }

      state.survey.Sections2.push(action.payload);

      state.active = action.payload
    },

    addQuestion: (state, action) => {
      //state.survey.Sections2.push(action.payload);


      let { addedQuestion, updatedQuestions } = action.payload




      // Create a new array with updated sections
      state.survey.Sections2 = state.survey.Sections2.map((section) => {
        // Check if the current section is the one to update
        if (section.id === addedQuestion.sectionId) {
          section.Questions2 = updatedQuestions
        }
        // Return the section unchanged if it's not the one to update
        return section;
      });

      state.active = addedQuestion
    }
    ,
    deleteQuestion: (state, action) => {

      state.survey.Sections2 = action.payload
    },
    deleteSection: (state, action) => {

      state.survey.Sections2 = action.payload
    },


    deleteSurvey: (state, action) => {
      state.allSurveys = state.allSurveys.filter((survey) => survey.id !== action.payload)
    },

    updateBackground: (state, action) => {
      state.survey.background = action.payload
    },

    updateQuestion: (state, action) => {
      let updatedQuestion = action.payload;

      state.survey.Sections2 = state.survey.Sections2.map((section) => {

        if (section.id === updatedQuestion.sectionId) {
          section.Questions2 = section.Questions2.map((question) => {
            if (question.id === updatedQuestion.id) {

              return { ...updatedQuestion }

            }

            return { ...question };

          })
        }

        return section;
      })
    },

    updateSection: (state, action) => {
      let updatedSection = action.payload;

      state.survey.Sections2 = state.survey.Sections2.map((section) => {

        if (section.id === updatedSection.id) {
          return { ...updatedSection }
        }

        return section;
      })
    },

    setThemes: (state, action) => {
      state.themes = action.payload;
    },
    
  },



  extraReducers: builder => {
    builder
      .addCase(fetchSurveyData.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(fetchSurveyData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoading = false;
        state.survey = action.payload.survey;
        state.allQuestionKinds = action.payload.allQuestionKinds;
        state.surveyStyles = action.payload.surveyStyle;

      })
      .addCase(fetchSurveyData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.isLoading = false;

      })



    builder
      .addCase(fetchSurveyStyle.pending, (state, action) => {
        state.isLoading = true;

      })
      .addCase(fetchSurveyStyle.fulfilled, (state, action) => {
        state.surveyStyles = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchSurveyStyle.rejected, (state, action) => {
        state.isLoading = false;
      })



    builder
      .addCase(fetchAllSurveys.pending, (state, action) => {

        state.isLoading = true;

      })
      .addCase(fetchAllSurveys.fulfilled, (state, action) => {
        state.allSurveys = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllSurveys.rejected, (state, action) => {
        state.isLoading = false;
      })


  }





});

export default surveySlice.reducer;
export const { changeActive, updateSectionsList, updateSurveyStyles, updateLogo, setIsLoadingTrue, setIsLoadingFalse, updateSurveys, addSection, addQuestion, deleteQuestion, addAnswer, deleteSurvey, updateBackground, updateQuestion, updateSection, deleteSection, setThemes, updateProfilePicture, clearSurvey } = surveySlice.actions;

