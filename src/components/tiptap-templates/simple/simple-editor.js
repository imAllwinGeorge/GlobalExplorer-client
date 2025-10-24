import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";
// --- UI Primitives ---
import { Button } from "../../tiptap-ui-primitive/button";
import { Spacer } from "../../tiptap-ui-primitive/spacer";
import { Toolbar, ToolbarGroup, ToolbarSeparator, } from "../../tiptap-ui-primitive/toolbar";
// --- Tiptap Node ---
import { ImageUploadNode } from "../../tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "../../tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "../../tiptap-node/blockquote-node/blockquote-node.scss";
import "../../tiptap-node/code-block-node/code-block-node.scss";
import "../../tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "../../tiptap-node/list-node/list-node.scss";
import "../../tiptap-node/image-node/image-node.scss";
import "../../tiptap-node/heading-node/heading-node.scss";
import "../../tiptap-node/paragraph-node/paragraph-node.scss";
// --- Tiptap UI ---
import { HeadingDropdownMenu } from "../../tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "../../tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "../../tiptap-ui/blockquote-button";
import { CodeBlockButton } from "../../tiptap-ui/code-block-button";
import { ColorHighlightPopover, ColorHighlightPopoverContent, ColorHighlightPopoverButton, } from "../../tiptap-ui/color-highlight-popover";
import { LinkPopover, LinkContent, LinkButton, } from "../../tiptap-ui/link-popover";
import { MarkButton } from "../../tiptap-ui/mark-button";
import { TextAlignButton } from "../../tiptap-ui/text-align-button";
import { UndoRedoButton } from "../../tiptap-ui/undo-redo-button";
// --- Icons ---
import { ArrowLeftIcon } from "../../tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "../../tiptap-icons/highlighter-icon";
import { LinkIcon } from "../../tiptap-icons/link-icon";
// --- Hooks ---
import { useIsMobile } from "../../../hooks/use-mobile";
import { useWindowSize } from "../../../hooks/use-window-size";
import { useCursorVisibility } from "../../../hooks/use-cursor-visibility";
// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "../../../lib/tiptap-utils";
// --- Styles ---
import "../../tiptap-templates/simple/simple-editor.scss";
// import content from "@/components/tiptap-templates/simple/data/content.json"
const MainToolbarContent = ({ onHighlighterClick, onLinkClick, isMobile, }) => {
    return (_jsxs(_Fragment, { children: [_jsx(Spacer, {}), _jsxs(ToolbarGroup, { children: [_jsx(UndoRedoButton, { action: "undo" }), _jsx(UndoRedoButton, { action: "redo" })] }), _jsx(ToolbarSeparator, {}), _jsxs(ToolbarGroup, { children: [_jsx(HeadingDropdownMenu, { levels: [1, 2, 3, 4], portal: isMobile }), _jsx(ListDropdownMenu, { types: ["bulletList", "orderedList", "taskList"], portal: isMobile }), _jsx(BlockquoteButton, {}), _jsx(CodeBlockButton, {})] }), _jsx(ToolbarSeparator, {}), _jsxs(ToolbarGroup, { children: [_jsx(MarkButton, { type: "bold" }), _jsx(MarkButton, { type: "italic" }), _jsx(MarkButton, { type: "strike" }), _jsx(MarkButton, { type: "code" }), _jsx(MarkButton, { type: "underline" }), !isMobile ? (_jsx(ColorHighlightPopover, { editor: undefined, hideWhenUnavailable: undefined, onApplied: undefined })) : (_jsx(ColorHighlightPopoverButton, { onClick: onHighlighterClick })), !isMobile ? _jsx(LinkPopover, {}) : _jsx(LinkButton, { onClick: onLinkClick })] }), _jsx(ToolbarSeparator, {}), _jsxs(ToolbarGroup, { children: [_jsx(MarkButton, { type: "superscript" }), _jsx(MarkButton, { type: "subscript" })] }), _jsx(ToolbarSeparator, {}), _jsxs(ToolbarGroup, { children: [_jsx(TextAlignButton, { align: "left" }), _jsx(TextAlignButton, { align: "center" }), _jsx(TextAlignButton, { align: "right" }), _jsx(TextAlignButton, { align: "justify" })] }), _jsx(ToolbarSeparator, {}), _jsx(Spacer, {}), isMobile && _jsx(ToolbarSeparator, {})] }));
};
const MobileToolbarContent = ({ type, onBack, }) => (_jsxs(_Fragment, { children: [_jsx(ToolbarGroup, { children: _jsxs(Button, { "data-style": "ghost", onClick: onBack, children: [_jsx(ArrowLeftIcon, { className: "tiptap-button-icon" }), type === "highlighter" ? (_jsx(HighlighterIcon, { className: "tiptap-button-icon" })) : (_jsx(LinkIcon, { className: "tiptap-button-icon" }))] }) }), _jsx(ToolbarSeparator, {}), type === "highlighter" ? (_jsx(ColorHighlightPopoverContent, {})) : (_jsx(LinkContent, {}))] }));
export function SimpleEditor({ setNewPostRichText, initialContent }) {
    const isMobile = useIsMobile();
    const { height } = useWindowSize();
    const [mobileView, setMobileView] = React.useState("main");
    const toolbarRef = React.useRef(null);
    const editor = useEditor({
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
        content: initialContent || "",
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                "aria-label": "Main content area, start typing to enter text.",
                class: "simple-editor",
            },
        },
        extensions: [
            StarterKit.configure({
                horizontalRule: false,
                link: {
                    openOnClick: false,
                    enableClickSelection: true,
                },
            }),
            HorizontalRule,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Image,
            Typography,
            Superscript,
            Subscript,
            Selection,
            ImageUploadNode.configure({
                accept: "image/*",
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: handleImageUpload,
                onError: (error) => console.error("Upload failed:", error),
            }),
        ],
        // content,
        onUpdate: ({ editor }) => {
            setNewPostRichText(editor.getHTML());
        }
    });
    const rect = useCursorVisibility({
        editor,
        overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
    });
    React.useEffect(() => {
        if (!isMobile && mobileView !== "main") {
            setMobileView("main");
        }
    }, [isMobile, mobileView]);
    return (_jsx("div", { className: "simple-editor-wrapper", children: _jsxs(EditorContext.Provider, { value: { editor }, children: [_jsx(Toolbar, { ref: toolbarRef, style: {
                        ...(isMobile
                            ? {
                                bottom: `calc(100% - ${height - rect.y}px)`,
                            }
                            : {}),
                    }, children: mobileView === "main" ? (_jsx(MainToolbarContent, { onHighlighterClick: () => setMobileView("highlighter"), onLinkClick: () => setMobileView("link"), isMobile: isMobile })) : (_jsx(MobileToolbarContent, { type: mobileView === "highlighter" ? "highlighter" : "link", onBack: () => setMobileView("main") })) }), _jsx(EditorContent, { editor: editor, role: "presentation", className: "simple-editor-content" })] }) }));
}
