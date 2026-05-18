import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  height?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list',
  'blockquote', 'code-block',
  'link', 'image',
  'align',
  'color', 'background',
];

export function RichTextEditor({ value, onChange, label, placeholder, height = '300px' }: RichTextEditorProps) {
  return (
    <div>
      {label && <label className="block text-sm text-gray-700 mb-1">{label}</label>}
      <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ minHeight: height }}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder ?? 'Write your content here...'}
          style={{ height: `calc(${height} - 42px)` }}
        />
      </div>
    </div>
  );
}
