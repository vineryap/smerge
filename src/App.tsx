import { Component, createMemo, createSignal, Show } from "solid-js";

import {
  parseText,
  isIntervalslOverlap,
  sortSubtitleSection,
  joinSubtitleSections
} from "./helpers";
import Layout from "./layouts/BaseLayout";
import { subtitleObject } from "./types";

const App: Component = () => {
  const [fileOne, setFileOne] = createSignal<File | null>(null);
  const [fileTwo, setFileTwo] = createSignal<File | null>(null);
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

  function makeSrtFile(text: string) {
    const data = new Blob([text], { type: "text/plain" });
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

  async function mergeSubtitles(): Promise<void> {
    if (fileOne() && fileTwo()) {
      const fileOneSections = parseText(await fileOne()?.text());
      const fileTwoSections = parseText(await fileTwo()?.text());

      if (fileOneSections && fileTwoSections) {
        let mergedSections: subtitleObject[] = [];
        const appendedIndex: number[] = [];

        for (let index = 0; index < fileOneSections.length; index++) {
          let isFileOneOverlap = false;
          const fileOneSection = fileOneSections[index];

          for (let i = 0; i < fileTwoSections.length; i++) {
            const fileTwoSection = fileTwoSections[i];

            if (isIntervalslOverlap(fileOneSection.timestamp, fileTwoSection.timestamp)) {
              const text = fileOneSection.text.replace("\n\n", "\n") + fileTwoSection.text;
              mergedSections.push({
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
            mergedSections.push(fileOneSection);
          }
        }

        mergedSections = sortSubtitleSection(
          mergedSections.concat(fileTwoSections.filter((s, i) => !appendedIndex.includes(i)))
        );
        makeSrtFile(joinSubtitleSections(mergedSections));
      }
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
