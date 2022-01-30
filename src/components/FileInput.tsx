import { Component, JSX } from "solid-js";

interface FileInputHandlerFn {
  (e: Event): void;
}

interface FileInputProps {
  label: string;
  inputId: string;
  fileInputHandler: FileInputHandlerFn;
}

const FileInput: Component<FileInputProps> = ({ label, inputId, fileInputHandler }) => {
  function onChangeHandler(e: Event) {
    fileInputHandler(e);
  }

  return (
    <label
      htmlFor={inputId}
      class="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:text-blue-700 transition"
    >
      <svg
        class="w-8 h-8"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
      </svg>
      <span class="uppercase mt-2 text-base leading-normal">{label}</span>
      <i class="mt-2 text-xs">Supported format: .srt</i>
      <input
        type="file"
        class="hidden"
        name="subtitleOne"
        id={inputId}
        accept=".srt"
        onChange={onChangeHandler}
      />
    </label>
  );
};

export default FileInput;
