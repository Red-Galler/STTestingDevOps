
// worker.js

// eslint-disable-next-line no-restricted-globals

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers, 
     * and you may want to customize it to your needs
     */
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}

// Function to fetch survey data
async function fetchSurveyData(surveyId, token, apikey) {
  const url = `https://yahwcmpedahqkoeyulpk.supabase.co/rest/v1/Surveys2?select=*,Sections2(*,Questions2(*,Answers2(*)))&id=eq.${surveyId}`;
  const headers = {
    'apikey': apikey,  // Replace with a secure method to obtain API key
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error('Network response was not ok: ' + response.statusText);
  }

  return response.json();
}


async function InitializeSurvey(event) {
  try {
    const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaHdjbXBlZGFocWtvZXl1bHBrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NjkzNjgxOSwiZXhwIjoyMDEyNTEyODE5fQ.739IfVYf66FfjF9pXKxvbZZt77_9nU_QEnIPyOv5oAc'
    const data = await fetchSurveyData(event.data.surveyId, event.data.token, apikey);


    if (data) {
      data[0].Sections2.sort(dynamicSort("sectionOrder"))
      data[0].Sections2.map((section) => {
        section.type = "section"
        section.Questions2.sort(dynamicSort("questionOrder"))

        section.Questions2.map((question) => {
          question.type = "question"
          question.Answers2.sort(dynamicSort("orderNr"))
          return question;
        })

        return section
      })
    }


    postMessage({ action: 'FETCHED_Questions', data: data });

  } catch (error) {

    console.error('Fetching error:', error);
    postMessage({ action: 'FETCH_ERROR', error: error.message });

  }
}

onmessage = function (event) {



  switch (event.data.action) {
    case 'FETCHSURVEY':
      InitializeSurvey(event)
      break;
    case 'SORTQUESTIONS':
      let questions = event.data.questions;

      const updatedQuestions = questions.map((question, index) => {
        let copyOfQuestion = { ...question };
        if (index + 1 !== copyOfQuestion.questionOrder) {
          copyOfQuestion.questionOrder = index + 1;
        }

        copyOfQuestion.canUpdateOrder = true;
        return copyOfQuestion;
      });

      postMessage({ action: 'SORTED_QUESTIONS', data: updatedQuestions });


      break;
    case 'DELETEQUESTION':
      function DeleteQuestion() {

        console.log(event.data)
        let { sections, deletedQuestion } = event.data


        let updatedSections = sections.map((section) => {
          if (section.id === deletedQuestion.sectionId) {

            let newQuestions = [...section.Questions2];

            newQuestions = newQuestions.map((question) => {
              if (deletedQuestion.questionOrder === 1) {
                question.questionOrder--
                return question
              }
              else {
                if (question.questionOrder > deletedQuestion.questionOrder) {
                  question.questionOrder--
                  return question
                }
              }


              return question

            })

            section.Questions2 = newQuestions.filter((question) => question.id !== deletedQuestion.id)


          }
          return section
        })

        postMessage({ action: 'DELETED_QUESTION', data: updatedSections });

      }

      DeleteQuestion();
      break;

    case 'ADDQUESTION':
      function AddQuestion() {
        let { addedQuestion, questions } = event.data


        let newQuestions = questions.map((question) => {
          if (question.questionOrder >= addedQuestion.questionOrder) {
            console.log('//')
            question.questionOrder++
          }

          question.canUpdateOrder = false;

          return question;

        })


        newQuestions = [...newQuestions, addedQuestion]

        console.log(JSON.parse(JSON.stringify(newQuestions)))

        newQuestions = newQuestions.sort(dynamicSort('questionOrder'))


        postMessage({ action: 'ADDED_QUESTION', data: newQuestions });

        console.log(addedQuestion, questions);
      }

      AddQuestion()
      break;
    case 'DELETESECTION':
      function DeleteSection() {
        let { sections, deletedSection } = event.data

        console.log(deletedSection)

        let updatedSections = sections.map((section) => {
          if (section.id === deletedSection.id) {
            if (deletedSection.sectionOrder === 1) {
              section.sectionOrder--
              return section
            }


            if (section.sectionOrder > deletedSection.sectionOrder) {
              section.questionOrder--
              return section
            }


            return section

          }

          return section

        })

        console.log(updatedSections)

        updatedSections = updatedSections.filter((section) => section.id !== deletedSection.id)


        postMessage({ action: 'DELETED_SECTION', data: updatedSections });

      }
      DeleteSection();

    default:
      break;
  }


};
