import { EditorPage } from "./pages/EditorPage.jsx";

export async function loader({ params }) {
  const noteID = params.noteID;
  return { noteUUID: noteID };
}

function Editor() {
  return <EditorPage />;
}

export default Editor;