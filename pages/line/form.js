import Head from 'next/head'
import Script from 'next/script'

import styles from '../../styles/LineForm.module.css'


export default function LineSetting({ data }) {
  return (
    <div>
      <Head>
        <title>每日文大 | 回饋</title>
      </Head>
      <Script strategy="afterInteractive" src='/js/form.js' type="module"></Script>
      <div className={styles.envelope}>
        <div className={styles.envelopeBody}></div>
        <div className={styles.envelopeCover}><div></div></div>
      </div>
      <div className={styles.container}>
        <input type="text" id="uuid" hidden />
        <h3>我要回饋的是...</h3>
        <div className={block}>
          <div className={styles.radioGroup}>
            <input type="radio" id="error" name="type" value="error" checked />
            <label for="error" className={styles.radio}>錯誤回報</label>
          </div>
          <div className={styles.radioGroup}>
            <input type="radio" id="suggestion" name="type" value="suggestion" />
            <label for="suggestion" className={styles.radio}>建議</label>
          </div>
          <div className={styles.radioGroup}>
            <input type="radio" id="cooperation" name="type" value="cooperation" />
            <label for="cooperation" className={styles.radio}>合作</label>
          </div>
          <div className={styles.radioGroup}>
            <input type="radio" id="else" name="type" value="else" />
            <label for="else" className={styles.radio}>其他</label>
          </div>
        </div>
        <h3>內容是...</h3>
        <div className={styles.block}>
          <textarea name="content" id="content" cols="30" rows="10"></textarea>
        </div>
        <h3>有沒有相關圖片...</h3>
        <div className={styles.block}>
          <div id="file_block">
          </div>
          <input type="file" name="image" id="image" accept="image/*" />
          <label for="image">選擇照片上傳</label>
        </div>
        <button id="submit" class="btn-primary">送出</button>
      </div>
    </div>
  )
}
