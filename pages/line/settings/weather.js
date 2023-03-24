import Head from 'next/head'
import { useRouter } from 'next/router'

import SettingsHeaderComponent from '../../../components/SettingsHeaderComponent';

export default function LineSetting({ }) {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>每日文大 | 設定</title>
        <link rel="stylesheet" href="/css/LineSetting.css" />
      </Head>
      <SettingsHeaderComponent title="天氣"></SettingsHeaderComponent>
    </div>
  )
}