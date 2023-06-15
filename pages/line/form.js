import Head from 'next/head';
import Script from 'next/script';
import React, { useEffect, useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { database } from '../../js/firebaseConfig.js';
import { ref, set } from "firebase/database";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export default function LineForm({ }) {
  const [files, setFiles] = useState([]);

  function onupdatefiles(fileItems) {
    setFiles(fileItems);
    console.log(fileItems)
  }

  useEffect(() => {
  }, []);

  function submit() {
    let uuid = document.getElementById('uuid').value;
    let type = document.querySelector('input[name="radio_group"]:checked').value;
    let content = document.getElementById('content').value;

    // let files = document.getElementById('filepond').files;
    // let filesUrl = [];
    // for (let i = 0; i < files.length; i++) {
    //   filesUrl.push(files[i].serverId);
    // }

    set(ref(database, 'form/' + new Date().getTime()), {
      type,
      content,
      uuid
      // files: filesUrl
    });
    alert("回報成功！感謝您的回饋！")
  }

  function handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
    //doing some stuff here 
    // if (socket is open) {
    //   progress(true, data.received, blobSize);
    //   // you could compare data.received with blobSize I guess?
    //   if (progress is at 100 %) {
    //     load()
    //   }
    // }
    console.log("handleProcessing", fieldName)
    load()
  }

  return (
    <div>
      <Head>
        <title>回饋 | 每日文大</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="stylesheet" href="/css/LineForm.css?t=2" />
      </Head>
      {/* <Script strategy="afterInteractive" src='/js/form.js' type="module"></Script> */}
      {/* <div class="envelope">
        <div class="envelope-body"></div>
        <div class="envelope-cover">
          <div></div>
        </div>
      </div> */}
      <div class="container">
        <input type="text" id="uuid" hidden />
        <h3>我要回饋的是...</h3>
        <div class="block">
          <div class="radio-group">
            <input type="radio" id="error" name="radio_group" value="error" defaultChecked={true} />
            <label for="error" class="radio">錯誤回報</label>
          </div>
          <div class="radio-group">
            <input type="radio" id="suggestion" name="radio_group" value="suggestion" />
            <label for="suggestion" class="radio">建議</label>
          </div>
          <div class="radio-group">
            <input type="radio" id="cooperation" name="radio_group" value="cooperation" />
            <label for="cooperation" class="radio">合作</label>
          </div>
          <div class="radio-group">
            <input type="radio" id="else" name="radio_group" value="else" />
            <label for="else" class="radio">其他</label>
          </div>
        </div>
        <h3>內容是...</h3>
        <div class="block">
          <textarea name="content" id="content" cols="30" rows="10"></textarea>
        </div>
        <h3>有沒有相關圖片...</h3>
        <div class="block">
          {/* https://pqina.nl/filepond/docs/api/instance/properties/ */}
          <FilePond files={files}
            onupdatefiles={onupdatefiles}
            allowMultiple={true}
            allowReplace={false}
            acceptedFileTypes={['image/*']}
            server={{ process: handleProcessing }}
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
    </div>
  )
}
