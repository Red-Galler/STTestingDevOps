// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { supabase } from "../../../src/denoSupabaseClient.js";


async function GetFcmToken(ownerId) {
  try {
    const { data, error } = await supabase.from('Users2').select('fcm_token').eq('id', ownerId).single()

    if (error) throw error;

    if (data) return data.fcm_token

  }
  catch (error) {
    console.log(error)
  }
}


async function SendNotification(message) {
  try {
    // Send a POST request to FCM
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${'AAAAAI5kRwQ:APA91bHbetc5YRc3fj65SJBgfAs53I8tEQZbSVhyz--TGBr-lJISFDhM9l2TgkpCJJVmaqtcSIcdmAJSKNl9JQVv6sjwC-AdPr8SW5ZGh_KuTdTR5HVmoPcWxxoyEVr9nFKr7r3MxQ_2'}`
      },
      body: JSON.stringify(message)
    });


    const responseData = await response.json();

    return responseData
  }
  catch (error) {
    console.log(error)
  }
}

async function AddNotificationToDb(notification) {
  try {
    console.log('eee')
    const { error } = await supabase.from('Notifications2').insert(notification)

    if (error) throw error
  }
  catch (error) {
    console.log(error)
  }
}




Deno.serve(async (req) => {

  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Access-Control-Allow-Origin", "*"); // Allows all origins
  headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // preflight request
  if (req.method === "OPTIONS") {
    // Pre-flight request handling
    return new Response(null, { status: 204, headers: headers });
  }



  let ownerId = null
  let survey = null
  let surveyCompleter = null

  try {

    const body = await req.json();

    ownerId = await body.owner_id
    survey = await body.survey

    surveyCompleter = await body.surveyCompleter


  } catch (error) {

    console.error(error);

  }

  console.log(surveyCompleter)

  await AddNotificationToDb({surveyTaker: surveyCompleter.id, surveyId: survey.id, ownerId: ownerId})



  const message = {
    to: await GetFcmToken(ownerId),
    notification: {
      title: 'Enquête uitgevoerd',
      body: `${surveyCompleter.email} heeft ${survey.title} uitgevoerd` // body should be a string
    },
    data: {
      ownerId: ownerId // You can send additional data in the data field
    }
  };


  const responseData = await SendNotification(message)


  console.log(responseData)

  const data = {
    status: responseData.success === 1 ? 'SUCCESS' : 'FAILED',
  }





  return new Response(
    JSON.stringify("data"),
    { headers: headers },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/notifySurveyOwner' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
