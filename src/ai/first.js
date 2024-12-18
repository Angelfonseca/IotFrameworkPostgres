import { Configuration, OpenAIApi } from 'openai';

const openAiKey = process.env.OPENAI_API_KEY;
if (!openAiKey) throw new Error('Missing OpenAI API Key in environment variables.');

const configuration = new Configuration({
    apiKey: openAiKey,
});
const openai = new OpenAIApi(configuration);

const firstPrompt = `The current project is to create Sequelize data models from JSON examples. Here is an example JSON:
{
    "name": "User",
    "fields": [
        {
            "name": "username",
            "type": "String",
            "required": true
        },
        {
            "name": "email",
            "type": "String",
            "required": true
        },
        {
            "name": "password",
            "type": "String",
            "required": true
        },
        {
            "name": "age",
            "type": "Number",
            "required": false
        }
    ]
}
Please generate a Sequelize model definition for the above JSON.`;

const sendToOpenAI = async (userPrompt) => {
    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            n: 1,
            stop: null,
            prompt: `${firstPrompt}\n${userPrompt}`,
            max_tokens: 300,
            temperature: 0.5,
        });
        const finalResponse = response.data.choices[0].text.trim();
        const jsonResponse = selectJsonFromResponse(finalResponse);
        return jsonResponse;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return "An error occurred while processing your request.";
    }
};

const selectJsonFromResponse = (response) => {
    const jsonRegex = /{[^{}]*}/;
    const match = response.match(jsonRegex);
    return match ? match[0] : null;
};


export default sendToOpenAI;
