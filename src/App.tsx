import { Component, createSignal } from "solid-js";
import { parseText, isIntervalslOverlap } from "./helpers";

const App: Component = () => {
  const [fileOne, setFileOne] = createSignal<File | null>(null);
  const [fileTwo, setFileTwo] = createSignal<File | null>(null);

  function getFile(inputEl: HTMLInputElement): File | null {
    return (inputEl.files as FileList)[0];
  }

  function setFileHandler(e: Event) {
    console.log(e);

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

  async function readFiles(): Promise<void> {
    if (fileOne() && fileTwo()) {
      const fileOneSections = parseText(await fileOne()?.text());
      const fileTwoSections = parseText(await fileTwo()?.text());
      if (fileOneSections && fileTwoSections) {
        for (const fileOneSection of fileOneSections) {
          console.log("fileOneSection", fileOneSection);

          for (const fileTwoSection of fileTwoSections) {
            console.log("fileTwoSection", fileTwoSection);
            console.log(
              "isIntervalslOverlap",
              isIntervalslOverlap(fileOneSection.timestamp, fileTwoSection.timestamp)
            );
            if (isIntervalslOverlap(fileOneSection.timestamp, fileTwoSection.timestamp)) continue;
          }
        }
      }
      // console.log(fileOneLines);
    }
  }
  return (
    <>
      <div class="relative w-full min-h-screen mx-auto my-30">
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
          <div class="flex justify-center mt-20">
            <button class="px-5 py-2 bg-blue-500" onclick={readFiles}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
