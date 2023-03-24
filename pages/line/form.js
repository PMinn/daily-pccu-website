import Head from 'next/head'
import Script from 'next/script'

export default function LineForm({ }) {
  return (
    <div>
      <Head>
        <title>每日文大 | 回饋</title>
        <link rel="stylesheet" href="/css/LineForm.css?t=2" />
      </Head>
      <Script strategy="afterInteractive" src='/js/form.js' type="module"></Script>
      <div class="envelope">
        <div class="envelope-body"></div>
        <div class="envelope-cover">
          <div></div>
        </div>
      </div>
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
