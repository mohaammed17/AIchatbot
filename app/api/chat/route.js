import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

export async function POST(req) {
    try {
        const data = await req.json();

        // Log the incoming request payload
        console.log('Received request payload:', JSON.stringify(data, null, 2));

        // Ensure the conversation starts with a user message
        if (data.length === 0 || data[0].role !== 'user') {
            throw new Error("A conversation must start with a user message. Try again with a conversation that starts with a user message.");
        }

        // Ensure proper alternation between user and assistant roles
        for (let i = 1; i < data.length; i++) {
            if (data[i].role === data[i - 1].role) {
                throw new Error("A conversation must alternate between user and assistant roles. Make sure the conversation alternates between user and assistant roles and try again.");
            }
        }

        const conversation = data.map(msg => ({
            role: msg.role,
            content: [{ text: msg.content }]
        }));

        const client = new BedrockRuntimeClient({ region: "us-east-1" });
        const modelId = "anthropic.claude-instant-v1";

        const command = new ConverseCommand({
            modelId,
            messages: conversation,
            inferenceConfig: { maxTokens: 512, temperature: 0.5, topP: 0.9 },
        });

        const response = await client.send(command);

        // Log the response from the Bedrock API
        console.log('Received response from Bedrock API:', JSON.stringify(response, null, 2));

        // Extract the text content
        const responseText = response.output.message.content[0].text;
        return new Response(JSON.stringify({ text: responseText }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Error handling POST request:', error.message);
        return new Response(error.message, { status: 500 });
    }
}
