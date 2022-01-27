import { Component, createMemo, createSignal, Show } from "solid-js";
import Layout from "./layouts/BaseLayout";
import { merge, Subtitle } from "subtitle-merger";

const App: Component = () => {
  const [fileOne, setFileOne] = createSignal<File | null>(null);
  const [fileTwo, setFileTwo] = createSignal<File | null>(null);
  const [subtitle, setSubtitle] = createSignal<Subtitle | null>();
  const [mergedSubtitle, setMergedSubtitle] = createSignal<string>("");
  const [isDownloadReady, setIsDownloadReady] = createSignal<boolean>(false);

  function getFile(inputEl: HTMLInputElement): File | null {
    return (inputEl.files as FileList)[0];
  }

  function setFileHandler(e: Event) {
    const target = e.target as HTMLInputElement;
    const id = target.id;
    const file = getFile(target);

    if (!file?.name.match(/\.srt$/i)) {
      console.error("only .srt file is allowed.");
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

  function makeSrtFile() {
    const data = subtitle()?.blob as Blob | MediaSource;
    if (mergedSubtitle() !== null) {
      window.URL.revokeObjectURL(mergedSubtitle());
    }
    setMergedSubtitle(window.URL.createObjectURL(data));
  }

  createMemo(() => {
    if (mergedSubtitle()) {
      setIsDownloadReady(true);
    }
  });

  async function mergeSubtitles() {
    if (fileOne() && fileTwo()) {
      const merged = merge((await fileOne()?.text()) || "", (await fileTwo()?.text()) || "");
      setSubtitle(merged);
      makeSrtFile();
    }
  }

  return (
    <Layout>
      <div class="container px-30">
        <div class="flex flex-col justify-between items-center">
          <div class="flex-row flex-wrap ">
            <label htmlFor="subtitle_one">Subtitle 1</label>
            <input
              type="file"
              name="subtitleOne"
              id="subtitle_one"
              accept=".srt"
              onChange={setFileHandler}
            />
            <label htmlFor="subtitle_two">Subtitle 2</label>
            <input
              type="file"
              name="subtitleTwo"
              id="subtitle_two"
              accept=".srt"
              onChange={setFileHandler}
            />
          </div>
        </div>
        <div class="flex items-center justify-center mt-20">
          <button class="px-5 py-2 bg-blue-500" onClick={mergeSubtitles}>
            Submit
          </button>
        </div>
        <div
          classList={{ "opacity-100": isDownloadReady(), "opacity-0": !isDownloadReady() }}
          class="flex items-center justify-center mt-20 transition-all"
        >
          <Show when={isDownloadReady()}>
            <a href={mergedSubtitle()} download={"merged.srt"} class="px-5 py-2 bg-blue-500">
              Download
            </a>
          </Show>
        </div>
      </div>
    </Layout>
  );
};

export default App;
