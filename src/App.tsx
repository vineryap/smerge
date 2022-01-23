import { Component, createSignal } from "solid-js";
import { parseText, isIntervalslOverlap, sortSubtitleSection } from "./helpers";
import { subtitleObject } from "./types";

const App: Component = () => {
  const [fileOne, setFileOne] = createSignal<File | null>(null);
  const [fileTwo, setFileTwo] = createSignal<File | null>(null);

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

  async function mergeSubtitles(): Promise<void> {
    if (fileOne() && fileTwo()) {
      const fileOneSections = parseText(await fileOne()?.text());
      const fileTwoSections = parseText(await fileTwo()?.text());

      if (fileOneSections && fileTwoSections) {
        let merged: subtitleObject[] = [];
        const appendedIndex: number[] = [];
        // console.log(fileOneSections);

        for (let index = 0; index < fileOneSections.length; index++) {
          let isFileOneOverlap = false;
          const fileOneSection = fileOneSections[index];

          for (let i = 0; i < fileTwoSections.length; i++) {
            const fileTwoSection = fileTwoSections[i];

            if (isIntervalslOverlap(fileOneSection.timestamp, fileTwoSection.timestamp)) {
              const text = fileOneSection.text.replace("\n\n", "\n") + fileTwoSection.text;
              merged.push({
                timestamp: fileOneSection.timestamp,
                text
              });
              appendedIndex.push(i);
              isFileOneOverlap = true;
              break;
            }
          }
          if (!isFileOneOverlap) {
            isFileOneOverlap = false;
            merged.push(fileOneSection);
          }
        }

        merged = sortSubtitleSection(
          merged.concat(fileTwoSections.filter((s, i) => !appendedIndex.includes(i)))
        );
      }
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
            <button class="px-5 py-2 bg-blue-500" onclick={mergeSubtitles}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
