import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../utils/storage';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  previewClassName?: string;
}

export function ImageUpload({ value, onChange, label = 'Image', previewClassName = 'w-full h-32 object-cover rounded-lg' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate client-side
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File terlalu besar. Maksimal 5MB.');
      toast.error('File terlalu besar. Maksimal 5MB.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format file tidak didukung. Gunakan JPG, PNG, GIF, WebP, atau SVG.');
      toast.error('Format file tidak didukung.');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiFetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onChange(data.url);
        toast.success('Upload berhasil!');
      } else {
        const data = await response.json().catch(() => null);
        setError(data?.message ?? 'Upload gagal. Coba lagi.');
        toast.error(data?.message ?? 'Upload gagal. Coba lagi.');
      }
    } catch {
      setError('Upload gagal. Periksa koneksi internet.');
      toast.error('Upload gagal. Periksa koneksi internet.');
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1">{label}</label>
      
      {/* Preview */}
      {value && (
        <div className="relative mb-2 inline-block">
          <img src={value} alt="Preview" className={previewClassName} />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Upload area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL gambar atau upload file..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-1"
        >
          {uploading ? (
            <span className="text-sm">Uploading...</span>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Upload</span>
            </>
          )}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}

      {/* Help text */}
      {!value && !error && (
        <p className="text-xs text-gray-500 mt-1">
          Upload file (JPG, PNG, GIF, WebP, SVG — maks 5MB) atau masukkan URL
        </p>
      )}
    </div>
  );
}
