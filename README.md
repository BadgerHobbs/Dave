# DAVE - Your Digital Assistant with Voice Empowerment

DAVE is a digital voice assistant built using OpenAI's powerful technologies including Whisper ASR API, GPT-4 Chat models, and Text-To-Speech (TTS) APIs. With DAVE, you can smoothly interact with a virtual assistant that listens to you attentively, processes the information with a remarkable understanding, and articulates a reply, all made perceivable with intuitive transition states.

![screen-recording](https://github.com/BadgerHobbs/Dave/assets/23462440/4ba9e142-dded-421d-a061-ac3f04f8ff71)

# Getting Started

## OpenAI API

In order to use DAVE, an OpenAI account is required with the access to the following model endpoints.

- [Transcriptions](https://platform.openai.com/docs/api-reference/audio/createTranscription) `/v1/audio/transcriptions`
- [Chat](https://platform.openai.com/docs/api-reference/chat) `/v1/chat/completions`
- [Speech](https://platform.openai.com/docs/api-reference/audio/createSpeech) `/v1/audio/speech`

## Basic Configuration

For basic usage of DAVE, the only configuration required is for you to provide your OpenAI API key within the page url `apiKey` parameter.

e.g. `?apiKey=sk-SsMzb...z07l`

## Advanced Configuration

For more advanced usage, DAVE allows the voice, chat and text-to-speech models to be configured additionally using url parameters. It is important to note that for the models, such as GPT-4, it will depend on your level of API access.

Below are the list of availible configuration options (as of 2023/11/08):

- Voice Models (URL Param 'voiceModel'):

  - `alloy`
  - `echo`
  - `fable`
  - `onyx` (default)
  - `nova`
  - `shimmer`

- Chat Models (URL Param 'chatModel'):

  - `gpt-3.5-turbo` (default)
  - `gpt-3.5-turbo-0301`
  - `gpt-3.5-turbo-0613`
  - `gpt-3.5-turbo-1106`
  - `gpt-3.5-turbo-16k`
  - `gpt-3.5-turbo-16k-0613`
  - `gpt-3.5-turbo-instruct`
  - `gpt-3.5-turbo-instruct-0914`
  - `gpt-4`
  - `gpt-4-0314`
  - `gpt-4-0613`
  - `gpt-4-1106-preview`

- Text-to-Speech Models (URL Param 'textToSpeechModel'):

  - `tts-1` (default)
  - `tts-1-hd`
  - `tts-1-1106`
  - `tts-1-hd-1106`

- Text-to-Speech Models (URL Param 'textToSpeechModel'):

  - `custom`

_Note: These configuration options are additionally displayed within the console log for convenient reference._

## Acknowledgments

The development of DAVE was inspired by the excellent work of [Romain Huet
](https://github.com/romainhuet), who demo'd a similar (albeit more complex) application at the 2023 OpenAI DevDay. His excellent presentation is availible to watch [here on YouTube](https://youtu.be/U9mJuUkhUzk?t=2381).

## License

The code and documentation in this project are released under the [GPLv3 License](LICENSE).
