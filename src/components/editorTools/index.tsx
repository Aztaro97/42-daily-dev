// import Code from "@editorjs/code"
import CodeFlask from "@calumk/editorjs-codeflask"
import Checklist from "@editorjs/checklist"
import EditorJS from "@editorjs/editorjs"
import Embed from "@editorjs/embed"
import Header from "@editorjs/header"
import ImageTool from "@editorjs/image"
import InlineCode from "@editorjs/inline-code"
import LinkTool from "@editorjs/link"
import List from "@editorjs/list"
import Marker from "@editorjs/marker"
import Delimiter from "@editorjs/marker"
import Paragraph from "@editorjs/paragraph"
import Quote from "@editorjs/quote"
import RawTool from "@editorjs/raw"
import simpleImage from "@editorjs/simple-image"
import Table from "@editorjs/table"
import Underline from "@editorjs/underline"
import Warning from "@editorjs/warning"
import DragDrop from "editorjs-drag-drop"
import AlignmentTuneTool from "editorjs-text-alignment-blocktune"
import Undo from "editorjs-undo"

import { convertToBase64 } from "@/utils/utils"

export const EDITOR_JS_TOOLS = {
  header: {
    class: Header,
    inlineToolbar: ["link"],
    config: {
      placeholder: "Header",
    },
    shortcut: "CMD+SHIFT+H",
    tunes: ["textAlignment"],
  },
  list: {
    class: List,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+L",
    tunes: ["textAlignment"],
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: "Quote's author",
    },
    shortcut: "CMD+SHIFT+O",
  },
  marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+M",
  },
  code: {
    class: CodeFlask,
    inlineToolbar: true,
  },
  delimiter: Delimiter,
  inlineCode: {
    class: InlineCode,
    shortcut: "CMD+SHIFT+C",
  },
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: "http://localhost:8000/fetchUrl", // Your backend endpoint for url data fetching
    },
  },
  embed: {
    class: Embed,
    config: {
      services: {
        youtube: true,
        coub: true,
      },
    },
  },
  table: {
    class: Table,
    inlineToolbar: true,
    shortcut: "CMD+ALT+T",
  },
  warning: Warning,
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
  raw: RawTool,
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    tunes: ["textAlignment"],
  },
  underline: Underline,
  textAlignment: {
    class: AlignmentTuneTool,
    config: {
      default: "left",
      blocks: ["paragraph", "header", "list"],
    },
  },
}
