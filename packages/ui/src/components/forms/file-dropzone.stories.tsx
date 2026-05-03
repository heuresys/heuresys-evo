import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import { FileDropzone } from './file-dropzone';

const meta: Meta<typeof FileDropzone> = {
  title: 'Forms/FileDropzone',
  component: FileDropzone,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof FileDropzone>;

export const Default: Story = {
  args: {
    onFiles: (files) => console.log('files', files),
    label: 'Drop files here or click to browse',
  },
};

export const ImagesOnly: Story = {
  args: {
    accept: 'image/*',
    onFiles: (files) => console.log('images', files),
    label: 'Drop images (PNG, JPG, GIF…)',
  },
};

export const SingleFile: Story = {
  args: {
    multiple: false,
    onFiles: (files) => console.log('single file', files[0]),
    label: 'Select a single file',
  },
};

export const WithSizeLimit: Story = {
  args: {
    maxSize: 1024 * 1024, // 1 MB
    onFiles: (files) => console.log('files', files),
    label: 'Max size: 1 MB per file',
  },
};

function WithProgress() {
  const [files, setFiles] = useState<{ file: File; progress?: number; error?: string }[]>([]);
  // Simulate upload progress
  useEffect(() => {
    if (files.length === 0) return;
    const ids = files.map((_, i) => i);
    const timers = ids.map((i) =>
      setInterval(() => {
        setFiles((prev) => {
          const next = [...prev];
          if (!next[i]) return next;
          const cur = next[i].progress ?? 0;
          next[i] = { ...next[i], progress: Math.min(100, cur + 8) };
          return next;
        });
      }, 200)
    );
    return () => timers.forEach(clearInterval);
  }, [files.length]);
  return (
    <FileDropzone
      onFiles={(newFiles) => {
        const wrapped = newFiles.map((file) => ({ file, progress: 0 }));
        setFiles((prev) => [...prev, ...wrapped]);
      }}
      onRemove={(file) => setFiles((prev) => prev.filter((f) => f.file !== file))}
      files={files}
      label="Drop files — vedrai progress bar simulata"
    />
  );
}
export const WithUploadProgress: Story = {
  render: () => <WithProgress />,
  parameters: {
    docs: {
      description: {
        story: 'Drop file → progress bar simulata 8%/200ms (totale ~2.5s). Pattern upload UX.',
      },
    },
  },
};

function WithErrors() {
  const [files, setFiles] = useState<{ file: File; progress?: number; error?: string }[]>([]);
  return (
    <FileDropzone
      onFiles={(newFiles) => {
        const wrapped = newFiles.map((file, i) => ({
          file,
          error: i % 2 === 0 ? undefined : 'File too large or unsupported format',
          progress: i % 2 === 0 ? 100 : undefined,
        }));
        setFiles((prev) => [...prev, ...wrapped]);
      }}
      onRemove={(file) => setFiles((prev) => prev.filter((f) => f.file !== file))}
      files={files}
      label="Drop files — alternati success/error per demo"
    />
  );
}
export const WithErrors_: Story = { name: 'With Errors', render: () => <WithErrors /> };
