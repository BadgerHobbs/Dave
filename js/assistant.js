// Enumeration of states
const State = Object.freeze({
  WAITING: "waiting",
  LISTENING: "listening",
  THINKING: "thinking",
  SPEAKING: "speaking",
});

// Enumeration of voice models (2023/11/08)
const VoiceModel = Object.freeze({
  ALLOY: "alloy",
  ECHO: "echo",
  FABLE: "fable",
  ONYX: "onyx",
  NOVA: "nova",
  SHIMMER: "shimmer",
});

// Enumeration of chat models (2023/11/08)
const ChatModel = Object.freeze({
  GPT_3_5_TURBO: "gpt-3.5-turbo",
  GPT_3_5_TURBO_0301: "gpt-3.5-turbo-0301",
  GPT_3_5_TURBO_0613: "gpt-3.5-turbo-0613",
  GPT_3_5_TURBO_1106: "gpt-3.5-turbo-1106",
  GPT_3_5_TURBO_16K: "gpt-3.5-turbo-16k",
  GPT_3_5_TURBO_16K_0613: "gpt-3.5-turbo-16k-0613",
  GPT_3_5_TURBO_INSTRUCT: "gpt-3.5-turbo-instruct",
  GPT_3_5_TURBO_INSTRUCT_0914: "gpt-3.5-turbo-instruct-0914",
  GPT_4: "gpt-4",
  GPT_4_0314: "gpt-4-0314",
  GPT_4_0613: "gpt-4-0613",
  GPT_4_1106_PREVIEW: "gpt-4-1106-preview",
});

// Enumeration of text-to-speech models (2023/11/08)
const TextToSpeechModel = Object.freeze({
  TTS_1: "tts-1",
  TTS_1_HD: "tts-1-hd",
  TTS_1_1106: "tts-1-1106",
  TTS_1_HD_1106: "tts-1-hd-1106",
});

/**
 * Class to manage assistant waiting, listening, thinking, speaking
 */
class Assistant {
  apiKey;
  voiceModel;
  chatModel;
  textToSpeechModel;
  systemMessage;
  state;
  mediaRecorder;

  /**
   * Initialise Assistant object.
   * @param {string} apiKey OpenAI API Key.
   * @param {string} voiceModel Selected OpenAI voice model.
   * @param {string} chatModel Selected OpenAI chat model.
   * @param {string} textToSpeechModel Selected OpenAI text-to-speech model.
   * @param {string} systemMessage System message provided alongside prompt to OpenAI chat model.
   */
  constructor({
    apiKey,
    voiceModel,
    chatModel,
    textToSpeechModel,
    systemMessage,
  }) {
    this.apiKey = apiKey;
    this.voiceModel = voiceModel;
    this.chatModel = chatModel;
    this.textToSpeechModel = textToSpeechModel;
    this.systemMessage = systemMessage;
    this.state = State.WAITING;
  }

  /**
   * Set the assistant state and update ui.
   * @param {string} state State of the assistant to set.
   */
  setState(state) {
    switch (state) {
      case State.WAITING:
        document.body.classList.remove("listening");
        document.body.classList.remove("thinking");
        document.body.classList.remove("speaking");
        document.body.classList.add("waiting");
        break;
      case State.LISTENING:
        document.body.classList.remove("waiting");
        document.body.classList.remove("thinking");
        document.body.classList.remove("speaking");
        document.body.classList.add("listening");
        break;
      case State.THINKING:
        document.body.classList.remove("waiting");
        document.body.classList.remove("listening");
        document.body.classList.remove("speaking");
        document.body.classList.add("thinking");
        break;
      case State.SPEAKING:
        document.body.classList.remove("waiting");
        document.body.classList.remove("listening");
        document.body.classList.remove("thinking");
        document.body.classList.add("speaking");
        break;
    }
    this.state = state;
  }

  /**
   * Set assitant state to waiting.
   */
  waiting() {
    this.setState(State.WAITING);
  }

  /**
   * Record audio, send to OpenAI for transcription, calling thinking() on completion.
   */
  async listening() {
    // If already listening, stop, save recording, send to OpenAI, and set state to thinking.
    if (this.state === State.LISTENING) {
      this.setState(State.THINKING);
      this.mediaRecorder.stop();
    }

    // Else if state waiting set state to listenind and start recording
    else if (this.state === State.WAITING) {
      this.setState(State.LISTENING);

      // Create media stream and recorder to record audio
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      this.mediaRecorder = new MediaRecorder(mediaStream);

      let recordedChunks = [];

      // Add media recorder callbacks and start recording
      this.mediaRecorder.ondataavailable = (event) => {
        recordedChunks.push(event.data);
      };

      this.mediaRecorder.onstop = async (event) => {
        // Make blob from recorded data
        const blob = new Blob(recordedChunks, { type: "audio/wav" });

        // Make FormData and append blob and model to it
        let formData = new FormData();
        formData.append("file", blob, "audio.mp3");
        formData.append("model", "whisper-1");

        try {
          // Send POST request to API to get transcription
          const response = await fetch(
            "https://api.openai.com/v1/audio/transcriptions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${this.apiKey}`,
              },
              body: formData,
            }
          );

          const data = await response.json();
          this.thinking(data.text);
        } catch (error) {
          console.log(error);
          alert(`Error: ${error}`);
          this.setState(State.WAITING);
        }

        recordedChunks = [];
      };

      this.mediaRecorder.start();
    }

    // Handle listening state of assistant
    this.state = State.LISTENING;
  }

  /**
   * Call OpenAI Chat API with system message and transcription, calling speaking() on completion.
   * @param {string} transcription Transcript of recorded audio to ask Chat API.
   */
  async thinking(transcription) {
    console.log(
      `Transcription (${transcription.length} chars): ${transcription}`
    );

    try {
      // Send POST request to chat API to get answer to transcription
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: this.chatModel,
            messages: [
              {
                role: "system",
                content: this.systemMessage,
              },
              {
                role: "user",
                content: transcription,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      this.speaking(data.choices[0].message.content);
    } catch (error) {
      console.error(error);
      this.setState(State.WAITING);
    }
  }

  /**
   * Call OpenAI text-to-speech API with answer transcription and play recording back.
   * @param {string} answer Chat API answer to transcription.
   */
  async speaking(answer) {
    console.log(`Answer (${answer.length} chars): ${answer}`);

    try {
      // Send POST request to speech API to get audio answer
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.textToSpeechModel,
          input: answer,
          voice: this.voiceModel,
        }),
      });

      const blob = await response.blob();

      const audioElement = document.createElement("audio");
      audioElement.src = window.URL.createObjectURL(blob);
      audioElement.onended = () => {
        document.body.removeChild(audioElement);
        this.setState(State.WAITING);
      };
      this.setState(State.SPEAKING);
      document.body.appendChild(audioElement);
      audioElement.play();
    } catch (error) {
      console.error(error);
      alert(`Error: ${error}`);
      this.setState(State.WAITING);
    }
  }
}

/**
 * Get a parameter value from the URL (and set placeholder if missing and show alert).
 * @param {string} param The parameter to get from the URL.
 * @param {string} placeholder The placeholder value to set if the parameter is missing.
 * @param {string} alertMessage The message to show an alert if the parameter is missing.
 * @returns {string} The value of the parameter from the URL.
 */
function getUrlParam(param, placeholder = "", alertMessage = "") {
  const url = new URL(window.location.href);
  let params = new URLSearchParams(url.search);

  if (!params.has(param) && placeholder) {
    params.set(param, placeholder);
    window.history.replaceState({}, "", `${url.pathname}?${params}`);

    if (alertMessage) {
      alert(alertMessage);
    }
  }

  return params.get(param);
}
