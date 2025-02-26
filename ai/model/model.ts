
type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export async function invokeModel(messages: ChatMessage[]) {
    const body = {
        model: 'Qwen/Qwen2.5-72B-Instruct',
        messages,
        stream: true
    };

    let output = '';

    const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
        'headers': {
          'accept': 'text/event-stream',
          'accept-language': 'en-US,en;q=0.9,id;q=0.8',
          'content-type': 'application/json',
          'sec-ch-ua': '\'Not(A:Brand\';v=\'99\', \'Google Chrome\';v=\'133\', \'Chromium\';v=\'133\'',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '\'Windows\'',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'x-deepinfra-source': 'web-page',
          'Referer': 'https://deepinfra.com/',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        },
        'body': JSON.stringify(body),
        'method': 'POST'
    });

    const stream = response.body;
    const reader = stream.getReader();

    const readChunk = async () => {
        const { done, value } = await reader.read();

        if (done) {
            return;
        }
        const rawData = new TextDecoder().decode(value);

        console.log(rawData);

        if (rawData.includes('[DONE]')) return;
        else if (rawData.trim() === '') return;


        const chunkData = JSON.parse(rawData.slice(6));

        if (chunkData.choices[0].delta.content === undefined) return;

        output += chunkData.choices[0].delta.content;

        await readChunk();
    }

    await readChunk();

    return output;
}

// invokeModel([
//     { role: 'system', content: 'Your name is Trashify AI.. Your task is helping people to clean this planet.' },
//     { role: 'user', content: 'Hi, how are you?' },
// ]).then(output => console.log(output));