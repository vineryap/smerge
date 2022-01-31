import { Component, JSX } from "solid-js";

interface filesHandlerFn {
  (files: File[]): void;
}

interface FileInputProps {
  label: string;
  inputId: string;
  filesHandler: filesHandlerFn;
}

const FileInput: Component<FileInputProps> = ({ label, inputId, filesHandler }) => {
  function onDropHandler(e: DragEvent) {
    e.preventDefault();
    if (!e.dataTransfer) return;
    const files = Array.from(e.dataTransfer?.files);
    filesHandler(files);
  }

  function onDragOverhandler(e: DragEvent) {
    e.preventDefault();
  }

  function fileInputOnChangeHandler(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = Array.from(target.files as FileList);
    filesHandler(files);
  }

  return (
    <label
      htmlFor={inputId}
      class="w-full h-64 flex flex-col justify-center items-center px-4 py-6 bg-white text-blue rounded-lg tracking-wide border-4 border-dashed border-gray-300 hover:border-blue-400 cursor-none hover:text-blue-700 transition duration-300 group"
      onDrop={onDropHandler}
      onDragOver={onDragOverhandler}
    >
      <svg
        class="w-8 h-8"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
      </svg>
      <p class="text-center pointer-none text-gray-500 select-none">
        <span>
          Drag and drop subtitles here
          <br />
          <span> or </span>
        </span>
        <span class="text-blue-600 hover:underline cursor-pointer">select the files</span> from your
        computer
      </p>
      <i class="mt-2 text-xs text-gray-500 group-hover:text-blue-600">Supported format: .srt</i>
      <input
        onChange={fileInputOnChangeHandler}
        type="file"
        class="hidden"
        name="subtitleOne"
        id={inputId}
        accept=".srt"
        multiple
      />
    </label>
  );
};

export default FileInput;
