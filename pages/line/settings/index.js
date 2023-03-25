import Head from 'next/head'
import { useRouter } from 'next/router'

import functions from '../../../data/functions.json';
import SettingsHeaderComponent from '../../../components/SettingsHeaderComponent';

export default function LineSetting({ }) {
  const router = useRouter();
  const onClick = e => {
    let target = e.target;
    while (!target.classList.contains('setting-li')) {
      target = target.parentElement;
    }
    router.push(target.dataset.href, undefined, { shallow: true });
    e.stopPropagation();
  }
  return (
    <div>
      <Head>
        <title>每日文大 | 設定</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="stylesheet" href="/css/LineSetting.css" />
      </Head>
      <SettingsHeaderComponent title="設定" isTop={true}></SettingsHeaderComponent>
      {
        functions.filter(f => f.setting).map(f => {
          return (
            <div class="setting-li" onClick={onClick} data-href={'/line/settings/' + f.id}>
              <div dangerouslySetInnerHTML={{ __html: f.icon }}></div>
              <div class="title">{f.title}</div>
              <div class="preview"></div>
              <svg width="36" height="37" viewBox="0 0 36 37" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.25 33.296C10.5 33.296 9.6 33.146 8.85 32.696C7.05 31.796 6 30.146 6 28.196V8.39595C6 6.44595 7.05 4.79595 8.85 3.89595C10.65 2.99595 12.9 3.14595 14.55 4.34595L27.6 14.246C28.95 15.296 29.7 16.646 29.7 18.296C29.7 19.946 28.95 21.446 27.6 22.346L14.55 32.246C13.65 32.996 12.45 33.296 11.25 33.296Z" />
              </svg>
            </div>
          )
        })
      }
    </div>
  )
}