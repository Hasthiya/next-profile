'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Toolbar from "@/components/Toolbar";

const RichTextEditor = () => {
    const editor: Editor | null = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write something wonderful',
                emptyEditorClass:
                    'cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-2 before:text-mauve-11 before:opacity-50 before-pointer-events-none',
            })
        ],
        editorProps: {
            attributes: {
                class: "min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            }
        },
        onUpdate({editor}){
            console.log(editor.getHTML())
        }
    })

    return (
        <div>
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
};

export default RichTextEditor;