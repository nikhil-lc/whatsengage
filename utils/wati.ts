import axios from 'axios';

export const sendMessage = async (phone: string, message: string) => {
  try {
    const response = await axios.post(
      'https://live-mt-server.wati.io/338552/v1/messages',
      {
        destination: phone,
        template_name: 'daily_message_template', // Adjust this to your template name
        template_params: [message],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WATI_API_KEY}`, // Use the API key from .env
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending message', error);
  }
};

export const sendTextMessage = async (phone: string, message: string) => {
    const apiUrl = `https://live-mt-server.wati.io/338552/api/v1/sendSessionMessage/${phone}?messageText=${message}`;  // Phone in URL
    const apiKey = process.env.WATI_API_KEY;  // Get your WATI API Key from .env.local
  
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,  // Pass API key
      },
      data: {
        message: {
          text: message,  // Text of the session message
        }
      }
    };
  
    try {
   
      const response = await axios(apiUrl, options);
  
      if (response.status !== 200) {
        throw new Error(`Error sending message: ${response.statusText}`);
      }
      console.log('Response:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error sending session message:', error);
      throw error;  // Rethrow error to handle in calling function
    }
  };

  export const sendInteractiveMessage = async (phone: string) => {
    const apiUrl = `https://live-mt-server.wati.io/338552/api/v1/sendInteractiveButtonsMessage?whatsappNumber=${phone}`;
    const apiKey = process.env.WATI_API_KEY;  // Ensure you have set the API key in .env.local
  
    const payload = {
      header: {
        type: 'Text',
        text: 'Have you done excersie today?',
      },
      body: 'another text',  // Main message body
      footer: 'footer text',  // Footer message
      buttons: [
        {
          text: 'Yes',  // Single button with "Yes" text
        },
      ],
    };
  
    const options = {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${apiKey}`,  // Pass the API key for authorization
        'Content-Type': 'application/json-patch+json',  // Content-Type header
      },
      data: payload,  // JSON payload
    };
  
    try {
      const response = await axios(apiUrl, options);
      console.log("response.data", response.data)  // Send the request using Axios
      return response.data;  // Return the response data
    } catch (error) {
      console.error('Error sending interactive message:', error);
      throw error;  // Rethrow the error for handling
    }
  };
  export const sendTemplateMessage = async (phone: string, templateName: string, templateParams: string[]) => {
    const apiUrl = `https://live-mt-server.wati.io/338552/api/v1/sendTemplateMessage?whatsappNumber=+${phone}`;  // WATI API endpoint for template messages
    const apiKey = process.env.WATI_API_KEY;  // Ensure your WATI API Key is set in .env.local
  
    const payload = {
      // The WhatsApp number to send the message to
      template_name: templateName || "nikhil_test_reminder",  // Name of your approved template
      broadcast_name: 'Template Message Broadcast',  // Optional broadcast name
      parameters: [
    {
      "name": "string",
      "value": "string"
    }
  ]
    };
  
    const options = {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${apiKey}`,  // Use the WATI API key for authorization
        'Content-Type': 'application/json',
      },
      data: payload,  // Send the template message data as a JSON payload
    };
  
    try {
      const response = await axios(apiUrl, options);
      return response.data;  // Return the response data from the API
    } catch (error) {
      console.error('Error sending template message:', error);
      throw error;  // Rethrow the error for further handling
    }
  };