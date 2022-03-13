import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NavBar from "../Components/NavBar";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Sidebar from "../Components/Sidebar";
import { db } from "../firebase";
import {
  updateDoc,
  doc,
  addDoc,
  collection,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { FillingBottle, Messaging } from "react-cssfx-loading/lib";
import useAuth from "../hooks/userAuth";
import { useNavigate } from "react-router-dom";
import { convertFromRaw } from "draft-js";
function Write() {
  const navigate = useNavigate();
  const route = useLocation();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [title, setTitle] = useState(null);
  const [preview, setPreview] = useState(false);
  const [load, setLoad] = useState(false);
  const [docID, setDocID] = useState(
    route.pathname.split("/")[2] ? route.pathname.split("/")[2] : "Create"
  );
  const { userID } = useAuth();
  const docRef = doc(db, "Posts", docID);
  const autoSave = (flag) => {
    setLoad(true);
    updateDoc(docRef, {
      user: userID.id,
      title: title,
      status: flag ? "Waiting for Review" : "Draft Saved",
      data: convertToRaw(editorState.getCurrentContent()),
    }).then(navigate("/UserDash"));
  };
  useEffect(() => {
    docID === "Create"
      ? addDoc(collection(db, "Posts"), {
          title: "",
          user: userID.id,
        }).then((dc) => navigate(dc.id))
      : getDoc(doc(db, "Posts", docID)).then((dc) => {
          setTitle(dc.data().title);
          setEditorState(
            EditorState.createWithContent(convertFromRaw(dc.data().data))
          );
        });
  }, []);

  return (
    <motion.div className="flex flex-row h-screen">
      <NavBar />
      {docID === "Create" || load === true ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          {load ? (
            <Messaging
              color="#818cf8"
              width="100px"
              height="100px"
              duration="2s"
            />
          ) : (
            <FillingBottle
              color="#818cf8"
              width="100px"
              height="100px"
              duration="2s"
            />
          )}
          <h1 className="font-pop text-gray-500 text-center md:text-2xl lg:text-3xl mt-8">
            {load ? "Saving..." : "Creating New Post"}
          </h1>
        </div>
      ) : preview ? (
        <div className="flex mx-16 flex-col mt-16 w-full h-full justify-start">
          <h1 className="font-pop text-3xl">{title}</h1>
          <div
            className="Container"
            dangerouslySetInnerHTML={{
              __html: draftToHtml(
                convertToRaw(editorState.getCurrentContent())
              ),
            }}
          ></div>
        </div>
      ) : (
        <div className="flex flex-col mt-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Title of the blog"
            className="mx-auto bg-white shadow-sm outline-none placeholder:font-pop  w-[95%] py-1 px-2 text-xl font-semibold max-w-5xl  flex border"
          />
          <div className="flex pt-4 flex-row w-full justify-center  my-auto min-h-screen pb-16">
            <Editor
              toolbar={{
                options: [
                  "history",
                  "inline",
                  "blockType",
                  "fontSize",
                  "list",
                  "textAlign",
                  "colorPicker",
                  "link",
                  "embedded",
                  "emoji",
                  "image",
                  "remove",
                ],
                blockType: {
                  inDropdown: true,
                  options: ["Normal", "Blockquote", "Code"],
                  className: undefined,
                  component: undefined,
                  dropdownClassName: undefined,
                },
                fontSize: {
                  options: [8, 9, 10, 11, 12, 24, 72, 96],
                  className: undefined,
                  component: undefined,
                  dropdownClassName: undefined,
                },
              }}
              toolbarClassName="flex sticky top-0 z-20 !justify-center mx-auto"
              editorClassName="mt-8 p-10 bg-white shadow-lg w-[95%] mx-auto mb-12 border"
              editorState={editorState}
              onEditorStateChange={setEditorState}
            />
          </div>
          <div></div>
        </div>
      )}
      <Sidebar preview={setPreview} view={preview} save={autoSave} />
    </motion.div>
  );
}

export default Write;
