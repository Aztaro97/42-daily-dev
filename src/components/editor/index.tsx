import React, { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { postSchema } from "@/schema/postSchema";
import { z } from "zod";
import EditorJS from "@editorjs/editorjs";
import tw from "twin.macro";
import CustomButtom from "@/components/ui/button";
import {FileInput} from "react-daisyui";

interface editorProps {
  post: z.infer<typeof postSchema>;
}

type FormData = z.infer<typeof postSchema>;

export default function Editor({ post }: editorProps) {
  const [isMounted, setIsMounted] = React.useState<boolean>(false);

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(postSchema),
  });

  const ref = useRef<EditorJS>();

  const initializeEditor = useCallback(async () => {
	const EditorJS = (await import("@editorjs/editorjs")).default
    const Header = (await import("@editorjs/header")).default
    const Embed = (await import("@editorjs/embed")).default
    const Table = (await import("@editorjs/table")).default
    const List = (await import("@editorjs/list")).default
    // const Code = (await import("@editorjs/code")).default
    const CodeFlask = (await import("@calumk/editorjs-codeflask")).default
    const LinkTool = (await import("@editorjs/link")).default
    const InlineCode = (await import("@editorjs/inline-code")).default
	const Quote = (await import("@editorjs/quote")).default
	const Marker = (await import("@editorjs/marker")).default
	const Delimiter = (await import("@editorjs/marker")).default
	const Checklist = (await import("@editorjs/checklist")).default
	const ImageTool = (await import("@editorjs/image")).default
	const simpleImage = (await import("@editorjs/simple-image")).default
	const Paragraph = (await import("@editorjs/paragraph")).default
	const Underline = (await import("@editorjs/underline")).default
	const RawTool = (await import("@editorjs/raw")).default
	const Warning = (await import("@editorjs/warning")).default
	
	
    const body = postSchema.parse(post);

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        data: body.content,
        placeholder: "Type your content here...",
        inlineToolbar: true,
        tools: {header: {
			class: Header,
			inlineToolbar: ["link"],
			config: {
			  placeholder: "Header",
			},
			shortcut: "CMD+SHIFT+H",
		  },
		  list: {
			class: List,
			inlineToolbar: true,
			shortcut: "CMD+SHIFT+L",
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
		  image: {
			class: ImageTool,
			config: {
			  endpoints: {
				byFile: "http://localhost:8000/uploadFile", // Your backend file uploader endpoint
				byUrl: "http://localhost:8000/fetchUrl", // Your endpoint that provides uploading by Url
			  },
			} as ImageToolConfig,
		  },
		//   simpleImage: {
		// 	class: SimpleImage,
		// 	config: {
		// 	  endpoints: {
		// 		byFile: "http://localhost:8000/uploadFile", // Your backend file uploader endpoint
		// 		byUrl: "http://localhost:8000/fetchUrl", // Your endpoint that provides uploading by Url
		// 	  },
		// 	} as SimpleImageConfig,
		//   },
		  paragraph: {
			class: Paragraph,
			inlineToolbar: true,
		  },
		  underline: Underline,}
          
      });
    }
  }, [post]);

  const onSubmit = async (formData) => {
    const blockContent = await ref.current?.save();
    console.log(blockContent);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      initializeEditor();
	}
      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    
  }, [isMounted, initializeEditor]);

  if (!isMounted) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="prose-stone prose mx-auto w-[800px]">
		<FileInput className="mb-5" placeholder="Upload file here" size="lg" />
        <TextareaAutosize
          autoFocus
          id="title"
          defaultValue={post.title}
          placeholder="New Post title here..."
          className="w-full resize-none appearance-none overflow-hidden text-5xl font-bold focus:outline-none px-3 py-1 bg-transparent"
          {...register("title")}
        />
        <div id="editor" className={"w-full min-h-[500px] bg-gray-700 mb-5"} />

		<ActionButtonWrapper>
			<CustomButtom type="submit">Publish</CustomButtom>
			<CustomButtom>Save draft</CustomButtom>
		</ActionButtonWrapper>
      </div>
    </form>
  );
}

const ActionButtonWrapper = tw.div`flex justify-end items-center gap-3`
