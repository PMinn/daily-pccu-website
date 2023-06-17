import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import { app } from '../../js/firebaseConfig.js';
import { getDatabase, ref as databaseRef, set } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytesResumable } from "firebase/storage";

import ConfirmComponent from '../../components/ConfirmComponent';
import TextareaComponent from '../../components/TextareaComponent';
import LoadingComponent from '../../components/LoadingComponent';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export default function Form() {
  const database = getDatabase(app);
  const storage = getStorage(app);

  const [liffObject, setLiffObject] = useState(null);
  const [liffContext, setLiffContext] = useState(null);
  const [errorText, setErrorText] = useState(null);

  const [formId, setFormId] = useState(new Date().getTime());
  const [files, setFiles] = useState([]);
  const [confirmShow, setConfirmShow] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");
  const [radioGroup, setRadioGroup] = useState("error");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (liffObject != null) {
      var content = textareaValue;
      if (content.replace(/[ \n\t\r]/gi, '') == '') {
        setConfirmShow(true);
        return;
      }
      setLoading(true);
      await set(databaseRef(database, 'form/' + formId), {
        type: radioGroup,
        content,
        uuid: liffContext.userId,
        files: files.map(file => file.serverId)
      })
      await fetch('https://script.google.com/macros/s/AKfycbxc63j004-VBZ6PpN4mbjtaMCmUcBsnQ8Vdz3R_wXEZQTS7k2MZWok-IkKYmL5_x_3AKQ/exec', {
        method: "POST",
        headers: {
          "Content-Type": "text/plain; charset=utf-8"
        },
        body: JSON.stringify({ id: formId })
      })
      setLoading(false);
      setSuccess(true);
    } else {
      setErrorText("錯誤代碼:\nINIT_ERROR_IN_PROGRAM\n\n錯誤訊息:\nLine SDK 初始化失敗\n請重新開啟頁面");
    }
  }

  function handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
    const filePath = `form/${formId}_${file.name.split('.')[0]}.${file.name.split('.').pop()}`;
    const uploadTask = uploadBytesResumable(storageRef(storage, filePath), file);
    uploadTask.on('state_changed',
      snapshot => progress(true, snapshot.bytesTransferred, snapshot.totalBytes),
      err => error(err),
      () => load(filePath)
    );
    return {
      abort: () => {
        uploadTask.cancel();
        abort();
      }
    }
  }

  useEffect(() => {
    import("@line/liff")
      .then(liff => liff.liff)
      .then(liff => {
        liff.init({ liffId: "1655168208-9NvVk86X" })
          .then(() => {
            var context = liff.getContext();
            if (context.type == "none" || context.type == "external") {
              return Promise.reject({
                code: "PROGRAM_FORBIDDEN",
                message: "請使用正常路徑開啟"
              });
            } else {
              setLiffObject(liff);
              setLiffContext(context);
            }
          })
          .catch(err => {
            setErrorText(`錯誤代碼:\n${err.code}\n\n錯誤訊息:\n${err.message}\n請重新開啟頁面`);
          });
      });
  }, []);

  return (
    <div>
      <Head>
        <title>回饋 | 每日文大</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="stylesheet" href="/css/line/form.css" />
      </Head>
      <LoadingComponent show={loading}></LoadingComponent>
      <ConfirmComponent title="請輸入內容" content={"內容不可為空"} show={confirmShow} btn={["確認"]} onClick={[() => setConfirmShow(false)]}></ConfirmComponent>
      <div class="container" style={{ display: (errorText == null && success != true ? '' : 'none') }} >
        <input type="text" id="uuid" hidden />
        <h3>我要回饋的是...</h3>
        <div class="block">
          <div class="radio-group">
            <input type="radio" id="error" name="radio_group" value="error" defaultChecked={true} onClick={() => setRadioGroup("error")} />
            <label for="error" class="radio">錯誤回報</label>
          </div>
          <div class="radio-group">
            <input type="radio" id="suggestion" name="radio_group" value="suggestion" onClick={() => setRadioGroup("suggestion")} />
            <label for="suggestion" class="radio">建議</label>
          </div>
          <div class="radio-group">
            <input type="radio" id="cooperation" name="radio_group" value="cooperation" onClick={() => setRadioGroup("cooperation")} />
            <label for="cooperation" class="radio">合作</label>
          </div>
          <div class="radio-group">
            <input type="radio" id="else" name="radio_group" value="else" onClick={() => setRadioGroup("else")} />
            <label for="else" class="radio">其他</label>
          </div>
        </div>
        <h3>內容是...</h3>
        <div class="block textarea-outter">
          <TextareaComponent rows={5} value={[textareaValue, setTextareaValue]}></TextareaComponent>
        </div>
        <h3>有沒有相關圖片...</h3>
        <div class="block">
          {/* https://pqina.nl/filepond/docs/api/instance/properties/ */}
          <FilePond files={files}
            onupdatefiles={fileItems => setFiles(fileItems)}
            allowMultiple={true}
            allowReplace={false}
            acceptedFileTypes={['image/*']}
            server={{
              process: handleProcessing
            }}
            labelIdle='點擊上傳'
            labelInvalidField='包含無效的檔案'
            labelFileWaitingForSize='等待檔案大小'
            labelFileSizeNotAvailable='無效的檔案大小'
            labelFileLoading='載入中'
            labelFileLoadError='讀取檔案失敗'
            labelFileProcessing='上傳中'
            labelFileProcessingComplete='上傳成功'
            labelFileProcessingAborted='取消上傳'
            labelFileProcessingError='檔案上傳失敗'
            labelFileProcessingRevertError='重新上傳失敗'
            labelFileRemoveError='刪除失敗'
            labelTapToCancel='點擊取消'
            labelTapToRetry='點擊重新上傳'
            labelTapToUndo='點擊刪除'
            labelButtonRemoveItem='刪除'
            labelButtonAbortItemLoad='取消'
            labelButtonRetryItemLoad='重新上傳'
            labelButtonAbortItemProcessing='取消'
            labelButtonRetryItemProcessing='重新上傳'
            labelButtonProcessItem='上傳'
          />
        </div>
        <button id="submit" class="btn btn-second" onClick={submit}>送出</button>
      </div>
      <div className='error' style={{ display: (errorText == null ? 'none' : '') }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
        <pre><span>{errorText}</span></pre>
      </div>
      <div className='success' style={{ display: (success ? '' : 'none') }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M243.33,90.91,114.92,219.31a16,16,0,0,1-22.63,0l-71.62-72a16,16,0,0,1,0-22.61l24-24a16,16,0,0,1,22.57-.06l36.64,35.27.11.11h0l92.73-91.37a16,16,0,0,1,22.58,0l24,23.56A16,16,0,0,1,243.33,90.91Z"></path></svg>
        <div>成功</div>
      </div>
    </div>
  )
}