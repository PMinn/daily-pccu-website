import Head from 'next/head'
import NavComponent from '../components/NavComponent';
import FooterComponent from '../components/FooterComponent';


export default function Home() {
  return (
    <div>
      <Head>
        <title>每日文大</title>
      </Head>
      <NavComponent></NavComponent>
        評價系統
      <FooterComponent></FooterComponent>
      {/* <script type="module" src="/js/index.js"></script> */}
    </div>
  )
}