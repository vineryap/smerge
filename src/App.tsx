import { Component, createMemo, createSignal, For, Show } from "solid-js";
import FileInput from "./components/FileInput";
import Layout from "./layouts/BaseLayout";
import { merge, Subtitle } from "subtitle-merger";

const App: Component = () => {
  const [addedFiles, setFiles] = createSignal<File[]>([]);
  const [subtitle, setSubtitle] = createSignal<Subtitle | null>(null);
  const [outputName, setOutputName] = createSignal<string>("");
  const [isDownloadReady, setIsDownloadReady] = createSignal<boolean>(false);

  const output = createMemo(() => {
    if (!subtitle()) return;

    const data = subtitle()?.blob as Blob | MediaSource;
    setIsDownloadReady(true);
    return window.URL.createObjectURL(data);
  });

  function resetStates() {
    setIsDownloadReady(false);
    setSubtitle(null);
  }

  function filesHandler(files: File[]) {
    if (!files.length) return;
    if (files.map(f => f.name).filter(n => !n.match(/\.srt$/i)).length) return;
    resetStates();
    if (addedFiles().length === 1) setFiles(current => current.concat(files[0]));
    else setFiles(files.slice(0, 2));
  }

  const mergeDisabled = createMemo(() => addedFiles().length < 2 || !!output());

  async function mergeSubtitles() {
    if (mergeDisabled()) return;

    const [fileOne, fileTwo] = addedFiles();
    const fileOneText = await fileOne.text();
    const fileTwoText = await fileTwo.text();
    const merged = merge(fileOneText, fileTwoText);
    setSubtitle(merged);
  }

  return (
    <Layout>
      <div class="my-15 flex flex-col items-center sm:max-w-2xl w-full p-5 sm:p-10 bg-white rounded-xl shadow-xl transition-all">
        <div class="text-center mb-10">
          <h1 class="mt-5 text-3xl font-bold text-gray-900">Subtitle Merger</h1>
          <p class="mt-2 text-sm text-gray-400">
            Merge two subtitles into one. Files are not sent to the server which means no data are
            collected.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row w-full h-full space-y-4 sm:space-y-0 sm:space-x-4">
          <FileInput
            label="Add two subtitles to be merged"
            inputId="subtitle_one"
            filesHandler={filesHandler}
          />
        </div>
        <ul class="block w-full justify-start mt-10 list-inside list-disc">
          <h3 class="font-bold text-gray-500 tracking-wide">Added Files</h3>
          <For
            each={addedFiles()}
            fallback={<span class="font-semibold text-gray-400 text-sm">None</span>}
          >
            {file => <li class="font-semibold text-sm">{file.name}</li>}
          </For>
        </ul>
        <div class="w-full flex flex-col flex-wrap mt-10 space-y-2">
          <label class="font-bold text-gray-500 tracking-wide">Output Filename</label>
          <input
            class="text-base p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 focus:border-gray-100 transition"
            type="text"
            placeholder="merged.srt"
            value={outputName()}
            onChange={e => setOutputName((e.target as HTMLInputElement).value)}
          ></input>
        </div>
        <div class="w-full max-w-70">
          <button
            type="submit"
            class="mt-10 w-full flex justify-center text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline shadow-lg transition ease-in"
            className={`${
              mergeDisabled()
                ? "bg-gray-400 hover:bg-gray-400 cursor-auto"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
            onClick={mergeSubtitles}
            disabled={mergeDisabled()}
          >
            Merge
          </button>
        </div>
        <div
          className={`${isDownloadReady() ? "opacity-100" : "opacity-0"}`}
          class="w-full max-w-70"
        >
          <Show when={isDownloadReady()}>
            <a
              href={output()}
              download={outputName() ? outputName() + ".srt" : "merged.srt"}
              class="mt-5 w-full flex justify-center bg-purple-600 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-purple-700 shadow-lg cursor-pointer transition ease-in"
            >
              Save
            </a>
          </Show>
        </div>
      </div>
    </Layout>
  );
};

export default App;
