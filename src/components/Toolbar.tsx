import { type Editor } from '@tiptap/react'
import { Bold, Italic, Strikethrough, Code, Heading1 } from 'lucide-react'
import {Toggle} from "@/components/ui/toggle";

type ToolbarProps = {
    editor: Editor | null
}

const Toolbar = ({ editor }: ToolbarProps) => {
    if(!editor){
        return null
    }
    return (
        <div className='border border-input bg-transparent mb-2'>
            <Toggle
                size='sm'
                pressed={editor.isActive("heading", { level: 2})}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                <Heading1 className={'h-4 w-4'}/>
            </Toggle>
            <Toggle
                size='sm'
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold className={'h-4 w-4'}/>
            </Toggle>
            <Toggle
                size='sm'
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic className={'h-4 w-4'}/>
            </Toggle>
            <Toggle
                size='sm'
                pressed={editor.isActive("strike")}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            >
                <Strikethrough className={'h-4 w-4'}/>
            </Toggle>
            <Toggle
                size='sm'
                pressed={editor.isActive("code")}
                onPressedChange={() => editor.chain().focus().toggleCode().run()}
            >
                <Code className={'h-4 w-4'}/>
            </Toggle>
        </div>
    );
};

export default Toolbar;