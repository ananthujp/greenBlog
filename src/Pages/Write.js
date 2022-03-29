import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NavBar from "../Components/NavBar";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Sidebar from "../Components/Sidebar";
import { db, storage } from "../firebase";
import {
  updateDoc,
  doc,
  addDoc,
  collection,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { FillingBottle, Messaging } from "react-cssfx-loading/lib";
import useAuth from "../hooks/userAuth";
import { useNavigate } from "react-router-dom";
import { convertFromRaw } from "draft-js";
import { setNotification } from "../Actions/setNotification";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function Write() {
  const uploadCallback = (file) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        uploadBytes(ref(storage, reader.file.name), reader.result).then(
          (snapshot) => {
            getDownloadURL(ref(storage, reader.file.name)).then((url) => {
              console.log(url);
            });
          }
        );
      };
    });
  };
  const x = window.matchMedia("(min-width: 768px)");
  const { role } = useAuth();
  const navigate = useNavigate();
  const route = useLocation();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [title, setTitle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [preview, setPreview] = useState(false);
  const [load, setLoad] = useState(false);
  const docID = route.pathname.split("/")[2]
    ? route.pathname.split("/")[2]
    : "Create";
  const { userID, switChId } = useAuth();
  const docRef = doc(db, "Posts", docID);

  const autoSave = (flag) => {
    setLoad(true);
    userID.id !== "HyAS9bQrGoNbH6yekzzK"
      ? setNotification(
          userID.id,
          flag ? "Your article is submitted" : "Your article is saved as draft",
          "Your article titled " +
            title +
            (flag
              ? " has been submitted for review."
              : " has been saved as draft"),
          flag ? 1 : 2
        )
      : setNotification(
          author.id,
          flag ? "Your article is Approved" : "Your article is submitted",
          "Your article titled " +
            title +
            (flag
              ? " has been approved and live now."
              : "  has been submitted for review."),
          flag ? 0 : 1
        );
    setTimeout(
      () =>
        updateDoc(docRef, {
          user: userID.id !== "HyAS9bQrGoNbH6yekzzK" ? userID.id : author.id,
          title: title,
          timestamp: serverTimestamp(),
          status: flag
            ? userID.id === "HyAS9bQrGoNbH6yekzzK"
              ? "Approved"
              : "Waiting for Review"
            : userID.id === "HyAS9bQrGoNbH6yekzzK"
            ? "Waiting for Review"
            : "Draft Saved",
          data: convertToRaw(editorState.getCurrentContent()),
        }).then(
          userID.id === "HyAS9bQrGoNbH6yekzzK"
            ? navigate("/AdminPanel")
            : navigate("/UserDash")
        ),
      1200
    );
  };
  useEffect(() => {
    docID === "Create"
      ? addDoc(collection(db, "Posts"), {
          title: "",
          user: userID.id,
          timestamp: serverTimestamp(),
        }).then((dc) => navigate(dc.id))
      : getDoc(doc(db, "Posts", docID)).then((dc) => {
          setTitle(dc.data().title);
          setEditorState(
            EditorState.createWithContent(convertFromRaw(dc.data().data))
          );
          getDoc(doc(db, "Profiles", dc.data().user)).then((dic) =>
            setAuthor({ id: dic.id, data: dic.data() })
          );
        });
  }, []);
  return (
    <motion.div className="flex flex-col md:flex-row h-screen">
      <NavBar />
      {docID === "Create" || load === true ? (
        <div className="w-full h-full   bg-white flex flex-col items-center justify-center">
          {load ? (
            <Messaging
              color="#818cf8"
              width="15px"
              height="15px"
              duration="0.5s"
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
        <div className="flex  bg-white px-16 flex-col mt-4 md:mt-16 w-full h-full justify-start">
          {!x.matches && (
            <div className="flex mr-2 flex-col mb-4 bg-indigo-50 px-0 py-1 rounded-full border-b border-gray-100">
              <div className="flex flex-row flex-wrap mb-1 justify-around items-center">
                <button
                  onClick={() => setPreview(!preview)}
                  className={
                    "rounded-full mt-1 mx-0.5 text-white px-3" +
                    (preview ? " bg-gray-400" : " bg-indigo-400")
                  }
                >
                  {preview ? "Close" : "Preview"}
                </button>

                <button
                  onClick={() => autoSave(false)}
                  className="rounded-full mt-1 mx-0.5 bg-gray-400 text-white px-3"
                >
                  {userID.id === "HyAS9bQrGoNbH6yekzzK"
                    ? "Approve Later"
                    : "Save Draft"}
                </button>
                <button
                  onClick={() => autoSave(true)}
                  className="rounded-full mt-1 mx-0.5 bg-green-400 text-white px-3"
                >
                  {userID.id === "HyAS9bQrGoNbH6yekzzK" ? "Approve" : "Submit"}
                </button>
              </div>
            </div>
          )}
          <div className="flex flex-row items-center mb-8">
            <div className="mr-1">
              <img
                src={author?.data.img}
                alt=""
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div className="flex flex-col ml-1">
              <h1 className="font-poplg text-md my-auto">
                {author?.data.name}
              </h1>
              <h1 className=" font-popxs text-xs my-auto">
                {Date().slice(4, 9)} . 6 min read
              </h1>
            </div>
          </div>
          <h1 className="font-pop text-4xl">{title}</h1>
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
          <div className="flex flex-row items-center justify-between">
            <h1 className="font-poplg text-3xl pl-6">Edit Post</h1>
            {!x.matches && (
              <div className="flex mr-2 flex-col mb-4 bg-indigo-50 px-2 py-1 rounded-full border-b border-gray-100">
                <div className="flex flex-row flex-wrap mb-1 justify-around items-center">
                  <button
                    onClick={() => setPreview(!preview)}
                    className={
                      "rounded-full mt-1 mx-0.5 text-white px-3" +
                      (preview ? " bg-gray-400" : " bg-indigo-400")
                    }
                  >
                    {preview ? "Close" : "Preview"}
                  </button>

                  <button
                    onClick={() => autoSave(false)}
                    className="rounded-full mt-1 mx-0.5 bg-gray-400 text-white px-3"
                  >
                    {userID.id === "HyAS9bQrGoNbH6yekzzK"
                      ? "Approve Later"
                      : "Save Draft"}
                  </button>
                  <button
                    onClick={() => autoSave(true)}
                    className="rounded-full mt-1 mx-0.5 bg-green-400 text-white px-3"
                  >
                    {userID.id === "HyAS9bQrGoNbH6yekzzK"
                      ? "Approve"
                      : "Submit"}
                  </button>
                </div>
              </div>
            )}
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Title of the blog"
            className="mx-auto bg-white shadow-sm outline-none placeholder:font-pop  w-[95%] py-1 px-2 text-xl font-semibold max-w-5xl  flex border"
          />
          <div className="flex bg-gray-50 pt-4 flex-row w-full justify-center  my-auto min-h-screen pb-16">
            <Editor
              toolbar={{
                options: [
                  "history",
                  "inline",
                  "image",
                  "blockType",
                  "fontSize",
                  "list",
                  "textAlign",
                  "colorPicker",
                  "link",
                  "embedded",
                  "emoji",

                  "remove",
                ],
                blockType: {
                  inDropdown: true,
                  options: ["Normal", "Blockquote", "Code"],
                  className: undefined,
                  component: undefined,
                  dropdownClassName: undefined,
                },
                image: {
                  // icon: <div>as</div>,
                  className: undefined,
                  component: undefined,
                  popupClassName: undefined,
                  urlEnabled: true,
                  uploadEnabled: true,
                  alignmentEnabled: true,
                  uploadCallback: uploadCallback,
                  previewImage: true,
                  inputAccept:
                    "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                  alt: { present: false, mandatory: false },
                  defaultSize: {
                    height: "auto",
                    width: "auto",
                  },
                },
                fontSize: {
                  defaultSize: {
                    fontSize: 20,
                  },
                  options: [14, 16, 20, 24, 72, 96],
                  className: undefined,
                  component: undefined,
                  dropdownClassName: undefined,
                },
              }}
              toolbarClassName="flex top-0 z-20 mx-auto  w-[95%]"
              editorClassName=" p-10 bg-white shadow-lg w-[95%] mx-auto md:mb-12 border"
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
