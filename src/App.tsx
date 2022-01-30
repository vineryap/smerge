import { Component, createMemo, createSignal, Show } from "solid-js";
import FileInput from "./components/FileInput";
import Layout from "./layouts/BaseLayout";
import { merge, Subtitle } from "subtitle-merger";

const App: Component = () => {
  const [fileOne, setFileOne] = createSignal<File | null>(null);
  const [fileTwo, setFileTwo] = createSignal<File | null>(null);
  const [subtitle, setSubtitle] = createSignal<Subtitle | null>(null);
  const [mergedSubtitle, setMergedSubtitle] = createSignal<string>("");
  const [isDownloadReady, setIsDownloadReady] = createSignal<boolean>(false);

  function getFile(inputEl: HTMLInputElement): File | null {
    return (inputEl.files as FileList)[0];
  }

  function fileInputHandler(e: Event) {
    const target = e.target as HTMLInputElement;
    const id = target.id;
    const file = getFile(target);

    if (!file?.name.match(/\.srt$/i)) {
      console.error("only .srt file is supported.");
      return;
    }

    switch (id) {
      case "subtitle_one":
        setFileOne(file);
        break;

      default:
        setFileTwo(file);
        break;
    }
  }

  createMemo(() => {
    if (subtitle() && !isDownloadReady()) {
      const data = subtitle()?.blob as Blob | MediaSource;

      if (mergedSubtitle() !== null) {
        window.URL.revokeObjectURL(mergedSubtitle());
      }
      setMergedSubtitle(window.URL.createObjectURL(data));

      setIsDownloadReady(true);
    }
  });

  async function mergeSubtitles() {
    if (fileOne() && fileTwo()) {
      const merged = merge((await fileOne()?.text()) || "", (await fileTwo()?.text()) || "");
      setSubtitle(merged);
    }
  }

  return (
    <Layout>
      <div class="my-15 flex flex-col items-center sm:max-w-2xl w-full p-5 sm:p-10 bg-white rounded-xl shadow-xl transition-all">
        <div class="text-center mb-10">
          <h2 class="mt-5 text-3xl font-bold text-gray-900">Subtitle Merger</h2>
          <p class="mt-2 text-sm text-gray-400">
            Merge two subtitles into one. Files are not sent to the server which means no data are
            collected.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <FileInput
            label="Add Subitle One"
            inputId="subtitle_one"
            fileInputHandler={fileInputHandler}
          />
          <FileInput
            label="Add Subitle Two"
            inputId="subtitle_two"
            fileInputHandler={fileInputHandler}
          />
        </div>
        <div class="w-full max-w-70">
          <button
            type="submit"
            class="mt-10 w-full flex justify-center bg-blue-600 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-700 shadow-lg cursor-pointer transition ease-in"
            onClick={mergeSubtitles}
          >
            Merge
          </button>
        </div>
        <div
          classList={{ "opacity-100": isDownloadReady(), "opacity-0": !isDownloadReady() }}
          class="w-full max-w-70"
        >
          <Show when={isDownloadReady()}>
            <a
              href={mergedSubtitle()}
              download={"merged.srt"}
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
