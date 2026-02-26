import FileManager from '../FileManager';

// files app - access your stuff fr
export default function FilesApp({ userId }) {
  return <FileManager userId={userId} />;
}
